import { buildTableDocumentStyles } from '../styles/table_document';
import { buildTableKeywordScript } from './table_keyword_script';

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
