import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REL_DIR = 'public/pdfs';
const DIR = path.resolve(process.cwd(), REL_DIR);

// Ghostscript preset: /screen | /ebook | /printer | /prepress
const PDFSETTINGS = '/ebook';

/**
 * Format bytes to KB / MB string
 */
function formatSize(bytes: number): string {
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }

  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Calculate saved percentage
 */
function percent(before: number, after: number): number {
  if (before <= 0) {
    return 0;
  }

  return Math.round(((before - after) * 100) / before);
}

/**
 * Ensure Ghostscript is available in PATH
 */
function ensureGhostscript(): void {
  const check = spawnSync('gs', ['-v'], { stdio: 'ignore' });

  if (check.error) {
    console.error('❌ Nie znaleziono Ghostscript (`gs`). Zainstaluj:');
    console.error('   macOS: brew install ghostscript');
    console.error('   Linux: sudo apt install ghostscript');
    process.exit(1);
  }
}

/**
 * Run Ghostscript compression
 */
function runGs(inputFile: string, outputFile: string): void {
  const args: string[] = [
    '-sDEVICE=pdfwrite',
    '-dCompatibilityLevel=1.4',
    `-dPDFSETTINGS=${PDFSETTINGS}`,
    '-dNOPAUSE',
    '-dQUIET',
    '-dBATCH',
    `-sOutputFile=${outputFile}`,
    inputFile,
  ];

  const res = spawnSync('gs', args, { stdio: 'inherit' });

  if (res.status !== 0) {
    throw new Error(`Ghostscript failed (exit ${res.status ?? 'unknown'})`);
  }
}

/**
 * Main script entry
 */
function main(): void {
  if (!fs.existsSync(DIR) || !fs.statSync(DIR).isDirectory()) {
    console.error(`❌ Folder nie istnieje: ${DIR}`);
    process.exit(1);
  }

  const pdfs: string[] = fs
    .readdirSync(DIR)
    .filter((f: string): boolean => f.toLowerCase().endsWith('.pdf'))
    .map((f: string): string => path.join(DIR, f));

  if (pdfs.length === 0) {
    console.log(`ℹ️ Brak plików PDF w ${REL_DIR}`);
    return;
  }

  ensureGhostscript();

  console.log(`📦 Kompresja PDF w ${REL_DIR} (PDFSETTINGS=${PDFSETTINGS})`);
  console.log('----------------------------------------------------');

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of pdfs) {
    const name = path.basename(file);
    const before = fs.statSync(file).size;
    totalBefore += before;

    const tmp = file.replace(/\.pdf$/i, '.tmp.pdf');

    try {
      runGs(file, tmp);

      const after = fs.statSync(tmp).size;

      // Guard: jeśli brak zysku – zostaw oryginał
      if (after >= before) {
        fs.unlinkSync(tmp);
        totalAfter += before;

        const delta = after - before;
        console.log(`↔️  ${name} → brak zysku (zostawiam oryginał, +${formatSize(delta)})`);
        continue;
      }

      totalAfter += after;

      const saved = before - after;
      const p = percent(before, after);

      fs.renameSync(tmp, file);

      console.log(`✅ ${name} → -${formatSize(saved)} (${p}%)`);
    } catch (err) {
      if (fs.existsSync(tmp)) {
        fs.unlinkSync(tmp);
      }

      console.error(`❌ Błąd przy kompresji: ${name}`);
      throw err;
    }
  }

  console.log('----------------------------------------------------');

  const totalSaved = totalBefore - totalAfter;
  const totalPercent = percent(totalBefore, totalAfter);

  console.log(
    `🎉 Łącznie: ${formatSize(totalBefore)} → ${formatSize(
      totalAfter,
    )} | zaoszczędzono ${formatSize(totalSaved)} (${totalPercent}%)`,
  );
}

main();
