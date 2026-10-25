import type {
  KeywordTextLineRange,
  TextLine,
} from '../types/keyword_navigation_type';

// 네이티브 줄을 본문 문자 범위로 변환.
export const buildKeywordLineRanges = (
  text: string,
  lines: readonly TextLine[],
): KeywordTextLineRange[] => {
  let from = 0;

  return lines.map((line) => {
    const start = Math.max(from, text.indexOf(line.text, from));
    from = start + line.text.length;

    return { start, end: from, y: line.y };
  });
};

// 일치 문구의 줄 높이 반환.
export const findKeywordLineOffset = (
  lines: readonly KeywordTextLineRange[],
  start: number,
): number =>
  lines.find((line) => start >= line.start && start < line.end)?.y || 0;
