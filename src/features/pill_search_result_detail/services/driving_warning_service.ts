// 운전·기계 조작이 명시된 문장만 판별.
const DRIVING_CONTEXT =
  /운전|기계\s*(?:조작|운용|작동)|위험한\s*기계|중장비\s*(?:조작|운용|작동)/;

// 포괄적 질환명 대신 조작 위험·기능 저하 문구 사용.
const DRIVING_WARNING_KEYWORDS =
  /수면\s*운전|자동차\s*운전|운전|기계\s*(?:조작|운용|작동)|위험한\s*기계|중장비\s*(?:조작|운용|작동)|졸음|졸릴|졸리는|진정\s*작용|몽롱|의식\s*저하|어지러움|어지럼증|어지럼|현기증|실신|(?:집중력|주의력|판단력|인지\s*기능)\s*(?:저하|장애)|반응\s*(?:속도|시간)\s*(?:저하|지연)|운동\s*실조|시야\s*흐림|복시|시력\s*장애/g;

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
