import axios from 'axios';
import { IClient } from '../client.interface';
import { GoogleAuthInstance } from './auth';

type TGeminiPillFeatureExtractionResponse = {
  success: boolean;
  data?: { PRINT: string[]; SHAPE: string[]; COLOR: string[] };
  message?: string;
};

/**
 * 제미나이 이미지 특징 추출 클라이언트
 */
export class GeminiPillImageFeatureExtractionClient
  extends GoogleAuthInstance
  implements IClient<TGeminiPillFeatureExtractionResponse>
{
  private readonly serviceUrl: string;

  constructor() {
    super();
    this.serviceUrl = process.env.GOOGLE_CLOUD_DL_SERVER_URL as string;
  }

  /**
   * 이미지 특징 추출 요청
   * @param base64 베이스64 이미지 코드
   * @returns
   */
  public async request(base64: string) {
    const result = await axios.post<TGeminiPillFeatureExtractionResponse>(
      this.serviceUrl,
      { base64 },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          apiversion: 2,
        },
      },
    );

    return result.data;
  }
}
