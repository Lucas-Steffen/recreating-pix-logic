const COMBINING_DIACRITICS = /\p{Diacritic}/gu;

export function normalizeValue(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(COMBINING_DIACRITICS, '')
    .toLocaleLowerCase('pt-BR');
}

export function tokenizeName(value: string): string[] {
  const normalized = normalizeValue(value);
  const tokens = normalized.split(' ').filter((token) => token.length > 0);
  return Array.from(new Set(tokens));
}
