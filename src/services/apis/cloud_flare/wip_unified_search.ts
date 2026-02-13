import axios, { AxiosError, isAxiosError } from 'axios';
import { getToken } from './token';

interface IUnifiedSearchResponse {
  success: boolean;
  data: string[];
  message: string;
}

/**
 * 통합 검색 요청
 * @param keywords 검색 단어 목록
 * @returns
 */
export async function requestUnifiedSearch(keywords: string[]) {
  const token = await getToken();

  try {
    // 실패 시 http 400 + message
    const response = await axios.get<IUnifiedSearchResponse>(
      `${process.env.EXPO_PUBLIC_CLOUD_FLARE_WIP_UNIFIED_SEARCH_URL as string}?${keywords.map((k) => `keyword=${k}`).join('&')}`,
      {
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      },
    );

    return { success: true, data: response.data, message: '' };
  } catch (e) {
    if (isAxiosError(e)) {
      return {
        success: false,
        data: [],
        message: (e as AxiosError<string>).response?.data,
      };
    }

    return { success: false, data: [], message: `${(e as Error).stack}` };
  }
}
