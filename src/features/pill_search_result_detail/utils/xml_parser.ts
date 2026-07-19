import { XMLParser } from 'fast-xml-parser';

const decodeHTMLEntities = (text: string) => {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
};

const mapParagraph = (p: any) => {
  const isTable = p['@_tagName'] === 'table';
  const contentStr = p['#text'] || p.content || '';

  const mapped: any = {
    tagName: p['@_tagName'],
  };

  if (p['@_textIndent'] !== undefined && p['@_textIndent'] !== '') {
    mapped.textIndent = p['@_textIndent'];
  }
  if (p['@_marginLeft'] !== undefined && p['@_marginLeft'] !== '') {
    mapped.marginLeft = p['@_marginLeft'];
  }

  if (isTable) {
    mapped.table =
      typeof contentStr === 'string' ? contentStr.trim() : contentStr;
  } else {
    mapped.content =
      typeof contentStr === 'string'
        ? decodeHTMLEntities(contentStr.trim())
        : contentStr;
  }
  return mapped;
};

const mapArticle = (a: any) => {
  const paragraphsRaw = a.PARAGRAPH;
  let paragraphs: any[] = [];
  if (Array.isArray(paragraphsRaw)) {
    paragraphs = paragraphsRaw.map(mapParagraph);
  } else if (paragraphsRaw) {
    paragraphs = [mapParagraph(paragraphsRaw)];
  }

  if (paragraphs.length === 0) {
    return {
      title: a['@_title'] || '',
      content: '',
    };
  }

  return {
    title: a['@_title'] || '',
    paragraphs,
  };
};

const mapSection = (s: any) => {
  const articlesRaw = s.ARTICLE;
  let articles: any[] = [];
  if (Array.isArray(articlesRaw)) {
    articles = articlesRaw.map(mapArticle);
  } else if (articlesRaw) {
    articles = [mapArticle(articlesRaw)];
  }

  return {
    title: s['@_title'] || '',
    articles,
  };
};

export const xmlToJson = (xml: string) => {
  if (!xml) return { doc: null };
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const raw = parser.parse(xml);

    if (!raw || !raw.DOC) return { doc: null };

    const docRaw = raw.DOC;

    const sectionsRaw = docRaw.SECTION;
    let sections: any[] = [];
    if (Array.isArray(sectionsRaw)) {
      sections = sectionsRaw.map(mapSection);
    } else if (sectionsRaw) {
      sections = [mapSection(sectionsRaw)];
    }

    return {
      doc: {
        title: docRaw['@_title'] || '',
        sections,
      },
    };
  } catch (e) {
    console.error('XML Parsing error:', e);
    return { doc: null };
  }
};
