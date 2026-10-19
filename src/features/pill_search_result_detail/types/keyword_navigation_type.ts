export interface KeywordTarget {
  id: string;
  keyword: string;
  y: number;
  reveal?: () => void;
}
export type KeywordMeasure = (
  keyword: string,
  prepareOnly?: boolean,
) => Promise<KeywordTarget[]>;
