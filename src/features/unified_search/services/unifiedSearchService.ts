import { CloudFlare } from '@services/apis';

export const unifiedSearchService = {
  search: async (keywords: string[]) => {
    return await CloudFlare.UnifiedSearchAPI.requestUnifiedSearch(keywords);
  },
};
