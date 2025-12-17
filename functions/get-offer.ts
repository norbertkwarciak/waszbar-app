import { getGoogleAccessToken } from './google-service-account';

interface Env {
  GOOGLE_OFFER_SHEET_ID: string;
  GOOGLE_CLIENT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
}

interface MenuPrice {
  people: number;
  price: number;
}

interface ExtraService {
  id: string;
  label: string;
  price: number;
  description: string;
}

type MenuRow = [string?, string?, string?];
type ExtraRow = [string?, string?, string?, string?];

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const token = await getGoogleAccessToken(context.env, [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
  ]);

  const fetchSheet = async (range: string): Promise<{ values?: string[][] }> => {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${context.env.GOOGLE_OFFER_SHEET_ID}/values/${encodeURIComponent(
        range,
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Google Sheets API error: ${res.status}`);
    }

    return (await res.json()) as { values?: string[][] };
  };

  const menuJson = await fetchSheet("'menuPackages'!A:C");
  const menuRows = (menuJson.values ?? []) as MenuRow[];
  const menuDataRows = menuRows.slice(1);

  const groupedPackages: Record<string, MenuPrice[]> = {};

  menuDataRows.forEach((row) => {
    const name = row[0];
    const people = row[1];
    const price = row[2];
    if (!name || !people || !price) return;

    const key = name.trim();
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

  const extraJson = await fetchSheet("'extraServices'!A:D");
  const extraRows = (extraJson.values ?? []) as ExtraRow[];
  const extraDataRows = extraRows.slice(1);

  const extraServices = extraDataRows
    .map((row) => {
      const label = row[0];
      const id = row[1];
      const price = row[2];
      const description = row[3];
      if (!label || !id || !price) return null;

      return {
        id: id.trim(),
        label: label.trim(),
        price: Number(price),
        description: description?.trim() ?? '',
      };
    })
    .filter((x): x is ExtraService => x !== null);

  return new Response(
    JSON.stringify({
      menuPackages,
      extraServices,
    }),
    { status: 200 },
  );
};
