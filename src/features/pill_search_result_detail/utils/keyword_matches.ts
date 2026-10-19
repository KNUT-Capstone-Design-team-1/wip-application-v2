export interface KeywordMatch {
  keyword: string;
  start: number;
  end: number;
}
export const findKeywordMatches = (
  text: string,
  keywords: readonly string[],
): KeywordMatch[] => {
  const lower = text.toLowerCase();
  const matches: KeywordMatch[] = [];

  for (const keyword of new Set(keywords.filter(Boolean))) {
    const search = keyword.toLowerCase();
    let from = 0;

    while (from < text.length) {
      const start = lower.indexOf(search, from);

      if (start < 0) {
        break;
      }

      matches.push({ keyword, start, end: start + keyword.length });
      from = start + keyword.length;
    }
  }

  return matches.sort((a, b) => a.start - b.start || b.end - a.end);
};
