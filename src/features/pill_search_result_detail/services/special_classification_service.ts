import {
  findControlledMatches,
  findClassificationProhibitedMatches,
} from '@services/database/matching/classification_matcher';
import { normalizeChemicalText } from '@services/database/matching/substance_names';
import type { ClassificationEntry } from '@services/database/queries/classification_catalog';
import { CLASSIFICATION_CACHE_LIMIT } from '../constants/pill_detail';
import { pillDetailRepository } from '../data/repositories/pill_detail_repository';
import type {
  ISpecialClassificationResult,
  ClassificationResultCache,
} from '../types/special_classification_type';
import { uniqueWarningItems } from '../utils/unique_warning_items';

const resultCaches = new WeakMap<
  ClassificationEntry[],
  ClassificationResultCache
>();

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
const getClassificationResultCache = (
  catalog: ClassificationEntry[],
): ClassificationResultCache => {
  const cached = resultCaches.get(catalog);

  if (cached) {
    return cached;
  }

  const cache: ClassificationResultCache = new Map();
  resultCaches.set(catalog, cache);

  return cache;
};

// 분류별 표시 성분명 수집.
const getIngredientNames = (
  entries: ClassificationEntry[],
  kind: ClassificationEntry['kind'],
): string[] =>
  uniqueWarningItems(
    entries
      .filter((entry) => entry.kind === kind)
      .map((entry) => (entry.kr || '').trim() || (entry.en || '').trim()),
  );

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
    prohibitedIngredients: uniqueWarningItems(
      prohibited.map((match) => match.ingredient.trim()),
    ),
    prohibitedNotes: uniqueWarningItems(prohibited.map((match) => match.note)),
  };
};

// 크기 제한을 지키며 계산 결과 저장.
const rememberResult = (
  cache: ClassificationResultCache,
  key: string,
  result: ISpecialClassificationResult,
) => {
  if (cache.size >= CLASSIFICATION_CACHE_LIMIT) {
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
  const cache = getClassificationResultCache(catalog);
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
