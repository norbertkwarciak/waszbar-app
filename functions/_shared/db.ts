interface LogEnv {
  DB?: D1Database;
}

/**
 * Log travel cost calculation request to Cloudflare D1.
 * No-ops silently if the DB binding is not configured, so the main
 * request flow is never affected by logging.
 */
export const logTravelCost = async (
  env: LogEnv,
  data: {
    request_data: {
      postal_code: string;
      city: string;
      full_address: string;
    };
    geocoding_result?: {
      lat: number;
      lon: number;
      display_name: string;
    };
    calculation_result?: {
      distance_meters: number;
      distance_km: number;
      cost: number;
    };
    client_location?: {
      country?: string;
    };
    error?: string;
    status: 'success' | 'error';
  },
): Promise<void> => {
  if (!env.DB) {
    console.log('[D1] Skipping log - database binding not configured');
    return;
  }

  try {
    await env.DB.prepare(
      `INSERT INTO travel_cost_logs (
        postal_code, city, full_address, latitude, longitude, display_name,
        distance_meters, distance_km, cost, client_country, status, error_message, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        data.request_data.postal_code,
        data.request_data.city,
        data.request_data.full_address,
        data.geocoding_result?.lat ?? null,
        data.geocoding_result?.lon ?? null,
        data.geocoding_result?.display_name ?? null,
        data.calculation_result?.distance_meters ?? null,
        data.calculation_result?.distance_km ?? null,
        data.calculation_result?.cost ?? null,
        data.client_location?.country ?? null,
        data.status,
        data.error ?? null,
        new Date().toISOString(),
      )
      .run();

    console.log('[D1] Successfully logged request');
  } catch (err) {
    console.error('[D1] Exception while logging:', err);
  }
};
