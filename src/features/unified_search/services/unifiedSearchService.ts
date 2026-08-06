import { CloudFlare } from '@services/apis';

export const unifiedSearchService = {
  search: async (keywords: string[], limit: number = 30) => {
    return await CloudFlare.UnifiedSearchAPI.requestUnifiedSearch(
      keywords,
      limit,
    );
  },
};
