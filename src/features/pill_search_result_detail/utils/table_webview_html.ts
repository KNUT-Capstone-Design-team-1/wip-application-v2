import { buildTableDocumentStyles } from '../styles/table_document';
import { buildTableKeywordScript } from './table_keyword_script';
import { findKeywordMatches } from './keyword_matches';
import { decodeHTMLEntities } from './xml_parser';

// 표 문서·스타일·검색 스크립트 조합.
export const buildTableWebViewHtml = (
  html: string,
  keywords: readonly string[],
  platform: string,
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>${buildTableDocumentStyles(platform)}</style>
        <script>${buildTableKeywordScript(keywords)}</script>
      </head>
      <body>
        <div id="table-content">
          ${html.trim().startsWith('<table') ? html : `<table>${html}</table>`}
        </div>
      </body>
    </html>
  `;
};

// 로딩 전에는 HTML 텍스트로 검색 관련 여부만 확인하고 실제 좌표는 WebView에서 받는다.
export const hasTableKeywords = (
  html: string,
  keywords: readonly string[],
): boolean => {
  const hasKeywords = keywords.some(Boolean);

  if (!hasKeywords) {
    return false;
  }

  const text = decodeHTMLEntities(html.replace(/<[^>]*>/g, ''));
  const hasMatches = findKeywordMatches(text, keywords).length > 0;
  const hasUnknownEntities = /&(?:[a-z][a-z0-9]*|#x?[0-9a-f]+);/i.test(text);

  // 해석하지 못한 엔티티가 있으면 실제 검색 결과를 누락하지 않도록 기다린다.
  return hasMatches || hasUnknownEntities;
};
