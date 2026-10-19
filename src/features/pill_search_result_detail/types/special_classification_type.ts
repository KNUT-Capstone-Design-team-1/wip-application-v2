export interface ISpecialClassificationResult {
  isNarcotic: boolean;
  narcoticIngredients: string[];
  isCannabis: boolean;
  cannabisIngredients: string[];
  isPsychotropic: boolean;
  psychotropicIngredients: string[];
  isProhibited: boolean;
  prohibitedIngredients: string[];
  prohibitedNotes: string[];
}
