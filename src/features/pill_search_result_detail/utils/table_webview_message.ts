import {
  TableKeywordMatch,
  TableWebViewMessage,
} from '../types/table_webview_type';

// 표 메시지의 검색 좌표 검증.
const isTableKeywordMatch = (value: unknown): value is TableKeywordMatch => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const match = value as TableKeywordMatch;

  return (
    typeof match.keyword === 'string' &&
    Number.isFinite(match.x) &&
    Number.isFinite(match.y) &&
    Number.isFinite(match.index)
  );
};

// 표 검색 메시지 해석.
const parseMatchMessage = (raw: string): TableWebViewMessage => {
  try {
    const parsed = JSON.parse(raw);
    const matches = Array.isArray(parsed?.matches)
      ? parsed.matches.filter(isTableKeywordMatch)
      : [];

    return { type: 'matches', matches };
  } catch {
    return { type: 'matches', matches: [] };
  }
};

// 검색 좌표·높이 메시지 분류.
export const parseTableWebViewMessage = (raw: string): TableWebViewMessage => {
  if (raw.startsWith('{')) {
    return parseMatchMessage(raw);
  }

  const height = parseInt(raw, 10);

  if (!Number.isFinite(height) || height <= 0) {
    return { type: 'invalid' };
  }

  return { type: 'height', height: height + 10 };
};
