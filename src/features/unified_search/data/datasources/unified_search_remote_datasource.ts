import { CloudFlare } from '@services/apis';

export const unifiedSearchRemoteDataSource = {
  // 통합 검색 원격 API 요청
  async search(keywords: string[], limit: number = 30) {
    return await CloudFlare.UnifiedSearchAPI.requestUnifiedSearch(
      keywords,
      limit,
    );
  },
};
