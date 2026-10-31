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

type SheetValue = string | number;
type MenuRow = [string?, SheetValue?, SheetValue?];
type ExtraRow = [string?, string?, SheetValue?, string?];
type OfferYear = '2026' | '2027' | '2028';

const OFFER_YEARS: OfferYear[] = ['2026', '2027', '2028'];

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const token = await getGoogleAccessToken(context.env, [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
  ]);

  const fetchSheet = async (
    spreadsheetId: string,
    range: string,
  ): Promise<{ values?: SheetValue[][] }> => {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        range,
      )}?valueRenderOption=UNFORMATTED_VALUE`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Google Sheets API error: ${res.status}`);
    }

    return (await res.json()) as { values?: SheetValue[][] };
  };

  const fetchMenuPackages = async (
    year: OfferYear,
  ): Promise<{
    year: OfferYear;
    packages: { name: string; prices: MenuPrice[] }[];
  }> => {
    const menuJson = await fetchSheet(context.env.GOOGLE_OFFER_SHEET_ID, `'${year}'!A:C`);
    const menuRows = (menuJson.values ?? []) as MenuRow[];
    const groupedPackages: Record<string, MenuPrice[]> = {};

    menuRows.slice(1).forEach((row) => {
      const name = typeof row[0] === 'string' ? row[0].trim() : '';
      const people = Number(row[1]);
      const price = Number(row[2]);
      if (
        !name ||
        row[1] === undefined ||
        row[2] === undefined ||
        !Number.isFinite(people) ||
        !Number.isFinite(price)
      ) {
        return;
      }

      groupedPackages[name] ??= [];
      groupedPackages[name].push({ people, price });
    });

    const packages = Object.entries(groupedPackages).map(([name, prices]) => ({
      name,
      prices: prices.sort((a, b) => a.people - b.people),
    }));

    return { year, packages };
  };

  const [yearlyPackages, extraJson] = await Promise.all([
    Promise.all(OFFER_YEARS.map(fetchMenuPackages)),
    fetchSheet(context.env.GOOGLE_OFFER_SHEET_ID, "'extraServices'!A:D"),
  ]);

  const menuPackagesByYear = Object.fromEntries(
    yearlyPackages.map(({ year, packages }) => [year, packages]),
  ) as Record<OfferYear, { name: string; prices: MenuPrice[] }[]>;

  const extraRows = (extraJson.values ?? []) as ExtraRow[];
  const extraDataRows = extraRows.slice(1);

  const extraServices = extraDataRows
    .map((row) => {
      const label = row[0];
      const id = row[1];
      const price = row[2];
      const description = row[3];
      if (!label || !id || price === undefined || (typeof price !== 'number' && !price.trim())) {
        return null;
      }
      const numericPrice = Number(price);
      if (!Number.isFinite(numericPrice)) return null;

      return {
        id: id.trim(),
        label: label.trim(),
        price: numericPrice,
        description: description?.trim() ?? '',
      };
    })
    .filter((x): x is ExtraService => x !== null);

  return new Response(
    JSON.stringify({
      menuPackagesByYear,
      extraServices,
    }),
    { status: 200 },
  );
};
