import { env } from '@/config/env';

const PACKAGE_FILE_TOKEN: Record<string, string> = {
  basic: 'BASIC',
  medium: 'MEDIUM',
  max: 'MAX',
  classic: 'KLASYCZNA',
  excellent: 'EXCELLENT',
};

// Build the canonical filename
export const buildPdfFileName = (pkgValue: string, range: number): string => {
  const token = PACKAGE_FILE_TOKEN[pkgValue];
  // Example: "Waszbar.pl oferta MEDIUM do 150 gości.pdf"
  return `Waszbar.pl oferta ${token} do ${range} gości.pdf`;
};

export const getPdfUrl = (fileName: string): string | null => {
  const base = env.s3.pdfsUrl.replace(/\/+$/, '');
  if (!base) return null;

  const normalized = fileName.normalize('NFD');

  const encoded = encodeURIComponent(normalized).replace(/%20/g, '+');
  return `${base}/${encoded}`;
};
