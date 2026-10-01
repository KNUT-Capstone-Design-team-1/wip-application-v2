import { IPillData, TPillDataSearchParam } from '@services/database/types';

export interface ISearchResultData {
  searchResultData: IPillData[];
  isLoadingMore?: boolean;
}

export type TSearchResultListItem =
  { type: 'item'; data: IPillData } | { type: 'ads'; id: string };

export interface IResultItemProps {
  type?: 'item' | 'ads';
  resultItem?: IPillData;
  itemClickHandler?: (seq: string, itemImage: string) => void;
  shouldLoadImage?: boolean;
  onImageLoad?: (itemSeq: string) => void;
  // 광고 전용 속성
  adId?: string;
  isScrolling?: boolean;
}

export interface ISearchResultListStore {
  searchResultData: IPillData[];
  isLoading: boolean;
  searchParam: Partial<TPillDataSearchParam> | null;
  markImages: { code: string; base64: string }[];
  currentPage: number;
  hasMore: boolean;
  totalDataCount: number;
  nextCursor: string | null;

  setSearchParam: (param: Partial<TPillDataSearchParam> | null) => void;
  setMarkImages: (images: { code: string; base64: string }[]) => void;
  setSearchResultData: (resultData: IPillData[]) => void;
  resetSearchResults: () => void;
  setTotalDataCount: (totalDataCount: number) => void;
  setNextCursor: (nextCursor: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  appendSearchResultData: (newData: IPillData[]) => void;
  setIsLoading: (loading: boolean) => void;
  getSearchResultData: () => IPillData[];
  getSearchParam: () => Partial<TPillDataSearchParam> | null;
}
