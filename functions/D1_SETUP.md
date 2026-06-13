# Cloudflare D1 setup (travel_cost_logs)

The app logs each travel-cost calculation to a Cloudflare D1 database via the
`DB` binding. Logging fails silently if the binding is missing, so the main
request flow is never affected.

## One-time setup

```bash
# 1. Authenticate wrangler (the saved token may be expired)
npx wrangler login

# 2. Create the D1 database
npx wrangler d1 create waszbar-travel-cost-logs
# -> copy the printed database_id into wrangler.toml (replace PASTE_DATABASE_ID_HERE)

# 3. Apply the schema to the remote database
npx wrangler d1 execute waszbar-travel-cost-logs --remote --file=./migrations/0001_travel_cost_logs.sql

# (optional) apply locally too, for `wrangler pages dev`
npx wrangler d1 execute waszbar-travel-cost-logs --local --file=./migrations/0001_travel_cost_logs.sql
```

The Pages project picks up the `[[d1_databases]]` binding from `wrangler.toml`
on the next deploy. (If your Pages project was created via the dashboard rather
than wrangler, also add the same binding under
Pages → Settings → Functions → D1 database bindings: variable name `DB`.)

## Verify

```bash
npx wrangler d1 execute waszbar-travel-cost-logs --remote \
  --command "SELECT count(*) AS n FROM travel_cost_logs;"
```

## Importing existing logs from Supabase

See the "Data transfer" steps shared during the migration. In short:
1. Restore the paused Supabase project, then `pg_dump` the table data as
   column-inserts.
2. Strip Postgres-specific lines, point the inserts at `travel_cost_logs`.
3. `npx wrangler d1 execute waszbar-travel-cost-logs --remote --file=./logs-import.sql`
