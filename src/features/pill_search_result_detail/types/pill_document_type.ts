export interface PillParagraph {
  tagName: string;
  textIndent?: string;
  marginLeft?: string;
  content?: string;
  table?: string;
}

export interface PillArticle {
  title: string;
  paragraphs: PillParagraph[];
}

export interface PillSection {
  title: string;
  articles: PillArticle[];
}

export interface PillDocument {
  title: string;
  sections: PillSection[];
}

export interface RawParagraph {
  '@_tagName'?: string;
  '@_textIndent'?: string;
  '@_marginLeft'?: string;
  '#text'?: string | number;
  content?: string | number;
}

export interface RawArticle {
  '@_title'?: string;
  PARAGRAPH?: RawParagraph | RawParagraph[];
}

export interface RawSection {
  '@_title'?: string;
  ARTICLE?: RawArticle | RawArticle[];
}

export interface RawDocument {
  '@_title'?: string;
  SECTION?: RawSection | RawSection[];
}
