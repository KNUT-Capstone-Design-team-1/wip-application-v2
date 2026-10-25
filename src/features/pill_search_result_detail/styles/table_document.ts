import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';

const TABLE_FONT_SOURCES: Readonly<Record<string, string>> = {
  ios: "local('Pretendard-Regular')",
  android: "url('file:///android_res/font/pretendard_regular.ttf')",
};

// 플랫폼별 표 글꼴 선언.
const buildFontFace = (platform: string): string => {
  const source = TABLE_FONT_SOURCES[platform];

  if (!source) {
    return '';
  }

  return "@font-face { font-family: 'Pretendard'; src: " + source + '; }';
};

export const buildTableDocumentStyles = (platform: string): string => `
          ${buildFontFace(platform)}
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
          mark.pill-keyword {
            background-color: ${COLOR_BG.highlight};
            color: ${COLOR_TEXT.highlight};
          }
`;
