export const countDigits = (s: string): number => (s.match(/\d/g) ?? []).length;
