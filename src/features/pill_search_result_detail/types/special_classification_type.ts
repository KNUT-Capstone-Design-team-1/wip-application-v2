import type {
  ClassificationEntry,
  IngredientMatch,
} from '@services/database/types/classification';

// 특수 분류의 표시 이름·DB 출처를 담는다.
export type ClassificationIngredientMatch =
  IngredientMatch<ClassificationEntry>;
export interface ISpecialClassificationResult {
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
