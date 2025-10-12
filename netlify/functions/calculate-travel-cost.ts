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
    console.log('[DEBUG] Start calculate-travel-cost');
    console.log('[DEBUG] ENV KEY length:', OPENROUTESERVICE_API_KEY?.length || 'MISSING');

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    if (!OPENROUTESERVICE_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Brak API KEY w środowisku.' }),
      };
    }

    const { postalCode, city } = JSON.parse(event.body || '{}');
    const fullAddress = `${postalCode?.trim()} ${city?.trim()}`;

    console.log('[DEBUG] Full address:', fullAddress);

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        fullAddress,
      )}&countrycodes=pl&limit=1`,
    );

    const geoData = await geoRes.json();
    const { lat, lon, display_name } = geoData?.[0] || {};

    if (!lat || !lon) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Nie znaleziono lokalizacji.' }),
      };
    }

    const locationsPayload = {
      locations: [
        [START_COORDS.lon, START_COORDS.lat],
        [parseFloat(lon), parseFloat(lat)],
      ],
      metrics: ['distance'],
    };

    console.log('[DEBUG] Sending ORS payload:', JSON.stringify(locationsPayload));

    const matrixRes = await fetch('https://api.openrouteservice.org/v2/matrix/driving-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: OPENROUTESERVICE_API_KEY,
      },
      body: JSON.stringify(locationsPayload),
    });

    const contentType = matrixRes.headers.get('content-type');
    console.log('[DEBUG] ORS status:', matrixRes.status);
    console.log('[DEBUG] ORS content-type:', contentType);

    if (!matrixRes.ok || !contentType?.includes('application/json')) {
      const errorText = await matrixRes.text();
      console.error('[ORS ERROR]', matrixRes.status, errorText.slice(0, 300));

      return {
        statusCode: 502,
        body: JSON.stringify({
          error: 'Błąd ORS',
          status: matrixRes.status,
          contentType,
          details: errorText.slice(0, 300),
        }),
      };
    }

    const matrixData = await matrixRes.json();

    const distanceMeters = matrixData?.distances?.[0]?.[1];
    const distanceKm = distanceMeters / 1000;

    let cost = 0;

    if (distanceKm > FREE_DISTANCE_KM) {
      const raw = 2 * distanceKm * PRICE_PER_KM;
      cost = Math.floor(raw / ROUNDING_UNIT) * ROUNDING_UNIT;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        cost,
        distanceKm: Math.round(distanceKm),
        location: {
          lat,
          lon,
          displayName: display_name,
        },
      }),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('[FATAL ERROR]', err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Unhandled error',
        message: err?.message,
      }),
    };
  }
};

export { handler };
