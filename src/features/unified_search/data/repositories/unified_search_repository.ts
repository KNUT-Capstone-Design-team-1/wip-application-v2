import { unifiedSearchRemoteDataSource } from '../datasources/unified_search_remote_datasource';
import { unifiedSearchSqliteDataSource } from '../datasources/unified_search_sqlite_datasource';
import { IPillData } from '@services/database/types';

export const unifiedSearchRepository = {
  // 원격 서버에 키워드 검색 요청
  async searchRemote(keywords: string[], limit: number = 30) {
    return await unifiedSearchRemoteDataSource.search(keywords, limit);
  },

  // 로컬 DB에서 알약 개수 및 상세 정보 조회
  async getPillDataWithCount(itemSeqs: string[]): Promise<{
    totalCount: number;
    pillDatas: IPillData[];
  }> {
    const [totalCount, pillDatas] = await Promise.all([
      unifiedSearchSqliteDataSource.getPillDataCountByItemSeqs(itemSeqs),
      unifiedSearchSqliteDataSource.getPillDatasByItemSeqs(itemSeqs),
    ]);

    return { totalCount, pillDatas };
  },
};
