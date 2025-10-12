import type { Handler } from '@netlify/functions';

const START_COORDS = {
  lat: 52.1565984,
  lon: 21.0356576,
};

const ROUNDING_UNIT = 10;
const PRICE_PER_KM = 0.9;
const FREE_DISTANCE_KM = 30;

const OPENROUTESERVICE_API_KEY = process.env.OPENROUTESERVICE_API_KEY;

const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const { postalCode, city } = JSON.parse(event.body || '{}');

    if (!postalCode || !city) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Kod pocztowy i miasto są wymagane.' }),
      };
    }

    const fullAddress = `${postalCode.trim()} ${city.trim()}`;

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        fullAddress,
      )}&countrycodes=pl&limit=1`,
    );

    const geoData = await geoRes.json();

    if (!geoData.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Nie znaleziono lokalizacji dla podanego adresu.' }),
      };
    }

    const { lat, lon, display_name } = geoData[0];

    const normalize = (str: string): string =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s/g, '');

    const normalizedDisplayName = normalize(display_name);
    const normalizedCity = normalize(city);
    const normalizedPostalCode = normalize(postalCode);

    const cityMatches = normalizedDisplayName.includes(normalizedCity);
    const postalMatches =
      normalizedDisplayName.includes(normalizedPostalCode) ||
      normalizedDisplayName.includes(normalizedPostalCode.replace('-', ''));

    if (!cityMatches || !postalMatches) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Kod pocztowy nie pasuje do podanego miasta. Sprawdź poprawność danych.',
        }),
      };
    }

    const matrixRes = await fetch('https://api.openrouteservice.org/v2/matrix/driving-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: OPENROUTESERVICE_API_KEY ?? '',
      },
      body: JSON.stringify({
        locations: [
          [START_COORDS.lon, START_COORDS.lat],
          [parseFloat(lon), parseFloat(lat)],
        ],
        metrics: ['distance'],
      }),
    });

    const matrixData = await matrixRes.json();
    const distanceMeters = matrixData?.distances?.[0]?.[1];

    if (!distanceMeters) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Błąd podczas obliczania odległości.' }),
      };
    }

    const distanceKm = distanceMeters / 1000;

    let cost = 0;

    if (distanceKm > FREE_DISTANCE_KM) {
      const raw = 2 * distanceKm * PRICE_PER_KM;
      cost = Math.floor(raw / ROUNDING_UNIT) * ROUNDING_UNIT;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        distanceKm: Math.round(distanceKm),
        cost,
        location: {
          lat,
          lon,
          displayName: display_name,
        },
      }),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message || 'Wystąpił nieoczekiwany błąd.',
      }),
    };
  }
};

export { handler };
