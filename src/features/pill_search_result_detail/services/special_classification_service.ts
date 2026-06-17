import { getNarcotics } from '@services/database/queries/narcotics';
import { getCannabis } from '@services/database/queries/cannabis';
import { getPsychotropics } from '@services/database/queries/psychotropics';
import { getProhibitedList } from '@services/database/queries/prohibited_list';

interface ISpecialClassificationResult {
  isNarcotic: boolean;
  narcoticIngredients: string[];
  isCannabis: boolean;
  cannabisIngredients: string[];
  isPsychotropic: boolean;
  psychotropicIngredients: string[];
  isProhibited: boolean;
  prohibitedIngredients: string[];
}

interface IIngredientParams {
  kr: string;
  en: string;
}

/**
 * 특정 성분이 특정 분류에 속하는지 확인하는 범용 함수
 */
const checkSubstance = async (
  ingredients: IIngredientParams,
  queryFn: (
    params: any,
    options: { page: number; limit: number },
  ) => Promise<any[]>,
): Promise<string[]> => {
  const matched = new Set<string>();

  const [foundKr, foundEn] = await Promise.all([
    ingredients.kr
      ? queryFn({ containedInKr: ingredients.kr }, { page: 1, limit: 100 })
      : Promise.resolve([]),
    ingredients.en
      ? queryFn({ containedInEn: ingredients.en }, { page: 1, limit: 100 })
      : Promise.resolve([]),
  ]);

  foundKr.forEach((item) => matched.add(item.chemicalNameKr));
  foundEn.forEach((item) => matched.add(item.chemicalNameEn));

  return Array.from(matched);
};

/**
 * 금지 약물(도핑) 여부 확인 (추가 정보 포함)
 */
const checkProhibitedSubstance = async (
  ingredients: IIngredientParams,
): Promise<{ ingredients: string[] }> => {
  const matched = new Set<string>();

  if (!ingredients.en) {
    return { ingredients: [] };
  }

  const found = await getProhibitedList(
    { contents: ingredients.en },
    { page: 1, limit: 100 },
  );

  found.forEach((item) => matched.add(item.contents));

  return { ingredients: Array.from(matched) };
};

/**
 * 성분명을 기반으로 특수 분류(마약, 대마, 향정, 도핑) 여부 확인
 * @param materialName 국문 성분명
 * @param materialEngName 영문 성분명
 */
export const checkSpecialClassifications = async (
  materialName?: string,
  materialEngName?: string,
): Promise<ISpecialClassificationResult> => {
  const ingredients: IIngredientParams = {
    kr: materialName?.trim() || '',
    en: materialEngName?.trim() || '',
  };

  if (!ingredients.kr && !ingredients.en) {
    return {
      isNarcotic: false,
      narcoticIngredients: [],
      isCannabis: false,
      cannabisIngredients: [],
      isPsychotropic: false,
      psychotropicIngredients: [],
      isProhibited: false,
      prohibitedIngredients: [],
    };
  }

  const [narcotic, cannabis, psychotropic, prohibited] = await Promise.all([
    checkSubstance(ingredients, getNarcotics),
    checkSubstance(ingredients, getCannabis),
    checkSubstance(ingredients, getPsychotropics),
    checkProhibitedSubstance(ingredients),
  ]);

  return {
    isNarcotic: narcotic.length > 0,
    narcoticIngredients: narcotic,
    isCannabis: cannabis.length > 0,
    cannabisIngredients: cannabis,
    isPsychotropic: psychotropic.length > 0,
    psychotropicIngredients: psychotropic,
    isProhibited: prohibited.ingredients.length > 0,
    prohibitedIngredients: prohibited.ingredients,
  };
};

/**
 * 문서 데이터에서 운전 및 기계 조작 주의 키워드 확인
 */
export const checkDrivingWarning = (
  eeData?: string,
  udData?: string,
  nbData?: string,
): boolean => {
  const keywords = [
    '운전',
    '기계 조작',
    '기계조작',
    '정신',
    '졸음',
    '수면',
    '저하',
    '반응속도',
    '의식',
    '어지러움',
    '자동차',
  ];

  const combinedData = `${eeData || ''} ${udData || ''} ${nbData || ''}`;

  return keywords.some((keyword) => combinedData.includes(keyword));
};
