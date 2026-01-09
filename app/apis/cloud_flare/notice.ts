import CLOUD_FLARE_AXIOS_INSTANCE from './cloud_flare_axios_instance';

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
 * 공지사항 작성
 * @param contents 공지사항 내용
 * @returns
 */
export const requestCreateNotice = async (contents: TNoticeWritePayload) => {
  return CLOUD_FLARE_AXIOS_INSTANCE.post<'Created'>(`/notices`, contents, {
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * 공지사항 목록 조회
 * @param skip 페이지
 * @param limit 페이지 내 공지사항 개수
 * @param mustRead 필독 여부
 * @returns
 */
export const requestReadNotices = async (
  skip?: number,
  limit?: number,
  mustRead?: boolean,
) => {
  return CLOUD_FLARE_AXIOS_INSTANCE.get<TNoticeList>(`/notices`, {
    params: { skip, limit, mustRead },
  });
};

/**
 * 공지사항 수정
 * @param idx 공지사항 ID
 * @param contents 공지사항 내용
 * @returns
 */
export const requestUpdateNotice = async (
  idx: number,
  contents: TNoticeWritePayload,
) => {
  return CLOUD_FLARE_AXIOS_INSTANCE.put<'Success'>(
    `/notices/${idx}`,
    contents,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
};

/**
 * 공지사항 삭제
 * @param idx 공지사항 ID
 * @returns
 */
export const requestDeleteNotice = async (idx: number) => {
  return CLOUD_FLARE_AXIOS_INSTANCE.delete<'Success'>(`/notices/${idx}`);
};
