-- Schema for travel_cost_logs table in Supabase
-- This table stores logs of all travel cost calculation requests

CREATE TABLE IF NOT EXISTS travel_cost_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Request data
    postal_code TEXT,
    city TEXT,
    full_address TEXT,

    -- Geocoding results
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    display_name TEXT,

    -- Calculation results
    distance_meters DOUBLE PRECISION,
    distance_km DOUBLE PRECISION,
    cost DOUBLE PRECISION,

    -- Client location (from Cloudflare request.cf)
    client_country TEXT,

    -- Status and errors
    status TEXT NOT NULL CHECK (status IN ('success', 'error')),
    error_message TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_travel_cost_logs_created_at ON travel_cost_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_travel_cost_logs_status ON travel_cost_logs(status);
CREATE INDEX IF NOT EXISTS idx_travel_cost_logs_city ON travel_cost_logs(city);

-- Add comment to table
COMMENT ON TABLE travel_cost_logs IS 'Logs of travel cost calculation requests for analytics and debugging';
