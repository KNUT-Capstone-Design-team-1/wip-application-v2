import axios, { isAxiosError } from 'axios';
import { getToken } from './token';

export interface UnifiedSearchResponse {
  results: string[];
  nextCursor: string | null;
  hasMore: boolean;
}

const DEFAULT_SEARCH_ERROR_MESSAGE =
  '통합 검색에 실패했습니다.\n나중에 다시 시도해 주세요.';

// 오류 응답 객체를 Toast의 텍스트로 넘기면 렌더링 오류가 발생한다.
function getSearchErrorMessage(data: unknown): string {
  if (typeof data === 'string' && data.trim()) {
    return data;
  }
  if (data && typeof data === 'object') {
    for (const key of ['message', 'error'] as const) {
      const message =
        key in data ? (data as Record<string, unknown>)[key] : undefined;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
  }
  return DEFAULT_SEARCH_ERROR_MESSAGE;
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
  try {
    const token = await getToken();
    const queryParams = [
      ...keywords.map((k) => `keyword=${encodeURIComponent(k)}`),
      `limit=${limit}`,
      // Bypass legacy 30-day cache entries; v2 responses use the 1-day cache.
      'v=2',
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
        message: getSearchErrorMessage(e.response?.data),
      };
    }

    return { success: false, message: DEFAULT_SEARCH_ERROR_MESSAGE };
  }
}
