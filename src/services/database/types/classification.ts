export type ClassificationKind =
  'narcotic' | 'cannabis' | 'psychotropic' | 'prohibited';

export interface ClassificationEntry {
  kind: ClassificationKind;
  kr: string;
  en: string;
  contents: string;
  synonyms?: string;
  casNumber?: string;
  isomerCasNumber?: string;
  molecularFormula?: string;
  molecularWeight?: string;
}

export interface IngredientNamePair {
  MAIN_ITEM_INGR: string;
  MATERIAL_ENG_NAME: string;
}

export type IngredientAliasIndex = ReadonlyMap<string, readonly string[]>;

export interface ClassificationCatalog {
  entries: ClassificationEntry[];
  ingredientAliases: IngredientAliasIndex;
}

export interface ProhibitedDocument {
  contents: string;
}

export interface PreparedProhibitedDocument<T extends ProhibitedDocument> {
  source: T;
  searchable: string;
}

// 원문에 성분명이 등장한다는 의미이며 금지 여부 판정이 아니다.
export interface ProhibitedReference<T extends ProhibitedDocument> {
  ingredient: string;
  source: T;
}

export interface ClassificationIndex {
  names: Map<string, ClassificationEntry[]>;
  prohibited: PreparedProhibitedDocument<ClassificationEntry>[];
}

export interface ContainedSubstanceParams {
  containedInKr?: string;
  containedInEn?: string;
  chemicalNameKr?: string;
  chemicalNameEn?: string;
}

export interface SubstanceNameEntry {
  kr: string;
  en: string;
  synonyms?: string;
  casNumber?: string;
}
