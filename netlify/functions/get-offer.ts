import { Handler } from '@netlify/functions';
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_OFFER_SHEET_ID!;
const MENU_SHEET_NAME = 'menuPackages';
const EXTRA_SERVICES_SHEET_NAME = 'extraServices';

const handler: Handler = async () => {
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL!,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const menuResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${MENU_SHEET_NAME}'!A:C`,
    });

    const menuRows = menuResponse.data.values ?? [];
    const menuDataRows = menuRows.slice(1);

    const groupedPackages: Record<string, { people: number; price: number }[]> = {};

    menuDataRows.forEach(([name, people, price]) => {
      if (!name || !people || !price) return;

      const key = name.toString().trim();
      const numPeople = Number(people);
      const numPrice = Number(price);

      if (!groupedPackages[key]) {
        groupedPackages[key] = [];
      }

      groupedPackages[key].push({ people: numPeople, price: numPrice });
    });

    const menuPackages = Object.entries(groupedPackages).map(([name, prices]) => ({
      name,
      prices: prices.sort((a, b) => a.people - b.people),
    }));

    const extraResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${EXTRA_SERVICES_SHEET_NAME}'!A:D`,
    });

    const extraRows = extraResponse.data.values ?? [];
    const extraDataRows = extraRows.slice(1);

    const extraServices = extraDataRows
      .map(([label, id, price, description]) => {
        if (!label || !id || !price) return null;

        return {
          id: id.toString().trim(),
          label: label.toString().trim(),
          price: Number(price),
          description: description?.toString().trim() ?? '',
        };
      })
      .filter(
        (entry): entry is { id: string; label: string; price: number; description: string } =>
          entry !== null,
      );

    return {
      statusCode: 200,
      body: JSON.stringify({
        menuPackages,
        extraServices,
      }),
    };
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

export { handler };
