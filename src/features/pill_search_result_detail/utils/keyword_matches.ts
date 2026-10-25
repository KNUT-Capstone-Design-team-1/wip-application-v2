import type { KeywordMatch } from '../types/keyword_navigation_type';

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

      const hasNoMatch = start < 0;

      if (hasNoMatch) {
        break;
      }

      matches.push({
        keyword,
        keywords: [keyword],
        start,
        end: start + keyword.length,
      });
      from = start + keyword.length;
    }
  }

  const groups: KeywordMatch[] = [];

  // 앞쪽에서 시작하는 긴 구간부터 묶고, 맞닿기만 한 구간은 분리한다.
  for (const match of matches.sort(
    (a, b) => a.start - b.start || b.end - a.end,
  )) {
    const previous = groups[groups.length - 1];

    const overlapsPrevious =
      previous !== undefined && match.start < previous.end;

    if (overlapsPrevious) {
      previous.end = Math.max(previous.end, match.end);
      previous.keywords = [
        ...new Set([...previous.keywords, ...match.keywords]),
      ];
    } else {
      groups.push(match);
    }
  }

  return groups;
};

// 강조 구간이 필요 없는 곳에서는 첫 일치만 확인한다.
export const hasKeywordMatch = (
  text: string,
  keywords: readonly string[],
): boolean => {
  const lower = text.toLowerCase();

  return keywords.some(
    (keyword) => Boolean(keyword) && lower.includes(keyword.toLowerCase()),
  );
};
