import { getDatabase } from '../sqlite';
import {
  IProhibitedList,
  TProhibitedListSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

const ALL_PROHIBITED_LIST_COLUMNS: (keyof IProhibitedList)[] = [
  'genericKr',
  'genericEn',
  'category',
  'categoryKr',
  'categoryEn',
  'inGameProhibited',
  'outGameProhibited',
] as const;

/**
 * prohibited_list 테이블 조회를 위한 WHERE param 생성
 * @param _params where 절에 사용할 검색 조건
 * @returns
 */
const getProhibitedListWhereQuery: TWhereQueryClauseFunc = (
  _params: Partial<TProhibitedListSearchParam>,
): TQuerySearchParamResult<TProhibitedListSearchParam> => {
  return {
    genericKr: {
      query: `genericKr LIKE ?`,
      values: (genericKr: string) => [`%${genericKr}%`],
    },
    genericEn: {
      query: `genericEn LIKE ?`,
      values: (genericEn: string) => [`%${genericEn}%`],
    },
    category: {
      query: `category LIKE ?`,
      values: (category: string) => [`%${category}%`],
    },
    categoryKr: {
      query: `categoryKr LIKE ?`,
      values: (categoryKr: string) => [`%${categoryKr}%`],
    },
    categoryEn: {
      query: `categoryEn LIKE ?`,
      values: (categoryEn: string) => [`%${categoryEn}%`],
    },
    containedInKr: {
      query: `? LIKE '%' || genericKr || '%'`,
      values: (containedInKr: string) => [containedInKr],
    },
    containedInEn: {
      query: `? LIKE '%' || genericEn || '%'`,
      values: (containedInEn: string) => [containedInEn],
    },
  };
};

/**
 * prohibited_list 목록 조회
 * @param params 검색 조건
 * @param queryOption 쿼리 옵션
 * @returns
 */
export const getProhibitedList = async (
  params: Partial<TProhibitedListSearchParam> = {},
  queryOption: { page: number; limit: number },
) => {
  const { whereClause, whereValues } = buildWhereClause(
    getProhibitedListWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT ${ALL_PROHIBITED_LIST_COLUMNS} FROM prohibited_list ${whereClause}
               LIMIT ?, ?`;

  const { page = 1, limit = 30 } = queryOption;

  const results: IProhibitedList[] = await db.getAllAsync(sql, [
    ...whereValues,
    (page - 1) * limit,
    limit,
  ]);

  return results;
};
