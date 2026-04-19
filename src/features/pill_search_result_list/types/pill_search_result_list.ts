import { IPillDataSearchParam } from '@services/database/types';

export interface ISearchResultData {
  searchResultData: any[];
  isLoadingMore?: boolean;
}

export interface IResultItemProps {
  resultItem: any;
  itemClickHandler: (seq: string, itemImage: string) => void;
}

export interface ISearchResultListStore {
  searchResultData: any[];
  isLoading: boolean;
  searchParam: Partial<IPillDataSearchParam> | null;
  currentPage: number;
  hasMore: boolean;

  setSearchParam: (param: any) => void;
  setSearchResultData: (resultData: any[]) => void;
  appendSearchResultData: (newData: any[]) => void; // 데이터 추가 (덮어쓰지 않음)
  setIsLoading: (loading: boolean) => void;
  getSearchResultData: () => any[];
  getSearchParam: () => any;
}
