import {
  getContainedSubstances,
  assertSubstanceSearch,
} from './substance_search';
import { getDatabase } from '../sqlite';
import {
  IPsychotropics,
  TPsychotropicsSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

/**
 * psychotropics 테이블 조회를 위한 WHERE param 생성
 * @param _params where 절에 사용할 검색 조건
 * @returns
 */
const getPsychotropicsWhereQuery: TWhereQueryClauseFunc = (
  _params: Partial<TPsychotropicsSearchParam>,
): TQuerySearchParamResult<TPsychotropicsSearchParam> => {
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
 * psychotropics 목록 조회
 * @param params 검색 조건
 * @param queryOption 쿼리 옵션
 * @returns
 */
export const getPsychotropics = async (
  params: Partial<TPsychotropicsSearchParam> = {},
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
    return getContainedSubstances('psychotropic', params, queryOption);
  }

  const { whereClause, whereValues } = buildWhereClause(
    getPsychotropicsWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT * FROM psychotropics ${whereClause}
               LIMIT ?, ?`;

  const { page = 1, limit = 30 } = queryOption;
  const offset = (page - 1) * limit;

  const result = await db.getAllAsync<IPsychotropics>(sql, [
    ...whereValues,
    offset,
    limit,
  ]);

  return result;
};
