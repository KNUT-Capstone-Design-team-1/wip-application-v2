import type {
  RawDocument,
  RawSection,
  RawArticle,
  RawParagraph,
  PillArticle,
  PillDocument,
  PillParagraph,
  PillSection,
} from '../types/pill_document_type';
import { XMLParser } from 'fast-xml-parser';

// 단일·반복 XML 노드를 동일한 배열로 변환.
const asArray = <T>(value?: T | T[]): T[] => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

// 본문 HTML 엔티티 복원.
const decodeHTMLEntities = (text: string): string =>
  text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      String.fromCharCode(parseInt(hex, 16)),
    );

// 표·일반 문단의 표시 데이터 변환.
const mapParagraph = (raw: RawParagraph): PillParagraph => {
  const paragraph: PillParagraph = { tagName: raw['@_tagName'] || '' };
  const text = String(raw['#text'] ?? raw.content ?? '').trim();

  if (raw['@_textIndent'] !== undefined && raw['@_textIndent'] !== '') {
    paragraph.textIndent = String(raw['@_textIndent']);
  }

  if (raw['@_marginLeft'] !== undefined && raw['@_marginLeft'] !== '') {
    paragraph.marginLeft = String(raw['@_marginLeft']);
  }

  if (paragraph.tagName === 'table') {
    paragraph.table = text;

    return paragraph;
  }

  paragraph.content = decodeHTMLEntities(text);

  return paragraph;
};

// 조항과 하위 문단 변환.
const mapArticle = (raw: RawArticle): PillArticle => ({
  title: raw['@_title'] || '',
  paragraphs: asArray(raw.PARAGRAPH).map(mapParagraph),
});

// 절과 하위 조항 변환.
const mapSection = (raw: RawSection): PillSection => ({
  title: raw['@_title'] || '',
  articles: asArray(raw.ARTICLE).map(mapArticle),
});

// 상세 XML을 렌더링 전용 문서로 변환.
export const xmlToJson = (xml: string): { doc: PillDocument | null } => {
  if (!xml) {
    return { doc: null };
  }

  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const raw: { DOC?: RawDocument } = parser.parse(xml);

    if (!raw?.DOC) {
      return { doc: null };
    }

    return {
      doc: {
        title: raw.DOC['@_title'] || '',
        sections: asArray(raw.DOC.SECTION).map(mapSection),
      },
    };
  } catch (error) {
    console.error('XML Parsing error:', error);

    return { doc: null };
  }
};
