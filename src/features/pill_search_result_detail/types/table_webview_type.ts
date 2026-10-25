import type { KeywordMatch } from './keyword_navigation_type';

export interface TableKeywordMatch {
  keyword: string;
  keywords: string[];
  x: number;
  y: number;
  index: number;
}

// WebView는 텍스트와 DOM 위치를 전달하고 공통 매처가 강조 구간을 결정한다.
export interface TableTextNode {
  index: number;
  text: string;
}

export interface TableTextMatches {
  index: number;
  matches: KeywordMatch[];
}

export type TableWebViewMessage =
  | { type: 'textNodes'; documentId: string; nodes: TableTextNode[] }
  | { type: 'matches'; matches: TableKeywordMatch[] }
  | { type: 'height'; height: number }
  | { type: 'invalid' };
