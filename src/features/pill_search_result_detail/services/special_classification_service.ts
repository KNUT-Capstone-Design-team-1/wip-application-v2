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
  prohibitedCategory?: string;
  inGameProhibited?: boolean;
  outGameProhibited?: boolean;
}

/**
 * 성분명 문자열을 정제하고 배열로 분리
 * 구분자: ;, | 및 공백(\s)
 */
const parseIngredients = (ingredientsStr?: string): string[] => {
  if (!ingredientsStr) {
    return [];
  }

  return ingredientsStr
    .split(/[;,|\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
};

/**
 * 특정 성분이 특정 분류에 속하는지 확인하는 범용 함수
 */
const checkSubstance = async (
  ingredientsKr: string[],
  ingredientsEn: string[],
  queryFn: (
    params: any,
    options: { page: number; limit: number },
  ) => Promise<any[]>,
  krParamKey: string,
  enParamKey: string,
): Promise<string[]> => {
  const matched = new Set<string>();

  for (const name of ingredientsKr) {
    const found = await queryFn({ [krParamKey]: name }, { page: 1, limit: 1 });

    if (found.length > 0) {
      matched.add(name);
    }
  }

  for (const name of ingredientsEn) {
    const found = await queryFn({ [enParamKey]: name }, { page: 1, limit: 1 });

    if (found.length > 0) {
      matched.add(name);
    }
  }

  return Array.from(matched);
};

/**
 * 금지 약물(도핑) 여부 확인 (추가 정보 포함)
 */
const checkProhibitedSubstance = async (
  ingredientsKr: string[],
  ingredientsEn: string[],
) => {
  const matched = new Set<string>();

  let category: string | undefined;
  let inGame: boolean | undefined;
  let outGame: boolean | undefined;

  const updateProhibitedInfo = (found: any[], name: string) => {
    if (found.length > 0) {
      matched.add(name);

      if (!category) {
        category = found[0].categoryKr;
      }

      if (inGame === undefined) {
        inGame = found[0].inGameProhibited === 1;
      }

      if (outGame === undefined) {
        outGame = found[0].outGameProhibited === 1;
      }
    }
  };

  for (const name of ingredientsKr) {
    const found = await getProhibitedList(
      { genericKr: name },
      { page: 1, limit: 1 },
    );

    updateProhibitedInfo(found, name);
  }

  for (const name of ingredientsEn) {
    const found = await getProhibitedList(
      { genericEn: name },
      { page: 1, limit: 1 },
    );

    updateProhibitedInfo(found, name);
  }

  return {
    ingredients: Array.from(matched),
    category,
    inGame,
    outGame,
  };
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
  const ingredientsKr = parseIngredients(materialName);
  const ingredientsEn = parseIngredients(materialEngName);

  if (ingredientsKr.length === 0 && ingredientsEn.length === 0) {
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
    checkSubstance(
      ingredientsKr,
      ingredientsEn,
      getNarcotics,
      'chemicalNameKr',
      'chemicalNameEn',
    ),
    checkSubstance(
      ingredientsKr,
      ingredientsEn,
      getCannabis,
      'chemicalNameKr',
      'chemicalNameEn',
    ),
    checkSubstance(
      ingredientsKr,
      ingredientsEn,
      getPsychotropics,
      'chemicalNameKr',
      'chemicalNameEn',
    ),
    checkProhibitedSubstance(ingredientsKr, ingredientsEn),
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
    prohibitedCategory: prohibited.category,
    inGameProhibited: prohibited.inGame,
    outGameProhibited: prohibited.outGame,
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
