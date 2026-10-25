import type {
  TableKeywordMatch,
  TableTextNode,
  TableWebViewMessage,
} from '../types/table_webview_type';

const isTableKeywordMatch = (value: unknown): value is TableKeywordMatch => {
  const isNotObject = !value || typeof value !== 'object';

  if (isNotObject) {
    return false;
  }

  const match = value as TableKeywordMatch;
  const hasValidKeyword =
    typeof match.keyword === 'string' &&
    match.keyword.length > 0 &&
    Array.isArray(match.keywords) &&
    match.keywords.every((keyword) => typeof keyword === 'string') &&
    match.keywords.includes(match.keyword);
  const hasValidCoordinates =
    Number.isFinite(match.x) && Number.isFinite(match.y);
  const hasValidIndex = Number.isSafeInteger(match.index) && match.index >= 0;

  return hasValidKeyword && hasValidCoordinates && hasValidIndex;
};

const isTableTextNode = (value: unknown): value is TableTextNode => {
  const isNotObject = !value || typeof value !== 'object';

  if (isNotObject) {
    return false;
  }

  const node = value as TableTextNode;

  return (
    Number.isSafeInteger(node.index) &&
    node.index >= 0 &&
    typeof node.text === 'string'
  );
};

// 새 source에 속한 메시지만 처리하며, 알 수 없는 응답으로 결과를 비우지 않는다.
export const parseTableWebViewMessage = (
  raw: string,
  currentDocumentId: string,
): TableWebViewMessage => {
  try {
    const message = JSON.parse(raw);
    const isInvalidDocument =
      !message ||
      typeof message !== 'object' ||
      message.documentId !== currentDocumentId;

    if (isInvalidDocument) {
      return { type: 'invalid' };
    }

    switch (message.type) {
      case 'textNodes': {
        const hasValidNodes =
          Array.isArray(message.nodes) && message.nodes.every(isTableTextNode);

        return hasValidNodes
          ? {
              type: 'textNodes',
              documentId: currentDocumentId,
              nodes: message.nodes,
            }
          : { type: 'invalid' };
      }

      case 'matches': {
        const hasValidMatches =
          Array.isArray(message.matches) &&
          message.matches.every(isTableKeywordMatch);

        return hasValidMatches
          ? {
              type: 'matches',
              documentId: currentDocumentId,
              matches: message.matches,
            }
          : { type: 'invalid' };
      }

      case 'height': {
        const hasValidHeight =
          Number.isFinite(message.height) && message.height > 0;

        return hasValidHeight
          ? {
              type: 'height',
              documentId: currentDocumentId,
              height: Math.ceil(message.height) + 10,
            }
          : { type: 'invalid' };
      }

      default:
        return { type: 'invalid' };
    }
  } catch {
    return { type: 'invalid' };
  }
};
