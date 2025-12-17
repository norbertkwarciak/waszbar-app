import { getGoogleAccessToken } from './google-service-account';

interface Env {
  GOOGLE_INQUIRY_SHEET_ID: string;
  GOOGLE_CLIENT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  TURNSTILE_SECRET_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const rawBody = await context.request.text();
  const requestData = JSON.parse(rawBody || '{}');

  const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: context.env.TURNSTILE_SECRET_KEY,
      response: requestData.turnstileToken ?? '',
    }),
  });

  const verificationData = (await verification.json()) as { success: boolean };

  if (!verificationData.success) {
    return new Response(JSON.stringify({ error: 'Captcha verification failed' }), { status: 400 });
  }

  const dayjs = (await import('dayjs')).default;

  const token = await getGoogleAccessToken(context.env, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);

  const {
    date,
    fullName,
    email,
    phone,
    numberOfGuests,
    venueLocation,
    selectedPackage,
    selectedBar,
    selectedServices,
    notes,
    isIndividualOffer,
  } = requestData;

  const row = [
    dayjs().format('YYYY-MM-DD HH:mm'),
    date ?? '',
    fullName ?? '',
    email ?? '',
    phone ?? '',
    numberOfGuests ?? '',
    venueLocation ?? '',
    selectedPackage ?? '',
    selectedBar ?? '',
    Array.isArray(selectedServices) ? selectedServices.join(', ') : '',
    notes ?? '',
    isIndividualOffer ? 'TAK' : '',
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${context.env.GOOGLE_INQUIRY_SHEET_ID}/values/Arkusz1!A1:L1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    },
  );

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        error: 'Google Sheets append failed',
        status: res.status,
      }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify({ message: 'Form submitted successfully' }), { status: 200 });
};
