export interface IUnifiedSearchResponse {
  success: boolean;
  data: {
    results: string[];
  };
  message: string;
}

export interface IUnifiedSearchError {
  message: string;
  code?: string;
}
