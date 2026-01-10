import { getGoogleAccessToken } from './google-service-account';

interface Env {
  GOOGLE_INQUIRY_SHEET_ID: string;
  GOOGLE_CLIENT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  BREVO_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const rawBody = await context.request.text();
  const requestData = JSON.parse(rawBody || '{}');

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
    honeypot,
  } = requestData;

  // Honeypot check: if filled, it's likely a bot.
  // Return 200 to avoid training bots; do not append to Sheets or send emails.
  if (honeypot && typeof honeypot === 'string' && honeypot.trim() !== '') {
    return new Response(JSON.stringify({ message: 'Form submitted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Length validation
  const tooLong = (v: unknown, max: number): boolean => typeof v === 'string' && v.length > max;

  if (
    tooLong(fullName, 80) ||
    tooLong(email, 254) ||
    tooLong(phone, 30) ||
    tooLong(notes, 2000) ||
    tooLong(venueLocation, 120)
  ) {
    return new Response(JSON.stringify({ error: 'Invalid submission' }), { status: 400 });
  }

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

  // Send emails after successful submission
  try {
    const { createAdminNotificationEmail } = await import('../emailTemplates/admin-notification');
    const { createUserConfirmationEmail } = await import('../emailTemplates/user-confirmation');

    const ADMIN_EMAIL = 'biuro@waszbar.pl';
    const ADMIN_SENDER_NAME = 'Waszbar.pl';
    const SECONDARY_ADMIN_EMAIL = 'norbert.kwarciak@gmail.com';

    const sendEmail = async (payload: unknown): Promise<void> => {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': context.env.BREVO_API_KEY,
        },
        body: JSON.stringify(payload),
      });
    };

    // Prepare email data with proper structure
    const emailData = {
      date: requestData.date,
      fullName: requestData.fullName,
      email: requestData.email,
      phone: requestData.phone,
      numberOfGuests: requestData.numberOfGuests,
      venueLocation: requestData.venueLocation,
      selectedPackage: requestData.selectedPackage,
      selectedBar: requestData.selectedBar,
      selectedServices: requestData.selectedServicesObjects || [],
      notes: requestData.notes,
      isIndividualOffer: requestData.isIndividualOffer,
      packagePrice: requestData.packagePrice || 0,
      travelCost: requestData.travelCost || 0,
      totalCost: requestData.totalCost || 0,
    };

    const userEmail = createUserConfirmationEmail({
      ...emailData,
      senderEmail: ADMIN_EMAIL,
      senderName: ADMIN_SENDER_NAME,
    });

    const adminNotification = createAdminNotificationEmail({
      ...emailData,
      senderEmail: ADMIN_EMAIL,
      senderName: ADMIN_SENDER_NAME,
      adminEmails: [
        { email: ADMIN_EMAIL, name: 'Biuro Waszbar' },
        { email: SECONDARY_ADMIN_EMAIL, name: 'Norbert' },
      ],
    });

    await sendEmail(userEmail);
    await sendEmail(adminNotification);
  } catch (emailError) {
    // Log email error but don't fail the entire request
    console.error('Email send failed:', emailError);
  }

  return new Response(JSON.stringify({ message: 'Form submitted successfully' }), { status: 200 });
};
