import axios, { Axios } from 'axios';

type TNotice = {
  title: string;
  contents: string;
  mustRead: boolean;
  createDate: string;
  updateDate: string;
};

type TNoticeList = {
  success: boolean;
  notices: TNotice[];
  total: number;
}[];

type TNoticeWritePayload = Pick<TNotice, 'title' | 'contents' | 'mustRead'>;

/**
 * 공지사항 클라이언트
 */
export class NoticeClient {
  private readonly apiURL: string;
  private readonly token: string;
  private readonly axiosClient: Axios;

  constructor() {
    this.apiURL = process.env.CLOUD_FLARE_WORKERS_NOTICES_API_URL as string;

    this.token = process.env.CLOUD_FLARE_WORKERS_TOKEN as string;

    this.axiosClient = axios.create({
      baseURL: this.apiURL,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  /**
   * 공지사항 작성
   * @param payload 공지사항 내용
   * @returns
   */
  public async createNotice(payload: TNoticeWritePayload) {
    return this.axiosClient.post<'Created'>(`/notices`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * 공지사항 목록 조회
   * @param skip 페이지
   * @param limit 페이지 내 공지사항 개수
   * @param mustRead 필독 여부
   * @returns
   */
  public async readNotices(skip?: number, limit?: number, mustRead?: boolean) {
    return this.axiosClient.get<TNoticeList>(`/notices`, {
      params: { skip, limit, mustRead },
    });
  }

  /**
   * 공지사항 수정
   * @param idx 공지사항 ID
   * @param payload 공지사항 내용
   * @returns
   */
  public async updateNotice(idx: number, payload: TNoticeWritePayload) {
    return this.axiosClient.put<'Success'>(`/notices/${idx}`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * 공지사항 삭제
   * @param idx 공지사항 ID
   * @returns
   */
  public async deleteNotice(idx: number) {
    return this.axiosClient.delete<'Success'>(`/notices/${idx}`);
  }
}
