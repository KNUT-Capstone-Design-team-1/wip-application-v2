import { getDatabase } from '../sqlite';
import {
  IPsychotropics,
  TPsychotropicsSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

const ALL_PSYCHOTROPICS_COLUMNS: (keyof IPsychotropics)[] = [
  'chemicalNameKr',
  'chemicalNameEn',
  'synonyms',
  'casNumber',
  'isomerCasNumber',
  'molecularFormula',
  'molecularWeight',
] as const;

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
      query: `chemicalNameKr LIKE ?`,
      values: (chemicalNameKr: string) => [`%${chemicalNameKr}%`],
    },
    chemicalNameEn: {
      query: `chemicalNameEn LIKE ?`,
      values: (chemicalNameEn: string) => [`%${chemicalNameEn}%`],
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
  const { whereClause, whereValues } = buildWhereClause(
    getPsychotropicsWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT ${ALL_PSYCHOTROPICS_COLUMNS} FROM psychotropics ${whereClause}
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
