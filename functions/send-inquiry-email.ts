import { assertAllowedOriginOrReferer } from './_shared/requestGuards';

interface Env {
  BREVO_API_KEY: string;
  ENVIRONMENT?: 'production' | 'preview' | 'development';
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  // Method guard (Pages routes onRequestPost already narrows, but keeping is fine)
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // --- Origin / Referer allowlist ---
  const forbidden = assertAllowedOriginOrReferer(context.request, context.env);
  if (forbidden) return forbidden;

  const body = await context.request.text();
  const data = JSON.parse(body || '{}');

  // Honeypot: bots often fill hidden fields.
  // If filled, pretend success (or block) to avoid training bots.
  if (typeof data?.honeypot === 'string' && data.honeypot.trim() !== '') {
    return new Response(JSON.stringify({ message: 'OK' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { createAdminNotificationEmail } = await import('../emailTemplates/admin-notification');
  const { createUserConfirmationEmail } = await import('../emailTemplates/user-confirmation');

  const ADMIN_EMAIL = 'biuro@waszbar.pl';
  const ADMIN_SENDER_NAME = 'Waszbar.pl';
  const SECONDARY_ADMIN_EMAIL = 'norbert.kwarciak@gmail.com';

  const apiKey = context.env.BREVO_API_KEY;

  const sendEmail = async (payload: unknown): Promise<void> => {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Brevo error: ${res.status}`);
    }
  };

  const userEmail = createUserConfirmationEmail({
    ...data,
    senderEmail: ADMIN_EMAIL,
    senderName: ADMIN_SENDER_NAME,
  });

  const adminNotification = createAdminNotificationEmail({
    ...data,
    senderEmail: ADMIN_EMAIL,
    senderName: ADMIN_SENDER_NAME,
    adminEmails: [
      { email: ADMIN_EMAIL, name: 'Biuro Waszbar' },
      { email: SECONDARY_ADMIN_EMAIL, name: 'Norbert' },
    ],
  });

  try {
    await sendEmail(userEmail);
    await sendEmail(adminNotification);

    return new Response(JSON.stringify({ message: 'Emails sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Email send failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
