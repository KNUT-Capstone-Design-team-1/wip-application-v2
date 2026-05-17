import axios from 'axios';
import { getToken } from './google_cloud_token';

interface IGeminiPillFeatureExtractionResponse {
  PRINT: string[];
  SHAPE: string[];
  COLOR: string[];
}

interface IRequestPillImageFeatureExtraction {
  front: string;
  back: string;
}

/**
 * 이미지 특징 추출 요청
 * @param payload 요청 데이터
 * @returns
 */
export const requestPillImageFeatureExtraction = async (
  payload: IRequestPillImageFeatureExtraction,
) => {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_PLATFORM_WIP_PILL_IMAGE_FEATURE_EXTRACTION_URL as string;

  const token = getToken();

  const result = await axios.post<IGeminiPillFeatureExtractionResponse>(
    serviceURL,
    payload,
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
