import { IPillData, TPillDataSearchParam } from '@services/database/types';

export interface ISearchResultData {
  searchResultData: IPillData[];
  isLoadingMore?: boolean;
}

export interface IResultItemProps {
  resultItem: IPillData;
  itemClickHandler: (seq: string, itemImage: string) => void;
}

export interface ISearchResultListStore {
  searchResultData: IPillData[];
  isLoading: boolean;
  searchParam: Partial<TPillDataSearchParam> | null;
  markImages: { code: string; base64: string }[];
  currentPage: number;
  hasMore: boolean;

  setSearchParam: (param: Partial<TPillDataSearchParam> | null) => void;
  setMarkImages: (images: { code: string; base64: string }[]) => void;
  setSearchResultData: (resultData: IPillData[]) => void;
  appendSearchResultData: (newData: IPillData[]) => void;
  setIsLoading: (loading: boolean) => void;
  getSearchResultData: () => IPillData[];
  getSearchParam: () => Partial<TPillDataSearchParam> | null;
}
