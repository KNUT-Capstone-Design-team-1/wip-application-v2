export interface ISearchResultData {
  searchResultData: any[];
  isLoadingMore?: boolean;
}

export interface IResultItemProps {
  resultItem: any;
  itemClickHandler: (seq: string, itemImage: string) => void;
}
