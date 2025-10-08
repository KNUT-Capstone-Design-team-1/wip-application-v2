import { apiClient } from '@/api/apiClient';
import { INoticeApiResponseItem } from '@/types/TNoticeType';
import { useNoticeStore } from '@store/noticeStore';
import { useShallow } from 'zustand/react/shallow';

/*
 * 공지사항 전체 데이터 가져오는 기능 추가
 * home의 바텀시트에 보여줄 공지 추가
 * 공지 상세 정보 데이터 가져오는 기능 추가
 */
export const useNotices = () => {
  const [noticeData, setNoticeData] = useNoticeStore(
    useShallow((state) => [state.noticeData, state.actions.setNoticeData]),
  );

  // 전체 공지사항 데이터 불러와주는 함수
  const getNoticeList = async () => {
    const notices: INoticeApiResponseItem[] = await apiClient.get(
      `${process.env.EXPO_PUBLIC_CLOUD_FLARE_WORKERS_NOTICES_API_URL}/notices`,
    );

    setNoticeData(notices[0].results);
  };

  // 공지사항 상세 데이터 가져오는 함수
  const getNoticeDetail = async () => {};

  // main에 바텀 시트에 보여질 함수
  const getNoticeButtonSheet = () => {};

  return {
    getNoticeList,
    getNoticeDetail,
    getNoticeButtonSheet,
  };
};
