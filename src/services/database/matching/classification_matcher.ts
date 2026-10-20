import type {
  ClassificationCatalog,
  ClassificationEntry,
} from '../types/classification';
import {
  ingredientKeys,
  splitChemicalList,
  substanceAliases,
} from './substance_names';
import { getClassificationIndex } from './classification_index';
import { findProhibitedReferences } from './prohibited_substances';
export { getClassificationIndex } from './classification_index';

// 현재 DB의 정식명·이명·단일 성분 한영 대응으로 조회한다.
export const findControlledMatches = (
  catalog: ClassificationCatalog,
  ingredients: string,
): ClassificationEntry[] => {
  const { names } = getClassificationIndex(catalog);
  const matches = [
    ...ingredientKeys(ingredients, catalog.ingredientAliases),
  ].flatMap((key) => names.get(key) || []);

  return [...new Set(matches)];
};

// DB 이명으로 검색어만 확장하고 분류별 금지·예외 규칙을 추정하지 않는다.
export const findClassificationProhibitedReferences = (
  catalog: ClassificationCatalog,
  ingredients: string,
) => {
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

    return [...sources].map((source) => ({ ingredient, source }));
  });
};
