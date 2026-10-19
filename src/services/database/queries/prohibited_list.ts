import { assertSubstanceSearch } from './substance_search';
import { getClassificationCatalog } from './classification_catalog';
import {
  getClassificationIndex,
  findClassificationProhibitedMatches,
} from '../matching/classification_matcher';
import { getDatabase } from '../sqlite';
import {
  IProhibitedList,
  TProhibitedListSearchParam,
  TQuerySearchParamResult,
  TWhereQueryClauseFunc,
} from '../types';
import { buildWhereClause } from '../util';

/**
 * prohibited_list 테이블 조회를 위한 WHERE param 생성
 * @param _params where 절에 사용할 검색 조건
 * @returns
 */
const getProhibitedListWhereQuery: TWhereQueryClauseFunc = (
  _params: Partial<TProhibitedListSearchParam>,
): TQuerySearchParamResult<TProhibitedListSearchParam> => {
  return {
    contents: {
      query: `instr(lower(contents), lower(?)) > 0`,
      values: (contents: string) => [contents],
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
  if (
    !assertSubstanceSearch(params, [
      'contents',
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
    const catalog = await getClassificationCatalog();
    const docs = getClassificationIndex(catalog).prohibited;
    const kr =
      params.containedInKr !== undefined
        ? new Set(
            findClassificationProhibitedMatches(
              catalog,
              params.containedInKr,
            ).map((match) => match.source),
          )
        : null;
    const en =
      params.containedInEn !== undefined
        ? new Set(
            findClassificationProhibitedMatches(
              catalog,
              params.containedInEn,
            ).map((match) => match.source),
          )
        : null;
    const rows = docs
      .map((doc) => doc.source)
      .filter(
        (source) =>
          (!kr || kr.has(source)) &&
          (!en || en.has(source)) &&
          (params.contents === undefined ||
            source.contents
              .toLowerCase()
              .includes(params.contents.toLowerCase())),
      );
    const { page = 1, limit = 30 } = queryOption;

    return rows
      .slice((page - 1) * limit, page * limit)
      .map((row) => ({ contents: row.contents }));
  }

  const { whereClause, whereValues } = buildWhereClause(
    getProhibitedListWhereQuery,
    params,
  );

  const db = await getDatabase();

  const sql = `SELECT * FROM prohibited_list WHERE contents IS NOT NULL AND length(trim(contents, ?)) > 0 ${whereClause ? 'AND ' + whereClause.slice(6) : ''}
               LIMIT ?, ?`;

  const { page = 1, limit = 30 } = queryOption;

  const results: IProhibitedList[] = await db.getAllAsync(sql, [
    ' \t\n\r\u200B\u200C\u200D\uFEFF',
    ...whereValues,
    (page - 1) * limit,
    limit,
  ]);

  return results.filter(
    (row) =>
      typeof row.contents === 'string' &&
      row.contents.replace(/[\u200B-\u200D\uFEFF]/g, '').trim(),
  );
};
