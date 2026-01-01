interface Env {
  OPENROUTESERVICE_API_KEY: string;
}

type CalculateTravelCostBody = {
  postalCode?: string;
  city?: string;
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const apiKey = context.env.OPENROUTESERVICE_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Brak API KEY w środowisku.' }), {
      status: 500,
    });
  }

  const body = (await context.request.json().catch(() => null)) as CalculateTravelCostBody | null;

  if (!body) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
    });
  }

  const START_COORDS = { lat: 52.1565984, lon: 21.0356576 };
  const ROUNDING_UNIT = 10;
  const PRICE_PER_KM = 0.8;
  const FREE_DISTANCE_KM = 50;

  const postalCode = body.postalCode?.trim() ?? '';
  const city = body.city?.trim() ?? '';
  const fullAddress = `${postalCode} ${city}`;

  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      fullAddress,
    )}&countrycodes=pl&limit=1`,
    {
      headers: {
        'User-Agent': 'waszbar-app (norbert.kwarciak@gmail.com)',
        'Accept-Language': 'pl',
      },
    },
  );

  const geoContentType = geoRes.headers.get('content-type') ?? '';
  if (!geoContentType.includes('application/json')) {
    const errorText = await geoRes.text();
    return new Response(
      JSON.stringify({
        error: 'Błąd zapytania do OpenStreetMap (Nominatim)',
        status: geoRes.status,
        contentType: geoContentType,
        details: errorText.slice(0, 300),
      }),
      { status: 502 },
    );
  }

  const geoJson = (await geoRes.json()) as Array<{
    lat?: string;
    lon?: string;
    display_name?: string;
  }>;

  const first = geoJson[0];
  if (!first?.lat || !first?.lon) {
    return new Response(JSON.stringify({ error: 'Nie znaleziono lokalizacji.' }), {
      status: 404,
    });
  }

  const lat = parseFloat(first.lat);
  const lon = parseFloat(first.lon);

  const matrixReq = {
    locations: [
      [START_COORDS.lon, START_COORDS.lat],
      [lon, lat],
    ],
    metrics: ['distance'],
  };

  const matrixRes = await fetch('https://api.openrouteservice.org/v2/matrix/driving-car', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify(matrixReq),
  });

  const matrixContentType = matrixRes.headers.get('content-type') ?? '';
  if (!matrixRes.ok || !matrixContentType.includes('application/json')) {
    const errorText = await matrixRes.text();
    return new Response(
      JSON.stringify({
        error: 'Błąd ORS',
        status: matrixRes.status,
        contentType: matrixContentType,
        details: errorText.slice(0, 300),
      }),
      { status: 502 },
    );
  }

  const matrixJson = (await matrixRes.json()) as {
    distances?: number[][];
  };

  const distanceMeters = matrixJson.distances?.[0]?.[1] ?? 0;
  const distanceKm = distanceMeters / 1000;

  let cost = 0;
  if (distanceKm > FREE_DISTANCE_KM) {
    const raw = 2 * distanceKm * PRICE_PER_KM;
    cost = Math.floor(raw / ROUNDING_UNIT) * ROUNDING_UNIT;
  }

  return new Response(
    JSON.stringify({
      cost,
      distanceKm: Math.round(distanceKm),
      location: {
        lat,
        lon,
        displayName: first.display_name ?? '',
      },
    }),
    { status: 200 },
  );
};
