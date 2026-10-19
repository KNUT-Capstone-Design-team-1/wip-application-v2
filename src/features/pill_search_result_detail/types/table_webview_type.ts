export interface TableKeywordMatch {
  keyword: string;
  x: number;
  y: number;
  index: number;
}

export type TableWebViewMessage =
  | { type: 'matches'; matches: TableKeywordMatch[] }
  | { type: 'height'; height: number }
  | { type: 'keywordPress'; keyword: string; index: number }
  | { type: 'dismiss' }
  | { type: 'invalid' };
