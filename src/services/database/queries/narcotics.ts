import { getDatabase } from '../sqlite';
import {
  INarcotics,
  TNarcoticsSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

const ALL_NARCOTICS_COLUMNS: (keyof INarcotics)[] = [
  'chemicalNameKr',
  'chemicalNameEn',
  'synonyms',
  'casNumber',
  'isomerCasNumber',
  'molecularFormula',
  'molecularWeight',
];

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
 * Narcotics 목록 조회
 * @param params 검색 조건
 * @param queryOption 쿼리 옵션
 * @returns
 */
export const getNarcotics = async (
  params: Partial<TNarcoticsSearchParam> = {},
  queryOption: { page: number; limit: number },
) => {
  const { whereClause, whereValues } = buildWhereClause(
    getNarcoticsWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT ${ALL_NARCOTICS_COLUMNS} FROM narcotics ${whereClause}
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
