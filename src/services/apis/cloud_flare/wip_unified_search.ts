import axios, { AxiosError, isAxiosError } from 'axios';
import { getToken } from './token';

export interface UnifiedSearchResponse {
  results: string[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * 통합 검색 요청
 * @param keywords 검색 단어 목록 (최대 5개)
 * @param limit 한 페이지당 개수 (기본값: 100, 최소값: 100)
 * @param cursor 다음 페이지 조회를 위한 커서 토큰
 * @returns
 */
export async function requestUnifiedSearch(
  keywords: string[],
  limit: number = 100,
  cursor?: string | null,
) {
  const token = await getToken();

  try {
    const queryParams = [
      ...keywords.map((k) => `keyword=${encodeURIComponent(k)}`),
      `limit=${limit}`,
    ];

    if (cursor) {
      queryParams.push(`cursor=${encodeURIComponent(cursor)}`);
    }

    // 실패 시 http 400 + message
    const response = await axios.get<UnifiedSearchResponse>(
      `${process.env.EXPO_PUBLIC_CLOUD_FLARE_WIP_UNIFIED_SEARCH_URL as string}?${queryParams.join('&')}`,
      {
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      },
    );

    return { success: true, data: response.data, message: '' };
  } catch (e) {
    if (isAxiosError(e)) {
      return {
        success: false,
        message: (e as AxiosError<string>).response?.data,
      };
    }

    return { success: false, message: `${(e as Error).stack}` };
  }
}
