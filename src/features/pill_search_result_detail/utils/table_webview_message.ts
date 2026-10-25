import type {
  TableKeywordMatch,
  TableTextNode,
  TableWebViewMessage,
} from '../types/table_webview_type';

// 표 메시지의 검색 좌표 검증.
const isTableKeywordMatch = (value: unknown): value is TableKeywordMatch => {
  const isObject = Boolean(value) && typeof value === 'object';

  if (!isObject) {
    return false;
  }

  const match = value as TableKeywordMatch;

  const hasKeyword = typeof match.keyword === 'string';

  if (!hasKeyword) {
    return false;
  }

  const hasValidKeywords =
    Array.isArray(match.keywords) &&
    match.keywords.every((keyword) => typeof keyword === 'string') &&
    match.keywords.includes(match.keyword);

  if (!hasValidKeywords) {
    return false;
  }

  const hasValidCoordinates =
    Number.isFinite(match.x) && Number.isFinite(match.y);

  if (!hasValidCoordinates) {
    return false;
  }

  const hasValidIndex = Number.isFinite(match.index);

  return hasValidIndex;
};

const isTableTextNode = (value: unknown): value is TableTextNode => {
  const isObject = Boolean(value) && typeof value === 'object';

  if (!isObject) {
    return false;
  }

  const node = value as TableTextNode;

  const hasValidIndex = Number.isSafeInteger(node.index) && node.index >= 0;

  if (!hasValidIndex) {
    return false;
  }

  const hasText = typeof node.text === 'string';

  return hasText;
};

// 표의 검색 결과 메시지 해석.
const parseJsonMessage = (raw: string): TableWebViewMessage => {
  try {
    const parsed = JSON.parse(raw);

    const isTextNodesMessage = parsed?.type === 'textNodes';

    if (isTextNodesMessage) {
      const hasDocumentId =
        typeof parsed.documentId === 'string' && parsed.documentId.length > 0;

      if (!hasDocumentId) {
        return { type: 'invalid' };
      }

      const hasValidNodes =
        Array.isArray(parsed.nodes) && parsed.nodes.every(isTableTextNode);

      if (!hasValidNodes) {
        return { type: 'invalid' };
      }

      return {
        type: 'textNodes',
        documentId: parsed.documentId,
        nodes: parsed.nodes,
      };
    }

    const hasMatches = Array.isArray(parsed?.matches);

    if (!hasMatches) {
      return { type: 'matches', matches: [] };
    }

    return {
      type: 'matches',
      matches: parsed.matches.filter(isTableKeywordMatch),
    };
  } catch {
    return { type: 'matches', matches: [] };
  }
};

// 검색 좌표·높이 메시지 분류.
export const parseTableWebViewMessage = (raw: string): TableWebViewMessage => {
  const isJsonMessage = raw.startsWith('{');

  if (isJsonMessage) {
    return parseJsonMessage(raw);
  }

  const height = parseInt(raw, 10);

  const hasValidHeight = Number.isFinite(height) && height > 0;

  if (!hasValidHeight) {
    return { type: 'invalid' };
  }

  return { type: 'height', height: height + 10 };
};
