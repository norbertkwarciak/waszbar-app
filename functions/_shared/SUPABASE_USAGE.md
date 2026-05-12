# Supabase Shared Module Usage

Moduł [`functions/_shared/supabase.ts`](supabase.ts) zawiera współdzielone funkcje do logowania do Supabase, które mogą być używane w różnych Cloudflare Functions.

## Dostępne funkcje

### `getSupabaseClient(env)`

Inicjalizuje klienta Supabase z credentials ze środowiska.

**Parametry:**

- `env` - obiekt zawierający `SUPABASE_URL` i `SUPABASE_KEY`

**Zwraca:**

- `SupabaseClient` - jeśli credentials są dostępne
- `null` - jeśli credentials nie są skonfigurowane

**Przykład:**

```typescript
import { getSupabaseClient } from './_shared/supabase';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const supabase = getSupabaseClient(context.env);

  if (supabase) {
    // Użyj klienta do dowolnych operacji
    const { data, error } = await supabase
      .from('your_table')
      .insert({ ... });
  }
};
```

### `logTravelCostToSupabase(env, data)`

Dedykowana funkcja do logowania requestów kalkulacji kosztów podróży.

**Parametry:**

- `env` - obiekt środowiska z credentials Supabase
- `data` - obiekt z danymi do zapisania (patrz poniżej)

**Struktura data:**

```typescript
{
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
  error?: string;
  status: 'success' | 'error';
}
```

**Przykład użycia:**

```typescript
import { logTravelCostToSupabase } from './_shared/supabase';

// Logowanie sukcesu
await logTravelCostToSupabase(context.env, {
  request_data: {
    postal_code: '00-001',
    city: 'Warszawa',
    full_address: '00-001 Warszawa',
  },
  geocoding_result: {
    lat: 52.2297,
    lon: 21.0122,
    display_name: 'Warszawa, Polska',
  },
  calculation_result: {
    distance_meters: 45000,
    distance_km: 45,
    cost: 0,
  },
  status: 'success',
});

// Logowanie błędu
await logTravelCostToSupabase(context.env, {
  request_data: {
    postal_code: 'invalid',
    city: 'Unknown',
    full_address: 'invalid Unknown',
  },
  error: 'No geocoding results found',
  status: 'error',
});
```

## Dodawanie własnych funkcji logowania

Jeśli chcesz dodać logowanie dla innych typów requestów, możesz rozszerzyć ten moduł:

```typescript
// W functions/_shared/supabase.ts

export const logCustomEventToSupabase = async (
  env: SupabaseEnv,
  tableName: string,
  data: Record<string, any>,
) => {
  const supabase = getSupabaseClient(env);

  if (!supabase) {
    console.log('[Supabase] Skipping log - client not initialized');
    return;
  }

  try {
    const { error } = await supabase.from(tableName).insert(data);

    if (error) {
      console.error('[Supabase] Failed to log:', error);
    } else {
      console.log('[Supabase] Successfully logged to', tableName);
    }
  } catch (err) {
    console.error('[Supabase] Exception while logging:', err);
  }
};
```

## Wymagania środowiska

Funkcje wymagają następujących zmiennych środowiskowych w Cloudflare Pages:

- `SUPABASE_URL` - URL projektu Supabase
- `SUPABASE_KEY` - Klucz API (anon/public key)

Bez tych zmiennych funkcje będą działać normalnie, ale nie będą zapisywać logów.
