import type {
  ClassificationEntry,
  IngredientMatch,
} from '@services/database/types/classification';

// 특수 분류의 표시 이름·실제 일치 문자열·DB 출처를 담는다.
export type ClassificationIngredientMatch =
  IngredientMatch<ClassificationEntry>;
// 경고 문구의 탐색에는 표시 이름과 실제 일치 문자열만 사용한다.
export type WarningKeywordTarget = Pick<
  ClassificationIngredientMatch,
  'displayName' | 'matchedText'
>;

export interface ISpecialClassificationResult {
  classificationMatches: ClassificationIngredientMatch[];
  isNarcotic: boolean;
  narcoticIngredients: string[];
  isCannabis: boolean;
  cannabisIngredients: string[];
  isPsychotropic: boolean;
  psychotropicIngredients: string[];
  hasProhibitedReferences: boolean;
  prohibitedIngredients: string[];
}

export type ClassificationResultCache = Map<
  string,
  ISpecialClassificationResult
>;
