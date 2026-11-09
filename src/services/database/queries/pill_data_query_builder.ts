import type { TPillDataSearchParam, PillDataQueryOptions } from '../types';
import { buildWhereClause } from '../util';
import { getPillDataWhereQuery } from './pill_data_filters';
import { PILL_IDENTIFICATION_CONDITION } from './pill_search_indexes';

// 인쇄 문자가 없는 알약도 있으므로 낱알 제형 정보로 식별 등록 여부를 판단한다.
const withIdentification = (whereClause: string, identificationOnly = false) =>
  identificationOnly
    ? `${whereClause ? whereClause + ' AND' : 'WHERE'} ${PILL_IDENTIFICATION_CONDITION}`
    : whereClause;

export const buildPillDataListQuery = (
  params: Partial<TPillDataSearchParam>,
  { page = 1, limit = 30, identificationOnly }: PillDataQueryOptions,
) => {
  const {
    whereClause,
    whereValues,
    orderByClause,
    orderValues,
    orderExpression,
  } = buildWhereClause(getPillDataWhereQuery, params, 'AND');
  const offset = (page - 1) * limit;

  if (identificationOnly) {
    return {
      sql: `
        WITH page AS (
          SELECT rowid AS pill_rowid${orderExpression ? ', (' + orderExpression + ') AS match_weight' : ''}
          FROM pill_data
          ${withIdentification(whereClause, true)}
          ORDER BY ${orderExpression ? 'match_weight DESC,' : ''} ITEM_NAME ASC, ITEM_SEQ ASC
          LIMIT ?, ?
        )
        SELECT pill_data.* FROM page
        JOIN pill_data ON pill_data.rowid = page.pill_rowid
        ORDER BY ${orderExpression ? 'page.match_weight DESC,' : ''} pill_data.ITEM_NAME ASC, pill_data.ITEM_SEQ ASC
      `,
      // 가중치는 SELECT에 있으므로 WHERE 값보다 먼저 바인딩한다.
      values: [...orderValues, ...whereValues, offset, limit],
    };
  }

  return {
    sql: `
      SELECT * FROM pill_data
      ${whereClause}
      ${orderByClause ? orderByClause + ',' : 'ORDER BY'} ITEM_NAME ASC, ITEM_SEQ ASC
      LIMIT ?, ?
    `,
    values: [...whereValues, ...orderValues, offset, limit],
  };
};

export const buildPillDataCountQuery = (
  params: Partial<TPillDataSearchParam>,
  { identificationOnly }: Pick<PillDataQueryOptions, 'identificationOnly'> = {},
) => {
  const { whereClause, whereValues } = buildWhereClause(
    getPillDataWhereQuery,
    params,
    'AND',
    { includeOrder: false },
  );
  return {
    sql: `SELECT COUNT(*) as COUNT FROM pill_data ${withIdentification(whereClause, identificationOnly)}`,
    values: whereValues,
  };
};
