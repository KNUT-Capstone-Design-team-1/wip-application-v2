import { getDatabase } from '../sqlite';
import {
  IFunctionalFoodNutrients,
  TFunctionalFoodNutrientsSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

/**
 * functional_food_nutrients 테이블 조회를 위한 WHERE param 생성
 * @param _params where 절에 사용할 검색 조건
 * @returns
 */
const getFunctionalFoodNutrientsWhereQuery: TWhereQueryClauseFunc = (
  _params: Partial<TFunctionalFoodNutrientsSearchParam>,
): TQuerySearchParamResult<TFunctionalFoodNutrientsSearchParam> => {
  return {
    foodCode: {
      query: `foodCode = ?`,
      values: (foodCode: string) => [foodCode],
    },
    foodName: {
      query: `foodName LIKE ?`,
      values: (foodName: string) => [`%${foodName}%`],
    },
    foodMajorCategoryName: {
      query: `foodMajorCategoryName LIKE ?`,
      values: (category: string) => [`%${category}%`],
    },
    representativeFoodName: {
      query: `representativeFoodName LIKE ?`,
      values: (repName: string) => [`%${repName}%`],
    },
    foodMediumCategoryName: {
      query: `foodMediumCategoryName LIKE ?`,
      values: (category: string) => [`%${category}%`],
    },
    itemReportNumber: {
      query: `itemReportNumber LIKE ?`,
      values: (reportNumber: string) => [`%${reportNumber}%`],
    },
    manufacturerName: {
      query: `manufacturerName LIKE ?`,
      values: (mfg: string) => [`%${mfg}%`],
    },
    importerName: {
      query: `importerName LIKE ?`,
      values: (imp: string) => [`%${imp}%`],
    },
    distributorName: {
      query: `distributorName LIKE ?`,
      values: (dist: string) => [`%${dist}%`],
    },
    keyword: {
      query: `(foodName LIKE ? OR representativeFoodName LIKE ? OR manufacturerName LIKE ?)`,
      values: (keyword: string) => [
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
      ],
    },
  };
};

/**
 * 건강기능식품 영양성분 목록 조회
 * @param params 검색 조건
 * @param queryOption 페이징 옵션
 * @returns
 */
export const getFunctionalFoodNutrients = async (
  params: Partial<TFunctionalFoodNutrientsSearchParam> = {},
  queryOption: { page: number; limit: number } = { page: 1, limit: 30 },
) => {
  const { whereClause, whereValues } = buildWhereClause(
    getFunctionalFoodNutrientsWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT * FROM functional_food_nutrients ${whereClause}
               LIMIT ?, ?`;

  const { page = 1, limit = 30 } = queryOption;
  const offset = (page - 1) * limit;

  const result = await db.getAllAsync<IFunctionalFoodNutrients>(sql, [
    ...whereValues,
    offset,
    limit,
  ]);

  return result;
};

/**
 * 식품코드(foodCode) 기반 단일 건강기능식품 영양성분 조회
 * @param foodCode 식품코드
 * @returns
 */
export const getFunctionalFoodNutrientByFoodCode = async (
  foodCode: string,
): Promise<IFunctionalFoodNutrients | null> => {
  const db = await getDatabase();

  const sql = `SELECT * FROM functional_food_nutrients WHERE foodCode = ? LIMIT 1`;
  const result = await db.getFirstAsync<IFunctionalFoodNutrients>(sql, [
    foodCode,
  ]);

  return result ?? null;
};

/**
 * 조건에 맞는 건강기능식품 영양성분 데이터 개수 조회
 * @param params 검색 조건
 * @returns
 */
export const getFunctionalFoodNutrientsCount = async (
  params: Partial<TFunctionalFoodNutrientsSearchParam> = {},
): Promise<number> => {
  const { whereClause, whereValues } = buildWhereClause(
    getFunctionalFoodNutrientsWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT COUNT(*) as count FROM functional_food_nutrients ${whereClause}`;
  const result = await db.getAllAsync<{ count: number }>(sql, whereValues);

  return result?.[0]?.count || 0;
};
