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
 * 성분명을 기반으로 특수 분류(마약, 대마, 향정, 도핑) 여부 확인
 * @param materialName 국문 성분명
 * @param materialEngName 영문 성분명
 */
export const checkSpecialClassifications = async (
  materialName?: string,
  materialEngName?: string,
): Promise<ISpecialClassificationResult> => {
  const result: ISpecialClassificationResult = {
    isNarcotic: false,
    narcoticIngredients: [],
    isCannabis: false,
    cannabisIngredients: [],
    isPsychotropic: false,
    psychotropicIngredients: [],
    isProhibited: false,
    prohibitedIngredients: [],
  };

  if (!materialName && !materialEngName) {
    return result;
  }

  // 성분명 정제 및 분리 (보통 ';' 또는 ','로 구분됨)
  const ingredientsKr = materialName
    ? materialName
        .split(/[;,]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const ingredientsEn = materialEngName
    ? materialEngName
        .split(/[;,]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // 각 성분에 대해 루프를 돌며 확인 (병렬 처리)
  const checkNarcotics = async () => {
    const matched: string[] = [];
    for (const name of ingredientsKr) {
      const found = await getNarcotics(
        { chemicalNameKr: name },
        { page: 1, limit: 1 },
      );
      if (found.length > 0) matched.push(name);
    }
    for (const name of ingredientsEn) {
      const found = await getNarcotics(
        { chemicalNameEn: name },
        { page: 1, limit: 1 },
      );
      if (found.length > 0) matched.push(name);
    }
    return matched;
  };

  const checkCannabis = async () => {
    const matched: string[] = [];
    for (const name of ingredientsKr) {
      const found = await getCannabis(
        { chemicalNameKr: name },
        { page: 1, limit: 1 },
      );
      if (found.length > 0) matched.push(name);
    }
    for (const name of ingredientsEn) {
      const found = await getCannabis(
        { chemicalNameEn: name },
        { page: 1, limit: 1 },
      );
      if (found.length > 0) matched.push(name);
    }
    return matched;
  };

  const checkPsychotropics = async () => {
    const matched: string[] = [];
    for (const name of ingredientsKr) {
      const found = await getPsychotropics(
        { chemicalNameKr: name },
        { page: 1, limit: 1 },
      );
      if (found.length > 0) matched.push(name);
    }
    for (const name of ingredientsEn) {
      const found = await getPsychotropics(
        { chemicalNameEn: name },
        { page: 1, limit: 1 },
      );
      if (found.length > 0) matched.push(name);
    }
    return matched;
  };

  const checkProhibited = async () => {
    const matched: string[] = [];
    let category: string | undefined;
    let inGame: boolean | undefined;
    let outGame: boolean | undefined;

    for (const name of ingredientsKr) {
      const found = await getProhibitedList(
        { genericKr: name },
        { page: 1, limit: 1 },
      );
      if (found.length > 0) {
        matched.push(name);
        if (!category) category = found[0].categoryKr;
        if (inGame === undefined) inGame = found[0].inGameProhibited === 1;
        if (outGame === undefined) outGame = found[0].outGameProhibited === 1;
      }
    }
    for (const name of ingredientsEn) {
      const found = await getProhibitedList(
        { genericEn: name },
        { page: 1, limit: 1 },
      );
      if (found.length > 0) {
        matched.push(name);
        if (!category) category = found[0].categoryKr;
        if (inGame === undefined) inGame = found[0].inGameProhibited === 1;
        if (outGame === undefined) outGame = found[0].outGameProhibited === 1;
      }
    }
    return { ingredients: matched, category, inGame, outGame };
  };

  const [narcotic, cannabis, psychotropic, prohibited] = await Promise.all([
    checkNarcotics(),
    checkCannabis(),
    checkPsychotropics(),
    checkProhibited(),
  ]);

  result.isNarcotic = narcotic.length > 0;
  result.narcoticIngredients = narcotic;
  result.isCannabis = cannabis.length > 0;
  result.cannabisIngredients = cannabis;
  result.isPsychotropic = psychotropic.length > 0;
  result.psychotropicIngredients = psychotropic;
  result.isProhibited = prohibited.ingredients.length > 0;
  result.prohibitedIngredients = prohibited.ingredients;
  result.prohibitedCategory = prohibited.category;
  result.inGameProhibited = prohibited.inGame;
  result.outGameProhibited = prohibited.outGame;

  return result;
};

/**
 * 문서 데이터에서 운전 및 기계 조작 주의 키워드 확인
 */
export const checkDrivingWarning = (
  eeData?: string,
  udData?: string,
  nbData?: string,
): boolean => {
  const keywords = ['운전', '기계 조작', '기계조작'];
  const combinedData = `${eeData || ''} ${udData || ''} ${nbData || ''}`;

  return keywords.some((keyword) => combinedData.includes(keyword));
};
