export interface KeywordNavigationAvailability {
  canPrevious: boolean;
  canNext: boolean;
}

export interface KeywordTarget {
  id: string;
  keyword: string;
  y: number;
  reveal?: () => void;
}
export type KeywordMeasure = (
  keywords: readonly string[],
  prepareOnly?: boolean,
) => Promise<KeywordTarget[]>;
