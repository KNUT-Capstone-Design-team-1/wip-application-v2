import { getPillDatasByItemSeq } from '@services/database/queries/pill_data';
import { IPillData } from '@services/database/types';

export const pillDetailSqliteDataSource = {
  // 로컬 데이터베이스에서 알약 기본 정보 조회.
  async getPillData(itemSeq: string): Promise<IPillData | null> {
    const results = await getPillDatasByItemSeq([itemSeq]);

    return results[0] ?? null;
  },
};
