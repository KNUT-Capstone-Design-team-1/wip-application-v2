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

// 같은 줄에 있는 결과도 각각 방문하며 마지막 결과에서 처음으로 순환하지 않는다.
export const nextKeywordTarget = <T extends { id: string; y: number }>(
  targets: T[],
  scrollY: number,
  previousId?: string,
) => {
  const previous = targets.findIndex((target) => target.id === previousId);

  if (previous >= 0) {
    return targets
      .slice(previous + 1)
      .find((target) => target.y >= scrollY - 2);
  }

  return targets.find((target) => target.y >= scrollY - 2);
};
