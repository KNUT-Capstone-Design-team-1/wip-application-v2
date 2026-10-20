import {
  chemicalNameKey,
  expandIngredientNames,
  normalizeChemicalText,
  splitChemicalList,
} from './substance_names';
import type {
  IngredientAliasIndex,
  PreparedProhibitedDocument,
  ProhibitedDocument,
  ProhibitedReference,
} from '../types/classification';
// 문구·분류·언어를 가정하지 않고 전체 원문을 검색한다.
export const prepareProhibitedDocument = <T extends ProhibitedDocument>(
  source: T,
): PreparedProhibitedDocument<T> | null => {
  const searchable = normalizeChemicalText(source.contents || '');

  return searchable ? { source, searchable } : null;
};

// 부분 문자열로 다른 성분을 찾지 않도록 화학명 경계를 지킨다.
const matchesDocumentName = (name: string, searchable: string): boolean => {
  const candidate = normalizeChemicalText(name);

  if (chemicalNameKey(candidate).length < 2) {
    return false;
  }

  const escaped = candidate
    .replace(/[.*+?^$()|[\]\\{}]/g, '\\$&')
    .replace(/[ -]+/g, '[ -]*');

  return new RegExp(
    '(^|[^\\p{L}\\p{N}-])' + escaped + '(?=$|[^\\p{L}\\p{N}-])',
    'iu',
  ).test(searchable);
};

// 예외·모니터링을 포함한 전체 DB 원문에서 이름이 일치하는 문서를 반환한다.
export const findProhibitedReferences = <T extends ProhibitedDocument>(
  documents: PreparedProhibitedDocument<T>[],
  ingredients: string,
  aliases?: IngredientAliasIndex,
): ProhibitedReference<T>[] => {
  const references: ProhibitedReference<T>[] = [];
  const names = new Map(
    splitChemicalList(ingredients).map((name) => [chemicalNameKey(name), name]),
  );

  for (const ingredient of names.values()) {
    const variants = expandIngredientNames(ingredient, aliases);

    for (const document of documents) {
      if (
        variants.some((name) => matchesDocumentName(name, document.searchable))
      ) {
        references.push({ ingredient, source: document.source });
      }
    }
  }

  return references;
};
