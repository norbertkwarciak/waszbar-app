# Supabase Setup for Travel Cost Logging

This guide explains how to set up Supabase for logging travel cost calculation requests.

## Prerequisites

- Supabase account (create one at https://supabase.com)
- Access to Cloudflare Pages environment variables

## Setup Steps

### 1. Create Supabase Project

1. Log in to https://supabase.com
2. Create a new project
3. Wait for the project to be initialized

### 2. Create Database Table

1. Go to the SQL Editor in your Supabase dashboard
2. Run the SQL script from `functions/supabase-schema.sql`
3. Verify the table was created in the Table Editor

### 3. Get API Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 4. Configure Environment Variables

Add the following environment variables to your Cloudflare Pages project:

```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### For Cloudflare Pages:

1. Go to your Cloudflare Pages project dashboard
2. Navigate to Settings → Environment Variables
3. Add both `SUPABASE_URL` and `SUPABASE_KEY`
4. Apply to both Production and Preview environments

### 5. Test the Integration

Once configured, the `calculate-travel-cost` function will automatically log all requests to your Supabase database.

## Database Schema

The `travel_cost_logs` table stores:

- **Request data**: postal code, city, full address
- **Geocoding results**: latitude, longitude, display name
- **Calculation results**: distance (meters/km), cost
- **Status**: success or error
- **Error messages**: if applicable
- **Timestamp**: when the request was made

## Querying Logs

### View recent requests:

```sql
SELECT * FROM travel_cost_logs
ORDER BY created_at DESC
LIMIT 100;
```

### Count requests by status:

```sql
SELECT status, COUNT(*)
FROM travel_cost_logs
GROUP BY status;
```

### Find errors:

```sql
SELECT created_at, full_address, error_message
FROM travel_cost_logs
WHERE status = 'error'
ORDER BY created_at DESC;
```

### Average distance and cost:

```sql
SELECT
  COUNT(*) as total_requests,
  AVG(distance_km) as avg_distance_km,
  AVG(cost) as avg_cost,
  MAX(cost) as max_cost
FROM travel_cost_logs
WHERE status = 'success';
```

## Notes

- The logging is optional - if `SUPABASE_URL` or `SUPABASE_KEY` are not set, the function will continue to work but won't log to the database
- The Supabase client uses the `anon` key which should be safe for server-side use
- Consider setting up Row Level Security (RLS) policies in Supabase for added security
- You can view logs in real-time using the Supabase Table Editor
