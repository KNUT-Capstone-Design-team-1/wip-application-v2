export interface IMarkModalProps {
  onClose: () => void;
  searchText: string;
  setSearchText: (text: string) => void;
  markDataList: MarkData[];
  loading: boolean;
  error: string | null;
  handleSearch: () => void;
  handleMarkSelect: (mark: MarkData) => void;
  loadInitialMarks: (keyword: string) => Promise<void>;
  currentPage: number;
  totalPages: number;
  currentGroup: number;
  handlePageChange: (page: number) => void;
  handleGroupChange: (group: number) => void;
}

export interface MarkData {
  code: string;
  title: string;
  base64: string;
}

export interface MarkSearchResponse {
  data: MarkData[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface MarkSearchParams {
  keyword: string;
  page: number;
  limit?: number;
}
