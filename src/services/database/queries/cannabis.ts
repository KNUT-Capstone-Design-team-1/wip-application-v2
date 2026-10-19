import {
  getContainedSubstances,
  assertSubstanceSearch,
} from './substance_search';
import { getDatabase } from '../sqlite';
import {
  ICannabis,
  TCannabisSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

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
      query: `(instr(lower(chemicalNameKr), lower(?)) > 0 OR instr(lower(synonyms), lower(?)) > 0)`,
      values: (chemicalNameKr: string) => [chemicalNameKr, chemicalNameKr],
    },
    chemicalNameEn: {
      query: `(instr(lower(chemicalNameEn), lower(?)) > 0 OR instr(lower(synonyms), lower(?)) > 0)`,
      values: (chemicalNameEn: string) => [chemicalNameEn, chemicalNameEn],
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
  if (
    !assertSubstanceSearch(params, [
      'chemicalNameKr',
      'chemicalNameEn',
      'containedInKr',
      'containedInEn',
    ])
  ) {
    return [];
  }

  if (
    params.containedInKr !== undefined ||
    params.containedInEn !== undefined
  ) {
    return getContainedSubstances('cannabis', params, queryOption);
  }

  const { whereClause, whereValues } = buildWhereClause(
    getCannabisWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT * FROM cannabis ${whereClause}
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
