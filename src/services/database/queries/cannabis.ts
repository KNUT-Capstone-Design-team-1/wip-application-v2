import { getDatabase } from '../sqlite';
import {
  ICannabis,
  TCannabisSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

const ALL_CANNABIS_COLUMNS: (keyof ICannabis)[] = [
  'chemicalNameKr',
  'chemicalNameEn',
  'synonyms',
  'casNumber',
  'isomerCasNumber',
  'molecularFormula',
  'molecularWeight',
] as const;

/**
 * cannabis 테이블 조회를 위한 WHERE param 생성
 * @param _params where 절에 사용할 검색 조건
 * @returns
 */
const getCannabisWhereQuery: TWhereQueryClauseFunc = (
  _params: Partial<TCannabisSearchParam>,
): TQuerySearchParamResult<TCannabisSearchParam> => {
  return {
    chemicalNameKr: {
      query: `chemicalNameKr LIKE ?`,
      values: (chemicalNameKr: string) => [`%${chemicalNameKr}%`],
    },
    chemicalNameEn: {
      query: `chemicalNameEn LIKE ?`,
      values: (chemicalNameEn: string) => [`%${chemicalNameEn}%`],
    },
    containedInKr: {
      query: `? LIKE '%' || chemicalNameKr || '%'`,
      values: (containedInKr: string) => [containedInKr],
    },
    containedInEn: {
      query: `? LIKE '%' || chemicalNameEn || '%'`,
      values: (containedInEn: string) => [containedInEn],
    },
  };
};

/**
 * cannabis 목록 조회
 * @param params 검색 조건
 * @param queryOption 쿼리 옵션
 * @returns
 */
export const getCannabis = async (
  params: Partial<TCannabisSearchParam> = {},
  queryOption: { page: number; limit: number },
) => {
  const { whereClause, whereValues } = buildWhereClause(
    getCannabisWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT ${ALL_CANNABIS_COLUMNS} FROM cannabis ${whereClause}
               LIMIT ?, ?`;

  const { page = 1, limit = 30 } = queryOption;
  const offset = (page - 1) * limit;

  const result = await db.getAllAsync<ICannabis>(sql, [
    ...whereValues,
    offset,
    limit,
  ]);

  return result;
};
