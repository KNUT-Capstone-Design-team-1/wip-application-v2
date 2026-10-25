import {
  DRIVING_CONTEXT,
  DRIVING_WARNING_KEYWORDS,
} from '../constants/driving_warning';
import { uniqueWarningItems } from '../utils/unique_warning_items';

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
  const keywords: string[] = [];

  for (const document of [eeData, udData, nbData]) {
    const hasNoDocument = !document;

    if (hasNoDocument) {
      continue;
    }

    for (const sentence of getVisibleSentences(document)) {
      const hasNoDrivingContext = !DRIVING_CONTEXT.test(sentence);

      if (hasNoDrivingContext) {
        continue;
      }

      for (const match of sentence.matchAll(DRIVING_WARNING_KEYWORDS)) {
        keywords.push(match[0]);
      }
    }
  }

  return uniqueWarningItems(keywords);
};
