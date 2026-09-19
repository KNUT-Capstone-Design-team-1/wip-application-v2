import { getPillDatasByItemSeq } from '@services/database/queries/pill_data';
import { IPillData } from '@services/database/types';

export const unifiedSearchSqliteDataSource = {
  // 결과 품목 일련번호들에 대한 알약 목록 상세 조회
  async getPillDatasByItemSeqs(itemSeqs: string[]): Promise<IPillData[]> {
    return await getPillDatasByItemSeq(itemSeqs);
  },
};
