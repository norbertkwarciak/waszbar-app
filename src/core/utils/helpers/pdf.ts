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
  // Example: "Waszbar.pl_oferta_MEDIUM_do_150_gosci.pdf"
  return `Waszbar.pl_oferta_${token}_do_${range}_gosci.pdf`;
};

export const getPdfUrl = (fileName: string): string | null => {
  const base = env.public.pdfs.replace(/\/+$/, '');
  if (!base) return null;

  let normalized = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  normalized = normalized.replace(/\s+/g, '_');
  normalized = normalized.replace(/[^a-zA-Z0-9._-]/g, '');

  if (!normalized.toLowerCase().endsWith('.pdf')) {
    normalized += '.pdf';
  }

  return `${base}/${normalized}`;
};
