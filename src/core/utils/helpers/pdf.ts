import { env } from '@/core/config/env';
import { MenuPackageType } from '@/types';

const PACKAGE_FILE_TOKEN: Record<MenuPackageType, string> = {
  [MenuPackageType.BASIC]: 'BASIC',
  [MenuPackageType.MEDIUM]: 'MEDIUM',
  [MenuPackageType.MAX]: 'MAX',
  [MenuPackageType.KLASYCZNY]: 'KLASYCZNA',
  [MenuPackageType.EXCELLENT]: 'EXCELLENT',
};

// Build the canonical filename
export const buildPdfFileName = (pkgValue: MenuPackageType, range: number): string => {
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
