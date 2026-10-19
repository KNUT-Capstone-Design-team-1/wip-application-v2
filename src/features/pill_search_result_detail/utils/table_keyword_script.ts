const TABLE_KEYWORD_SCRIPT = String.raw`
const keywords = __KEYWORDS__;

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
      matches.push(measureMatch(node, keyword, start, matches.length));
      found.push({ start, end: start + keyword.length });
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
    mark.style.backgroundColor = '#FFF1A8';
    mark.style.color = '#242424';
    mark.textContent = text.slice(match.start, match.end);
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

// 표 자체 높이 전송.
function sendHeight() {
  const content = document.getElementById('table-content');
  const height = Math.ceil(content.getBoundingClientRect().height);
  window.ReactNativeWebView.postMessage(height.toString());
}

window.onload = function () {
  highlightKeywords();
  setTimeout(sendHeight, 100);
};
window.addEventListener('resize', sendHeight);
`;

// 검색어를 스크립트 리터럴로 삽입.
export const buildTableKeywordScript = (
  keywords: readonly string[],
): string => {
  const serialized = JSON.stringify(keywords).replace(/</g, '\\u003c');

  return TABLE_KEYWORD_SCRIPT.replace('__KEYWORDS__', () => serialized);
};
