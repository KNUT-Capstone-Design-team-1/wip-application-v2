import {
  findControlledIngredientMatches,
  findClassificationProhibitedReferences,
} from '@services/database/matching/classification_matcher';
import { normalizeChemicalText } from '@services/database/matching/substance_names';
import type {
  ClassificationCatalog,
  ClassificationEntry,
} from '@services/database/types/classification';
import { CLASSIFICATION_CACHE_LIMIT } from '../constants/pill_detail';
import { pillDetailRepository } from '../data/repositories/pill_detail_repository';
import type {
  ISpecialClassificationResult,
  ClassificationResultCache,
  ClassificationIngredientMatch,
} from '../types/special_classification_type';
import { uniqueWarningItems } from '../utils/unique_warning_items';

const resultCaches = new WeakMap<
  ClassificationCatalog,
  ClassificationResultCache
>();

// 빈 분류 결과 생성.
const createEmptyClassifications = (): ISpecialClassificationResult => ({
  classificationMatches: [],
  isNarcotic: false,
  narcoticIngredients: [],
  isCannabis: false,
  cannabisIngredients: [],
  isPsychotropic: false,
  psychotropicIngredients: [],
  hasProhibitedReferences: false,
  prohibitedIngredients: [],
});

// 카탈로그별 계산 캐시 반환.
const getClassificationResultCache = (
  catalog: ClassificationCatalog,
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
  matches: ClassificationIngredientMatch[],
  kind: ClassificationEntry['kind'],
): string[] =>
  uniqueWarningItems(
    matches
      .filter((match) => match.source.kind === kind)
      .map((match) => match.displayName),
  );

// 분류 일치 결과 조합.
const buildClassificationResult = (
  catalog: ClassificationCatalog,
  ingredients: string,
): ISpecialClassificationResult => {
  const matched = findControlledIngredientMatches(catalog, ingredients);
  const narcoticIngredients = getIngredientNames(matched, 'narcotic');
  const cannabisIngredients = getIngredientNames(matched, 'cannabis');
  const psychotropicIngredients = getIngredientNames(matched, 'psychotropic');
  const prohibited = findClassificationProhibitedReferences(
    catalog,
    ingredients,
  );

  return {
    classificationMatches: [...matched, ...prohibited],
    isNarcotic: narcoticIngredients.length > 0,
    narcoticIngredients,
    isCannabis: cannabisIngredients.length > 0,
    cannabisIngredients,
    isPsychotropic: psychotropicIngredients.length > 0,
    psychotropicIngredients,
    hasProhibitedReferences: prohibited.length > 0,
    prohibitedIngredients: uniqueWarningItems(
      prohibited.map((match) => match.displayName.trim()),
    ),
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
  // 실제 입력의 공백과 표기를 보존해야 하므로 원문을 캐시 키로 사용한다.
  const key = JSON.stringify([materialName, materialEngName]);
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
