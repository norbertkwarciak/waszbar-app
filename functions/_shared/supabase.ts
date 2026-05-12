import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseEnv {
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
}

/**
 * Initialize Supabase client with environment credentials
 * Returns null if credentials are not configured
 */
export const getSupabaseClient = (env: SupabaseEnv): SupabaseClient | null => {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('[Supabase] Missing credentials - logging disabled');
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

/**
 * Log travel cost calculation request to Supabase
 */
export const logTravelCostToSupabase = async (
  env: SupabaseEnv,
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
  const supabase = getSupabaseClient(env);

  if (!supabase) {
    console.log('[Supabase] Skipping log - client not initialized');
    return;
  }

  try {
    const { error } = await supabase.from('travel_cost_logs').insert({
      postal_code: data.request_data.postal_code,
      city: data.request_data.city,
      full_address: data.request_data.full_address,
      latitude: data.geocoding_result?.lat,
      longitude: data.geocoding_result?.lon,
      display_name: data.geocoding_result?.display_name,
      distance_meters: data.calculation_result?.distance_meters,
      distance_km: data.calculation_result?.distance_km,
      cost: data.calculation_result?.cost,
      client_country: data.client_location?.country,
      status: data.status,
      error_message: data.error,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[Supabase] Failed to log:', error);
    } else {
      console.log('[Supabase] Successfully logged request');
    }
  } catch (err) {
    console.error('[Supabase] Exception while logging:', err);
  }
};
