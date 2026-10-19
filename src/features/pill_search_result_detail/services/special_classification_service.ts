import { pillDetailRepository } from '../data/repositories/pill_detail_repository';
import { ISpecialClassificationResult } from '../types/special_classification_type';
import type { ClassificationEntry } from '@services/database/queries/classification_catalog';
import {
  findControlledMatches,
  findClassificationProhibitedMatches,
} from '@services/database/matching/classification_matcher';
import {
  normalizeChemicalText,
  splitChemicalList,
  ingredientNameVariants,
} from '@services/database/matching/substance_names';
export { getDrivingWarningKeywords } from './driving_warning_service';

type ResultCache = Map<string, ISpecialClassificationResult>;
const CACHE_LIMIT = 200;
const resultCaches = new WeakMap<ClassificationEntry[], ResultCache>();

// 성분별 기본 명칭 추출.
export const processTokens = (text: string): string[] =>
  splitChemicalList(text)
    .map((name) => ingredientNameVariants(name).at(-1)!)
    .filter(Boolean);

// 빈 분류 결과 생성.
const createEmptyClassifications = (): ISpecialClassificationResult => ({
  isNarcotic: false,
  narcoticIngredients: [],
  isCannabis: false,
  cannabisIngredients: [],
  isPsychotropic: false,
  psychotropicIngredients: [],
  isProhibited: false,
  prohibitedIngredients: [],
  prohibitedNotes: [],
});

// 카탈로그별 계산 캐시 반환.
const getResultCache = (catalog: ClassificationEntry[]): ResultCache => {
  const cached = resultCaches.get(catalog);

  if (cached) {
    return cached;
  }

  const cache: ResultCache = new Map();
  resultCaches.set(catalog, cache);

  return cache;
};

// 분류별 표시 성분명 수집.
const getIngredientNames = (
  entries: ClassificationEntry[],
  kind: ClassificationEntry['kind'],
): string[] => [
  ...new Set(
    entries
      .filter((entry) => entry.kind === kind)
      .map((entry) => (entry.kr || '').trim() || (entry.en || '').trim())
      .filter(Boolean),
  ),
];

// 분류 일치 결과 조합.
const buildClassificationResult = (
  catalog: ClassificationEntry[],
  ingredients: string,
): ISpecialClassificationResult => {
  const matched = findControlledMatches(catalog, ingredients);
  const narcoticIngredients = getIngredientNames(matched, 'narcotic');
  const cannabisIngredients = getIngredientNames(matched, 'cannabis');
  const psychotropicIngredients = getIngredientNames(matched, 'psychotropic');
  const prohibited = findClassificationProhibitedMatches(catalog, ingredients);

  return {
    isNarcotic: narcoticIngredients.length > 0,
    narcoticIngredients,
    isCannabis: cannabisIngredients.length > 0,
    cannabisIngredients,
    isPsychotropic: psychotropicIngredients.length > 0,
    psychotropicIngredients,
    isProhibited: prohibited.length > 0,
    prohibitedIngredients: [
      ...new Set(
        prohibited.map((match) => match.ingredient.trim()).filter(Boolean),
      ),
    ],
    prohibitedNotes: [...new Set(prohibited.map((match) => match.note))],
  };
};

// 크기 제한을 지키며 계산 결과 저장.
const rememberResult = (
  cache: ResultCache,
  key: string,
  result: ISpecialClassificationResult,
) => {
  if (cache.size >= CACHE_LIMIT) {
    cache.delete(cache.keys().next().value!);
  }

  cache.set(key, result);
};

// 성분 분류 조회·계산 캐시 재사용.
export const checkSpecialClassifications = async (
  materialName = '',
  materialEngName = '',
  repository: Pick<
    typeof pillDetailRepository,
    'getClassificationCatalog'
  > = pillDetailRepository,
): Promise<ISpecialClassificationResult> => {
  const kr = normalizeChemicalText(materialName);
  const en = normalizeChemicalText(materialEngName);

  if (!kr && !en) {
    return createEmptyClassifications();
  }

  const catalog = await repository.getClassificationCatalog();
  const cache = getResultCache(catalog);
  const key = JSON.stringify([kr, en]);
  const cached = cache.get(key);

  if (cached) {
    return cached;
  }

  const result = buildClassificationResult(
    catalog,
    materialName + '|' + materialEngName,
  );
  rememberResult(cache, key, result);

  return result;
};
