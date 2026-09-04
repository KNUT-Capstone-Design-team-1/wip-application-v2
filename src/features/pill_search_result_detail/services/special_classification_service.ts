import {
  IPillDetailRepository,
  pillDetailRepository,
} from '../data/repositories/pill_detail_repository';

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
 * 성분명 분리: 불필요한 염(Salt)/수화물 단어 제거, 특수문자(/, |, ,) 기준 분리
 */
const processTokens = (text: string) => {
  if (!text) {
    return [];
  }

  // 제거할 염기 및 수화물 단어 목록
  const sanitized = text
    .replace(
      /\b(hydrochloride|hydrate|sulfate|maleate|tartrate|citrate|mesylate|acetate|bromide|anhydrous|micronized|diluted)\b/gi,
      '',
    )
    .trim();

  return sanitized
    .split(/[\/|,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
};

/**
 * 금지 약물(도핑) 여부 확인 (추가 정보 포함)
 */
const checkProhibitedSubstance = async (
  ingredients: IIngredientParams,
  repository: IPillDetailRepository,
): Promise<{ ingredients: string[] }> => {
  const matched = new Set<string>();

  const tokensEn = processTokens(ingredients.en);
  const tokensKr = processTokens(ingredients.kr);

  // 중복된 토큰 검사를 피하기 위해 Set으로 병합
  const allTokens = Array.from(new Set([...tokensEn, ...tokensKr]));

  const checkAndAddProhibitedToken = async (token: string) => {
    const found = await repository.searchProhibitedList({
      contents: token,
      page: 1,
      limit: 100,
    });

    if (found.length > 0) {
      // 검색된 원본 텍스트가 아닌, 파라미터로 들어온 분리된 성분명(token)을 표시
      matched.add(token);
    }
  };

  // 병렬로 도핑 금지 약물 테이블(prohibited_list)에서 검색
  await Promise.all(allTokens.map(checkAndAddProhibitedToken));

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
  repository: IPillDetailRepository = pillDetailRepository,
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
    checkSubstance(ingredients, (params) => repository.searchNarcotics(params)),
    checkSubstance(ingredients, (params) => repository.searchCannabis(params)),
    checkSubstance(ingredients, (params) =>
      repository.searchPsychotropics(params),
    ),
    checkProhibitedSubstance(ingredients, repository),
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
export const getDrivingWarningKeywords = (
  eeData?: string,
  udData?: string,
  nbData?: string,
): string[] => {
  const keywords = [
    // 운전/기계조작
    '운전',
    '자동차',
    '차량',
    '기계조작',
    '기계 조작',
    '위험한 기계',
    '중장비',

    // 졸음/진정
    '졸음',
    '졸리',
    '수면',
    '진정',
    '진정작용',
    '몽롱',
    '의식저하',

    // 어지러움
    '어지러움',
    '어지럼',
    '어지럼증',
    '현기증',
    '실신',

    // 인지/반응
    '집중력',
    '주의력',
    '판단력',
    '반응속도',
    '반응시간',
    '인지기능',
    '운동실조',

    // 시야
    '시야흐림',
    '복시',
    '시력장애',
  ];

  const combinedData = `${eeData ?? ''} ${udData ?? ''} ${nbData ?? ''}`;

  return keywords.filter((keyword) => combinedData.includes(keyword));
};
