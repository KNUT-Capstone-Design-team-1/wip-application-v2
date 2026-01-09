import axios from 'axios';
import { getToken } from './google_cloud_token';

type TGeminiPillFeatureExtractionResponse = {
  success: boolean;
  data?: { PRINT: string[]; SHAPE: string[]; COLOR: string[] };
  message?: string;
};

/**
 * 이미지 특징 추출 요청
 * @param base64 베이스64 이미지 코드
 * @returns
 */
export const requestPillImageFeatureExtraction = async (base64: string) => {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_DL_SERVER_URL as string;

  const token = getToken();

  const result = await axios.post<TGeminiPillFeatureExtractionResponse>(
    serviceURL,
    { base64 },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        apiversion: 2,
      },
    },
  );

  return result.data;
};
