import {
  chemicalNameKey,
  expandIngredientNames,
  ingredientNameVariants,
  splitChemicalList,
} from './substance_names';
import {
  PreparedProhibitedDocument,
  ProhibitedDocument,
  ProhibitedMatch,
} from './prohibited_types';
import { normalizeProhibitedPhrase, sectionNote } from './prohibited_document';
export { prepareProhibitedDocument, sectionNote } from './prohibited_document';
export type {
  ProhibitedDocument,
  PreparedProhibitedDocument,
  ProhibitedMatch,
} from './prohibited_types';

// 분류별 허용 표기 변형 생성.
const dopingVariants = (ingredient: string, section: string) => {
  const variants = expandIngredientNames(ingredient);

  if (['S3', 'S5', 'S6', 'S7'].includes(section)) {
    // 원문에서 광학이성질체를 포함한다고 명시한 분류에만 적용한다.
    variants.push(
      ...variants.map((name) => name.replace(/^(?:dl|d|l)[-\s]+/i, '')),
    );
  }

  if (section === 'S3') {
    variants.push(...variants.map((name) => name.replace(/\s+acetate$/i, '')));
  }

  if (['S1', 'S9'].includes(section)) {
    // 해당 분류는 에스터/글루코코르티코이드 제형을 포함한다. 다른 분류의 구조명은 변경하지 않는다.
    variants.push(
      ...variants.map((name) =>
        name.replace(
          /\s+(?:acetate|propionate|furoate|valerate|butyrate|dipropionate|enanthate|cypionate|undecanoate|decanoate)$/i,
          '',
        ),
      ),
    );
  }

  return variants;
};

// 화학명 전체 경계 일치 확인.
const matchesProhibitedName = (
  variant: string,
  searchable: string,
): boolean => {
  const candidate = normalizeProhibitedPhrase(variant);

  if (candidate.length < 3) {
    return false;
  }

  const escaped = candidate
    .replace(/[.*+?^$()|[\]\\{}]/g, '\\$&')
    .replace(/[ -]+/g, '[ -]*');

  return (
    candidate.length >= 3 &&
    new RegExp(
      '(^|[^a-z0-9가-힣-])' + escaped + '(?=$|[^a-z0-9가-힣-])',
      'i',
    ).test(searchable)
  );
};

// 단일 성분·문서 일치 결과 생성.
const findDocumentMatch = <T extends ProhibitedDocument>(
  doc: PreparedProhibitedDocument<T>,
  ingredient: string,
) => {
  const variants = dopingVariants(ingredient, doc.section).sort(
    (a, b) => a.length - b.length,
  );
  const matched = variants.find((variant) =>
    matchesProhibitedName(variant, doc.searchable),
  );

  if (!matched) {
    return null;
  }

  const match: ProhibitedMatch<T> = {
    ingredient: /[가-힣]/.test(ingredient)
      ? ingredientNameVariants(ingredient).at(-1)!
      : matched,
    section: doc.section,
    note: sectionNote(doc.section),
    source: doc.source,
  };

  return { key: chemicalNameKey(matched) + ':' + doc.section, match };
};

// 성분별 일치 결과 중복 제거.
const collectIngredientMatches = <T extends ProhibitedDocument>(
  documents: PreparedProhibitedDocument<T>[],
  ingredient: string,
  found: Map<string, ProhibitedMatch<T>>,
) => {
  for (const document of documents) {
    const result = findDocumentMatch(document, ingredient);

    if (!result || found.has(result.key)) {
      continue;
    }

    found.set(result.key, result.match);
  }
};

// 성분 단위 금지 본문 검색.
export const findProhibitedMatches = <T extends ProhibitedDocument>(
  documents: PreparedProhibitedDocument<T>[],
  ingredients: string,
): ProhibitedMatch<T>[] => {
  const found = new Map<string, ProhibitedMatch<T>>();

  for (const ingredient of splitChemicalList(ingredients)) {
    collectIngredientMatches(documents, ingredient, found);
  }

  return [...found.values()];
};
