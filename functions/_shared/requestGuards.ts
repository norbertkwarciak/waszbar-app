export interface EnvLike {
  ENVIRONMENT?: 'production' | 'preview' | 'development';
}

function getAllowedOrigins(env: EnvLike): Set<string> {
  const origins = new Set<string>(['https://waszbar.app', 'https://www.waszbar.app']);

  // Allow local dev only outside production
  if (env.ENVIRONMENT !== 'production') {
    origins.add('http://localhost:5173');
    origins.add('http://127.0.0.1:5173');
  }

  return origins;
}

function isAllowedReferer(referer: string | null, env: EnvLike): boolean {
  if (!referer) return false;

  // Prod
  if (referer.startsWith('https://waszbar.app/')) return true;
  if (referer.startsWith('https://www.waszbar.app/')) return true;

  // Dev (only outside production)
  if (env.ENVIRONMENT !== 'production') {
    if (referer.startsWith('http://localhost:5173/')) return true;
    if (referer.startsWith('http://127.0.0.1:5173/')) return true;
  }

  return false;
}

export function assertAllowedOriginOrReferer(request: Request, env: EnvLike): Response | null {
  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');

  const allowedOrigins = getAllowedOrigins(env);
  const allowed = (origin !== null && allowedOrigins.has(origin)) || isAllowedReferer(referer, env);

  if (!allowed) {
    // Intentionally vague; do not leak policy details.
    return new Response('Forbidden', { status: 403 });
  }

  return null;
}
