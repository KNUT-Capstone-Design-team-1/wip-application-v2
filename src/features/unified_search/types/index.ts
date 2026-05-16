export interface IUnifiedSearchResponse {
  success: boolean;
  data: string[];
  message: string;
}

export interface IUnifiedSearchError {
  message: string;
  code?: string;
}
