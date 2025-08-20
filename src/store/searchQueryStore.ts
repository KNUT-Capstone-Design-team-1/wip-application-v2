import { create } from 'zustand';
import { getQueryForSearch, TPillSearchParam } from '@/api/db/query';

type TSearchQuery = {
  data: TPillSearchParam | null;
  mode: number;
};

type TSearchQueryParams = {
  filter: string | undefined;
  params: string[] | undefined;
  initData: TPillSearchParam | null;
};

interface ISearchQueryStore {
  searchQuery: TSearchQuery;
  searchFilterParams: TSearchQueryParams;
  setSearchQuery: (searchQuery: TSearchQuery) => void;
  resetSearchQuery: () => void;
}

export const useSearchQueryStore = create<ISearchQueryStore>((set) => ({
  searchQuery: { data: null, mode: 0 },
  searchFilterParams: { filter: undefined, params: undefined, initData: null },
  setSearchQuery: (searchQuery) => {
    if (!searchQuery.data) {
      set({
        searchQuery: { data: null, mode: 0 },
        searchFilterParams: {
          filter: undefined,
          params: undefined,
          initData: null,
        },
      });
    }
    const { filter, params } = getQueryForSearch(searchQuery.data);
    set({
      searchQuery,
      searchFilterParams: { filter, params, initData: searchQuery.data },
    });
  },
  resetSearchQuery: () =>
    set({
      searchQuery: { data: null, mode: 0 },
      searchFilterParams: {
        filter: undefined,
        params: undefined,
        initData: null,
      },
    }),
}));
