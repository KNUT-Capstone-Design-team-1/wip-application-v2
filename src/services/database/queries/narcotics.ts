import {
  getContainedSubstances,
  assertSubstanceSearch,
} from './substance_search';
import { getDatabase } from '../sqlite';
import {
  INarcotics,
  TNarcoticsSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

/**
 * narcotics 테이블 조회를 위한 WHERE param 생성
 * @param _params where 절에 사용할 검색 조건
 * @returns
 */
const getNarcoticsWhereQuery: TWhereQueryClauseFunc = (
  _params: Partial<TNarcoticsSearchParam>,
): TQuerySearchParamResult<TNarcoticsSearchParam> => {
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
 * Narcotics 목록 조회
 * @param params 검색 조건
 * @param queryOption 쿼리 옵션
 * @returns
 */
export const getNarcotics = async (
  params: Partial<TNarcoticsSearchParam> = {},
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
    return getContainedSubstances('narcotic', params, queryOption);
  }

  const { whereClause, whereValues } = buildWhereClause(
    getNarcoticsWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT * FROM narcotics ${whereClause}
               LIMIT ?, ?`;

  const { page = 1, limit = 30 } = queryOption;
  const offset = (page - 1) * limit;

  const result = await db.getAllAsync<INarcotics>(sql, [
    ...whereValues,
    offset,
    limit,
  ]);

  return result;
};
