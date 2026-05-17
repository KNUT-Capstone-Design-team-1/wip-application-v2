/**
 * XML/HTML 태그와 CDATA를 일반 텍스트로 변환
 */
export const decodeHtmlContent = (content: string): string => {
  if (!content) return '';

  let decoded = content;

  // CDATA 섹션 추출 및 처리
  decoded = decoded.replace(
    /<!\[CDATA\[(.*?)\]\]>/gs,
    (match, cdataContent) => {
      return cdataContent;
    },
  );

  // HTML 엔티티 디코딩
  const htmlEntities: { [key: string]: string } = {
    '&nbsp;': ' ',
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  };

  Object.keys(htmlEntities).forEach((entity) => {
    decoded = decoded.replace(new RegExp(entity, 'g'), htmlEntities[entity]);
  });

  // XML/HTML 태그 제거 및 포맷팅
  decoded = decoded
    // ARTICLE 태그의 title 속성을 헤더로 변환
    .replace(/<ARTICLE\s+title\s*=\s*"([^"]+)"[^>]*>/gi, '\n\n【 $1 】\n')
    .replace(/<\/ARTICLE>/gi, '\n')
    // SECTION 태그 처리
    .replace(/<SECTION[^>]*>/gi, '\n')
    .replace(/<\/SECTION>/gi, '')
    // PARAGRAPH 태그는 줄바꿈으로
    .replace(/<PARAGRAPH[^>]*>/gi, '\n')
    .replace(/<\/PARAGRAPH>/gi, '\n')
    // 일반 HTML 태그들
    .replace(/<\/?(p|div|br)[^>]*>/gi, '\n')
    .replace(/<\/?(ul|ol)[^>]*>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    // 테이블 관련
    .replace(/<\/?(table|tbody|thead|tr)[^>]*>/gi, '\n')
    .replace(/<td[^>]*>/gi, '  ')
    .replace(/<\/td>/gi, ' │ ')
    .replace(/<th[^>]*>/gi, '  ')
    .replace(/<\/th>/gi, ' │ ')
    // DOC 태그 제거
    .replace(/<DOC[^>]*>/gi, '')
    .replace(/<\/DOC>/gi, '')
    // 나머지 모든 XML/HTML 태그 제거
    .replace(/<[^>]+>/g, '')
    // 연속된 공백을 하나로
    .replace(/ +/g, ' ')
    // 각 줄 앞뒤 공백 제거
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')
    // 연속된 줄바꿈을 최대 2개로 제한
    .replace(/\n{3,}/g, '\n\n')
    // 앞뒤 공백 제거
    .trim();

  return decoded;
};

/**
 * XML/HTML에서 특정 섹션 추출 (필요한 경우)
 */
export const extractSection = (
  content: string,
  sectionName?: string,
): string => {
  if (!content) return '';

  // 섹션 이름이 있으면 해당 섹션만 추출
  if (sectionName) {
    const regex = new RegExp(
      `<${sectionName}[^>]*>(.*?)</${sectionName}>`,
      'is',
    );
    const match = content.match(regex);
    if (match && match[1]) {
      return decodeHtmlContent(match[1]);
    }
  }

  return decodeHtmlContent(content);
};
