import { getDatabase } from '../sqlite';
import type {
  IPillData,
  TPillDataSearchParam,
  PillDataQueryOptions,
} from '../types';
import {
  buildPillDataListQuery,
  buildPillDataCountQuery,
} from './pill_data_query_builder';

export const getPillDatas = async (
  params: Partial<TPillDataSearchParam>,
  options: PillDataQueryOptions,
) => {
  const { sql, values } = buildPillDataListQuery(params, options);
  const db = await getDatabase();
  return db.getAllAsync<IPillData>(sql, values);
};

export const getPillDataCount = async (
  params: Partial<TPillDataSearchParam>,
  options: Pick<PillDataQueryOptions, 'identificationOnly'> = {},
) => {
  const { sql, values } = buildPillDataCountQuery(params, options);
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ COUNT: number }>(sql, values);
  return result?.COUNT ?? 0;
};

/**
 * ID 값인 ITEM_SEQ를 기준으로 알약 데이터 목록 조회
 * @param itemSeqs ITEM_SEQ 배열
 * @returns
 */
export const getPillDatasByItemSeq = async (itemSeqs: string[]) => {
  if (itemSeqs.length === 0) {
    return [];
  }

  const db = await getDatabase();

  const sql = `
    SELECT * FROM pill_data 
    WHERE ITEM_SEQ IN (${itemSeqs.map(() => '?').join(', ')})
  `;

  const result = await db.getAllAsync<IPillData>(sql, itemSeqs);

  // 서버의 BM25 정렬 순서
  const pillMap = new Map(result.map((pill) => [pill.ITEM_SEQ, pill]));

  return itemSeqs
    .map((seq) => pillMap.get(seq))
    .filter((pill): pill is IPillData => Boolean(pill));
};
