import type {
  TableTextNode,
  TableTextMatches,
} from '../types/table_webview_type';
import { findKeywordMatches } from './keyword_matches';
import { TABLE_HEIGHT_MESSAGE_DELAY_MS } from '../constants/table_webview';

// 검색어·강조색과 표 내부 이벤트 스크립트 조합.
// WebView는 별도 실행 환경이므로 실행할 JavaScript 소스를 문자열로 전달한다.
export const buildTableKeywordScript = (
  keywords: readonly string[],
): string => {
  const serialized = JSON.stringify(keywords).replace(/</g, '\\u003c');

  return String.raw`
const keywords = ${serialized};
const documentId = String(Date.now()) + ':' + Math.random();
let textNodes = [];
let isHighlighted = false;

// 검색 가능한 텍스트 노드 수집.
function collectTextNodes() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;

  while ((node = walker.nextNode())) {
    const isExcludedElement = /^(SCRIPT|STYLE)$/.test(node.parentElement.tagName);
    if (isExcludedElement) {
      continue;
    }

    nodes.push(node);
  }

  return nodes;
}

// 공통 매처가 정한 강조 구간의 표 좌표 측정.
function measureMatch(node, match, index) {
  const range = document.createRange();
  range.setStart(node, match.start);
  range.setEnd(node, match.end);
  const rect = range.getBoundingClientRect();

  return {
    keyword: match.keyword, keywords: match.keywords,
    y: rect.top + window.scrollY, x: rect.left + window.scrollX, index
  };
}

// DOM 텍스트 중 검색 후보만 네이티브 공통 매처로 전달한다.
function requestKeywordMatches() {
  textNodes = collectTextNodes();
  const nodes = textNodes
    .map((node, index) => ({ index, text: node.textContent || '' }))
    .filter((node) => keywords.some(
      (keyword) => keyword && node.text.toLowerCase().includes(keyword.toLowerCase())
    ));

  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'textNodes', documentId, nodes }));
}

// 겹치지 않는 문구 강조.
function highlightNode(node, found) {
  const hasMatches = found.length > 0;
  if (!hasMatches) {
    return;
  }

  const text = node.textContent;
  const fragment = document.createDocumentFragment();
  let from = 0;

  for (const match of found) {
    fragment.appendChild(document.createTextNode(text.slice(from, match.start)));
    const mark = document.createElement('mark');
    mark.className = 'pill-keyword';
    mark.textContent = text.slice(match.start, match.end);
    fragment.appendChild(mark);
    from = match.end;
  }

  fragment.appendChild(document.createTextNode(text.slice(from)));
  node.parentNode.replaceChild(fragment, node);
}

// 같은 공통 매칭 결과로 강조와 이동 좌표를 함께 만든다.
window.applyKeywordMatches = function (sourceId, groups) {
  const isCurrentDocument = sourceId === documentId;
  const canApplyMatches = isCurrentDocument && !isHighlighted;
  if (!canApplyMatches) {
    return;
  }
  const matches = [];

  for (const group of groups) {
    const node = textNodes[group.index];
    const hasTextNode = Boolean(node);
    if (!hasTextNode) {
      continue;
    }

    const found = group.matches.map((match) => {
      const index = matches.length;
      matches.push(measureMatch(node, match, index));
      return { ...match, index };
    });
    highlightNode(node, found);
  }

  isHighlighted = true;
  window.ReactNativeWebView.postMessage(JSON.stringify({ matches }));
  setTimeout(sendHeight, ${TABLE_HEIGHT_MESSAGE_DELAY_MS});
};

// 표 자체 높이 전송.
function sendHeight() {
  if (!isHighlighted) {
    return;
  }
  const content = document.getElementById('table-content');
  const height = Math.ceil(content.getBoundingClientRect().height);
  window.ReactNativeWebView.postMessage(height.toString());
}

window.onload = function () {
  requestKeywordMatches();
};
window.addEventListener('resize', sendHeight);
`;
};

// 표와 네이티브가 같은 매처를 사용하도록 강조 구간을 전달한다.
export const buildTableHighlightCommand = (
  nodes: readonly TableTextNode[],
  keywords: readonly string[],
  documentId: string,
): string => {
  const groups: TableTextMatches[] = nodes.map((node) => ({
    index: node.index,
    matches: findKeywordMatches(node.text, keywords),
  }));
  const serialized = JSON.stringify(groups).replace(/</g, '\\u003c');

  return (
    'window.applyKeywordMatches(' +
    JSON.stringify(documentId) +
    ', ' +
    serialized +
    '); true;'
  );
};
