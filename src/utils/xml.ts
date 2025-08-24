import { XmlParser } from './parser';

/** XML 파싱 */
// TODO: table 데이터 파싱 추가 + return 데이터의 구조가 변경될 가능성 있음
type TPillDetailJsonObj = {
  DOC: {
    SECTION: {
      '@_title'?: string;
      ARTICLE: {
        '@_title'?: string;
        PARAGRAPH?: { '#text'?: string; '@_tagName'?: string }[];
      }[];
    }[];
  };
};

export const parseXML = (xmlString: string) => {
  const paragraphs: any[] = [];
  const xml = XmlParser.entityDecode(XmlParser.entityDecode(xmlString));
  const xmlParser = XmlParser.getInstance();

  const jsonObj: TPillDetailJsonObj = xmlParser.parse(xml);

  for (const section of jsonObj['DOC']['SECTION']) {
    if (section['@_title'] && section['@_title'] !== '') {
      paragraphs.push(section['@_title']);
    }
    for (const article of section['ARTICLE']) {
      if (article['@_title'] && article['@_title'] !== '') {
        paragraphs.push(article['@_title']);
      }

      if (!article['PARAGRAPH']) continue;

      for (const paragraph of article['PARAGRAPH']) {
        if (paragraph['#text'] && (paragraph['@_tagName'] ?? 'p') !== 'table') {
          paragraphs.push(paragraph['#text']);
        }
      }
    }
  }

  return paragraphs;
};
