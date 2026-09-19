import { unifiedSearchRemoteDataSource } from '../datasources/unified_search_remote_datasource';
import { unifiedSearchSqliteDataSource } from '../datasources/unified_search_sqlite_datasource';
import { IPillData } from '@services/database/types';

export const unifiedSearchRepository = {
  // 원격 서버에 키워드 검색 요청
  async searchRemote(
    keywords: string[],
    limit: number = 100,
    cursor?: string | null,
  ) {
    return await unifiedSearchRemoteDataSource.search(keywords, limit, cursor);
  },

  // 로컬 DB에서 알약 개수 및 상세 정보 조회
  async getPillDataWithCount(itemSeqs: string[]): Promise<{
    totalCount: number;
    pillDatas: IPillData[];
  }> {
    const pillDatas =
      await unifiedSearchSqliteDataSource.getPillDatasByItemSeqs(itemSeqs);

    return { totalCount: pillDatas.length, pillDatas };
  },
};
