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
