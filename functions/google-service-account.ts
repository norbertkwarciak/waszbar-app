import { importPKCS8, SignJWT } from 'jose';

interface EnvWithGoogleSa {
  GOOGLE_CLIENT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
}

type GoogleTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export async function getGoogleAccessToken(
  env: EnvWithGoogleSa,
  scopes: string[],
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const pkcs8 = env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
  const key = await importPKCS8(pkcs8, 'RS256');

  const assertion = await new SignJWT({
    scope: scopes.join(' '),
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(env.GOOGLE_CLIENT_EMAIL)
    .setSubject(env.GOOGLE_CLIENT_EMAIL)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60)
    .sign(key);

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token error: ${res.status} ${text.slice(0, 300)}`);
  }

  const json = (await res.json()) as GoogleTokenResponse;
  return json.access_token;
}
