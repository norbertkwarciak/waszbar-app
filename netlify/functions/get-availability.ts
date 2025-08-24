import { Handler } from '@netlify/functions';
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = 'Arkusz1';

const handler: Handler = async () => {
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL!,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!A:B`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return { statusCode: 200, body: JSON.stringify([]) };
    }

    const data = rows
      .filter(([date, status]) => status?.toLowerCase() === 'tak' && date)
      .map(([date]) => date);

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    console.error('Error fetching spreadsheet:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
    };
  }
};

export { handler };
