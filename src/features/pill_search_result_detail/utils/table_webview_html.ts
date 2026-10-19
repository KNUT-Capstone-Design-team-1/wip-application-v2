import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { buildTableKeywordScript } from './table_keyword_script';

const FONT_SOURCES: Record<string, string> = {
  ios: "local('Pretendard-Regular')",
  android: "url('file:///android_res/font/pretendard_regular.ttf')",
};

// 플랫폼별 표 글꼴 선언.
const buildFontFace = (platform: string): string => {
  const source = FONT_SOURCES[platform];

  if (!source) {
    return '';
  }

  return "@font-face { font-family: 'Pretendard'; src: " + source + '; }';
};

// 표 문서·스타일·검색 스크립트 조합.
export const buildTableWebViewHtml = (
  html: string,
  keywords: readonly string[],
  platform: string,
): string => {
  const fontFace = buildFontFace(platform);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          ${fontFace}
          body {
            margin: 0; padding: 0; background-color: transparent;
            font-family: 'Pretendard', -apple-system, sans-serif;
            overflow-x: auto; -webkit-overflow-scrolling: touch;
          }
          table {
            border-collapse: collapse; width: 100%; min-width: 500px;
            font-size: 15px; color: ${COLOR_TEXT['body']};
          }
          tr:first-child {
            background-color: ${COLOR_BG['base']};
          }
          td {
            border: 1px solid ${COLOR_LINE['border']}; padding: 2px; text-align: center;
            word-break: keep-all;
          }
        </style>
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
