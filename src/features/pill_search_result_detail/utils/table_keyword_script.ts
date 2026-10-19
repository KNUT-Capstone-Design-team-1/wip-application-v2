import { KEYWORD_HIGHLIGHT_STYLE } from '../constants/keyword_highlight';
import { TABLE_HEIGHT_MESSAGE_DELAY_MS } from '../constants/table_webview';

// 검색어·강조색과 표 내부 이벤트 스크립트 조합.
export const buildTableKeywordScript = (
  keywords: readonly string[],
): string => {
  const serialized = JSON.stringify(keywords).replace(/</g, '\\u003c');

  return String.raw`
const keywords = ${serialized};

// 검색 가능한 텍스트 노드 수집.
function collectTextNodes() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;

  while ((node = walker.nextNode())) {
    if (/^(SCRIPT|STYLE)$/.test(node.parentElement.tagName)) {
      continue;
    }

    nodes.push(node);
  }

  return nodes;
}

// 일치 문구의 표 좌표 측정.
function measureMatch(node, keyword, start, index) {
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, start + keyword.length);
  const rect = range.getBoundingClientRect();

  return { keyword, y: rect.top + window.scrollY, x: rect.left + window.scrollX, index };
}

// 노드 안의 반복 문구 위치 수집.
function findNodeMatches(node, matches) {
  const lower = node.textContent.toLowerCase();
  const found = [];

  for (const keyword of keywords) {
    if (!keyword) {
      continue;
    }

    let from = 0;
    let start;

    while ((start = lower.indexOf(keyword.toLowerCase(), from)) >= 0) {
      const index = matches.length;
      matches.push(measureMatch(node, keyword, start, index));
      found.push({ start, end: start + keyword.length, keyword, index });
      from = start + keyword.length;
    }
  }

  return found.sort((a, b) => a.start - b.start || b.end - a.end);
}

// 겹치지 않는 문구 강조.
function highlightNode(node, found) {
  if (!found.length) {
    return;
  }

  const text = node.textContent;
  const fragment = document.createDocumentFragment();
  let from = 0;

  for (const match of found) {
    if (match.start < from) {
      continue;
    }

    fragment.appendChild(document.createTextNode(text.slice(from, match.start)));
    const mark = document.createElement('mark');
    mark.style.backgroundColor = '${KEYWORD_HIGHLIGHT_STYLE.backgroundColor}';
    mark.style.color = '${KEYWORD_HIGHLIGHT_STYLE.color}';
    mark.textContent = text.slice(match.start, match.end);
    mark.dataset.keyword = match.keyword;
    mark.dataset.keywordIndex = String(match.index);
    mark.setAttribute('role', 'button');
    mark.setAttribute('aria-label', match.keyword + '부터 본문 탐색');
    mark.tabIndex = 0;
    fragment.appendChild(mark);
    from = match.end;
  }

  fragment.appendChild(document.createTextNode(text.slice(from)));
  node.parentNode.replaceChild(fragment, node);
}

// 강조 및 검색 좌표 전송.
function highlightKeywords() {
  const matches = [];

  for (const node of collectTextNodes()) {
    highlightNode(node, findNodeMatches(node, matches));
  }

  window.ReactNativeWebView.postMessage(JSON.stringify({ matches }));
}

// 강조 문구 클릭을 네이티브 탐색에 전달.
function handleKeywordPress(event) {
  const mark = event.target.closest('mark[data-keyword-index]');

  if (!mark) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'dismiss' }));

    return;
  }

  window.ReactNativeWebView.postMessage(JSON.stringify({
    type: 'keywordPress', keyword: mark.dataset.keyword, index: Number(mark.dataset.keywordIndex)
  }));
}

// 표 자체 높이 전송.
function sendHeight() {
  const content = document.getElementById('table-content');
  const height = Math.ceil(content.getBoundingClientRect().height);
  window.ReactNativeWebView.postMessage(height.toString());
}

window.onload = function () {
  highlightKeywords();
  document.addEventListener('click', handleKeywordPress);
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    if (!event.target.closest('mark[data-keyword-index]')) {
      return;
    }

    event.preventDefault();
    handleKeywordPress(event);
  });
  setTimeout(sendHeight, ${TABLE_HEIGHT_MESSAGE_DELAY_MS});
};
window.addEventListener('resize', sendHeight);
`;
};
