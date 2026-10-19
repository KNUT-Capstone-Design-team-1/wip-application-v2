import {
  DRIVING_CONTEXT,
  DRIVING_WARNING_KEYWORDS,
} from '../constants/driving_warning';

// XML·HTML의 표시 문장을 분리하고 속성값 제외.
const getVisibleSentences = (document: string): string[] =>
  document
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<\/(?:PARAGRAPH|ARTICLE|SECTION|p|div|tr)>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .split(/[.!?。;\n]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

// 운전 문맥의 실제 표시 문구만 중복 없이 추출.
export const getDrivingWarningKeywords = (
  eeData?: string,
  udData?: string,
  nbData?: string,
): string[] => {
  const keywords = new Set<string>();

  for (const document of [eeData, udData, nbData]) {
    if (!document) {
      continue;
    }

    for (const sentence of getVisibleSentences(document)) {
      if (!DRIVING_CONTEXT.test(sentence)) {
        continue;
      }

      for (const match of sentence.matchAll(DRIVING_WARNING_KEYWORDS)) {
        keywords.add(match[0]);
      }
    }
  }

  return [...keywords];
};
