import type {
  ClassificationCatalog,
  ClassificationEntry,
  IngredientMatch,
} from '../types/classification';
import {
  ingredientKeys,
  splitChemicalList,
  substanceAliases,
} from './substance_names';
import { getClassificationIndex } from './classification_index';
import { findProhibitedReferences } from './prohibited_substances';
export { getClassificationIndex } from './classification_index';

// 정규화한 이름으로 분류를 찾되 탐색에는 실제 입력 문자열을 남긴다.
export const findControlledIngredientMatches = (
  catalog: ClassificationCatalog,
  ingredients: string,
): IngredientMatch<ClassificationEntry>[] => {
  const { names } = getClassificationIndex(catalog);

  return [...new Set(splitChemicalList(ingredients))].flatMap((matchedText) => {
    const sources = new Set(
      [...ingredientKeys(matchedText, catalog.ingredientAliases)].flatMap(
        (key) => names.get(key) || [],
      ),
    );

    return [...sources].map((source) => ({
      displayName: (source.kr || '').trim() || (source.en || '').trim(),
      matchedText,
      source,
    }));
  });
};

// 기존 DB 조회 API는 분류 레코드만 반환한다.
export const findControlledMatches = (
  catalog: ClassificationCatalog,
  ingredients: string,
): ClassificationEntry[] => [
  ...new Set(
    findControlledIngredientMatches(catalog, ingredients).map(
      (match) => match.source,
    ),
  ),
];

// DB 이명으로 검색어만 확장하고 분류별 금지·예외 규칙을 추정하지 않는다.
export const findClassificationProhibitedReferences = (
  catalog: ClassificationCatalog,
  ingredients: string,
): IngredientMatch<ClassificationEntry>[] => {
  const { prohibited } = getClassificationIndex(catalog);
  return splitChemicalList(ingredients).flatMap((ingredient) => {
    const controlled = findControlledMatches(catalog, ingredient);
    const names = [ingredient, ...controlled.flatMap(substanceAliases)].join(
      '|',
    );
    const sources = new Set(
      findProhibitedReferences(
        prohibited,
        names,
        catalog.ingredientAliases,
      ).map((reference) => reference.source),
    );

    return [...sources].map((source) => ({
      displayName: ingredient,
      matchedText: ingredient,
      source,
    }));
  });
};
