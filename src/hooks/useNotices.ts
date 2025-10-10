import { apiClient } from '@/api/apiClient';
import { INoticeApiResponseItem, INoticeData } from '@/types/TNoticeType';
import { useNoticeStore } from '@store/noticeStore';
import { useShallow } from 'zustand/react/shallow';

/*
 * 공지사항 전체 데이터 가져오는 기능 추가
 * home의 바텀시트에 보여줄 공지 추가
 * 공지 상세 정보 데이터 가져오는 기능 추가
 */
export const useNotices = () => {
  const [setNoticeData, setMainBottomSheetData] = useNoticeStore(
    useShallow((state) => [
      state.actions.setNoticeData,
      state.actions.setMainBottomSheetData,
    ]),
  );

  // 전체 공지사항 데이터 불러와주는 함수
  const getNoticeList = async () => {
    const notices: INoticeApiResponseItem[] = await apiClient.get(
      `${process.env.EXPO_PUBLIC_CLOUD_FLARE_WORKERS_NOTICES_API_URL}/notices`,
    );

    const allNotices = notices[0].results;
    setNoticeData(allNotices);

    // notice 데이터들을 sort 하는 기능
    return noticeDataSort(allNotices);
  };

  /* notice 데이터 정렬하는 함수
   * 1. mustRead가 1인 것을 상위로
   * 2. 같은 mustRead 내에서는 idx 역순(높은 숫자가 먼저)
   * */
  const noticeDataSort = (allNotices: INoticeData[]) => {
    return allNotices.sort((beforeNoticeData, afterNoticeData) => {
      // mustRead 우선 정렬 (1이 0보다 앞으로)
      if (beforeNoticeData.mustRead !== afterNoticeData.mustRead) {
        return afterNoticeData.mustRead - beforeNoticeData.mustRead;
      }
      // mustRead가 같으면 idx 역순 (높은 숫자가 앞으로)
      return afterNoticeData.idx - beforeNoticeData.idx;
    });
  };

  // 공지사항 상세 데이터 가져오는 함수
  const getNoticeDetail = async () => {};

  // main에 바텀 시트에 보여줄 공지사항 골라내는 함수
  const getNoticeBottomSheet = async () => {
    const allNotices = await getNoticeList();

    const mustReadNotice = allNotices.filter((notice: INoticeData) => {
      return notice.mustRead === 1;
    });

    setMainBottomSheetData(mustReadNotice);
  };

  return {
    getNoticeList,
    getNoticeDetail,
    getNoticeBottomSheet,
  };
};
