export interface IMarkModalProps {
  onClose: () => void;
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
