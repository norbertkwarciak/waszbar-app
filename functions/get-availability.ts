import { getGoogleAccessToken } from './google-service-account';

interface Env {
  GOOGLE_SHEET_ID: string;
  GOOGLE_CLIENT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
}

type Row = [string?, string?];

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const token = await getGoogleAccessToken(context.env, [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
  ]);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${context.env.GOOGLE_SHEET_ID}/values/Arkusz1!A:B`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        error: 'Google Sheets API error',
        status: res.status,
      }),
      { status: 500 },
    );
  }

  const json = (await res.json()) as {
    values?: Row[];
  };

  const rows = json.values;

  if (!rows || rows.length === 0) {
    return new Response(JSON.stringify({ takenDates: [], lastCheckedDate: null }), { status: 200 });
  }

  const dataRows = rows.slice(1);

  const takenDates = dataRows
    .filter((r) => r[0] && r[1]?.toLowerCase() === 'nie')
    .map((r) => r[0] as string);

  const lastRowWithDate = [...dataRows].reverse().find((r) => r[0]);
  const lastCheckedDate = lastRowWithDate ? lastRowWithDate[0] : null;

  return new Response(JSON.stringify({ takenDates, lastCheckedDate }), { status: 200 });
};
