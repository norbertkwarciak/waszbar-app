import { logTravelCostToSupabase } from './_shared/supabase';

interface Env {
  OPENROUTESERVICE_API_KEY: string;
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
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
    await logTravelCostToSupabase(context.env, {
      request_data: {
        postal_code: '',
        city: '',
        full_address: '',
      },
      error: 'Invalid JSON body',
      status: 'error',
    });

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

  // Log incoming request
  console.log('[calculate-travel-cost] Request:', {
    postalCode,
    city,
    fullAddress,
    userAgent: context.request.headers.get('User-Agent'),
    cfCountry: context.request.headers.get('CF-IPCountry'),
  });

  const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    fullAddress,
  )}&countrycodes=pl&limit=1`;

  console.log('[calculate-travel-cost] Nominatim query URL:', nominatimUrl);

  const geoRes = await fetch(nominatimUrl, {
    headers: {
      'User-Agent': 'waszbar-app (norbert.kwarciak@gmail.com)',
      'Accept-Language': 'pl',
    },
  });

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

  console.log('[calculate-travel-cost] Nominatim results:', {
    count: geoJson.length,
    first: geoJson[0],
  });

  const first = geoJson[0];
  if (!first?.lat || !first?.lon) {
    console.log('[calculate-travel-cost] No results from Nominatim');

    // Log error to Supabase
    await logTravelCostToSupabase(context.env, {
      request_data: {
        postal_code: postalCode,
        city,
        full_address: fullAddress,
      },
      error: 'No geocoding results found',
      status: 'error',
    });

    return new Response(
      JSON.stringify({
        error:
          'Obsługujemy tylko lokalizacje w Polsce. Proszę wprowadzić prawidłową miejscowość w Polsce.',
      }),
      {
        status: 404,
      },
    );
  }

  const lat = parseFloat(first.lat);
  const lon = parseFloat(first.lon);

  console.log('[calculate-travel-cost] Geocoded location:', {
    lat,
    lon,
    display_name: first.display_name,
  });

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

  console.log('[calculate-travel-cost] Calculation result:', {
    distanceMeters,
    distanceKm,
    cost,
    freeDistanceKm: FREE_DISTANCE_KM,
    pricePerKm: PRICE_PER_KM,
  });

  // Log successful result to Supabase
  await logTravelCostToSupabase(context.env, {
    request_data: {
      postal_code: postalCode,
      city,
      full_address: fullAddress,
    },
    geocoding_result: {
      lat,
      lon,
      display_name: first.display_name ?? '',
    },
    calculation_result: {
      distance_meters: distanceMeters,
      distance_km: distanceKm,
      cost,
    },
    status: 'success',
  });

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
