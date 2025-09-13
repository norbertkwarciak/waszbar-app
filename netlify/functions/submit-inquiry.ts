import type { Handler } from '@netlify/functions';
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_INQUIRY_SHEET_ID!;
const SHEET_NAME = 'Arkusz1';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const requestData = JSON.parse(event.body ?? '{}');
    const { turnstileToken } = requestData;

    // 🔐 Verify Turnstile token with Cloudflare
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: turnstileToken,
      }),
    });

    const verificationData = await verification.json();

    if (!verificationData.success) {
      console.error('Turnstile verification failed:', verificationData);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Captcha verification failed' }),
      };
    }

    // ✅ Captcha passed → proceed with saving to Google Sheets
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL!,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

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
    } = requestData;

    const row = [
      date || '',
      fullName || '',
      email || '',
      phone || '',
      numberOfGuests || '',
      venueLocation || '',
      selectedPackage || '',
      selectedBar || '',
      (selectedServices ?? []).join(', '),
      notes || '',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:J1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully' }),
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

export { handler };
