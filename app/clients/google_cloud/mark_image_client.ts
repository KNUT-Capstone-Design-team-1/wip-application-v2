import axios from 'axios';
import { IClient } from '../client.interface';
import { GoogleAuthInstance } from './auth';

type TMarkImageData = {
  total: number; // 마크이미지 총 개수
  totalPage: number; // 총 페이지
  page: number; // 현재 페이지
  limit: number; // 현재 페이지당 개수
  data: {
    title: string; // 마크 이름
    code: string; // 마크 코드
    base64: string; // 마크 이미지
  }[]; // 데이터
};

/**
 * 마크이미지 클라이언트
 */
export class MarkImageClient
  extends GoogleAuthInstance
  implements IClient<TMarkImageData>
{
  private readonly serviceUrl: string;

  constructor() {
    super();
    this.serviceUrl = process.env.GOOGLE_CLOUD_MARK_IMAGE_URL as string;
  }

  /**
   * 마크 이미지 조회 요청
   * @param page 페이지
   * @param limit 페이지 당 마크 이미지 개수
   * @param title 마크 이미지 이름
   * @returns
   */
  public async request(page: number, limit: number, title?: string) {
    const result = await axios.get<TMarkImageData>(this.serviceUrl, {
      params: {
        page,
        limit,
        title,
      },
      headers: { Authorization: `Bearer ${this.token}` },
    });

    return result.data;
  }
}
