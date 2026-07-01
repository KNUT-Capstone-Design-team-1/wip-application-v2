import { useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INoticeData } from '@features/notice/types/notice_type';
import { useNoticeStore } from '@features/notice/store/notice_store';
import { requestReadNotices } from '@services/apis/cloud_flare/wip_notice';
import { useShallow } from 'zustand/react/shallow';
import logger from '@utils/logger';

const NOTICE_CACHE_KEY = 'cachedNoticeData';

export const useNotices = () => {
  // 스토어에서 필요한 액션만 shallow selection 하여 불필요한 리렌더링 방지
  const { setNoticeData, setMainBottomSheetData, setIsNoticeLoading } =
    useNoticeStore(
      useShallow((state) => ({
        setNoticeData: state.setNoticeData,
        setMainBottomSheetData: state.setMainBottomSheetData,
        setIsNoticeLoading: state.setIsNoticeLoading,
      })),
    );

  /**
   * 공지사항 데이터를 우선순위에 따라 정렬
   * 1. 필독(mustRead: 1) 공지 상단 배치
   * 2. 동일 조건 내 idx 역순(최신순) 배치
   */
  const noticeDataSort = useCallback((notices: INoticeData[]) => {
    return [...notices].sort((a, b) => {
      // 필독 여부가 다르면 필독 공지를 우선
      if (a.mustRead !== b.mustRead) {
        return b.mustRead - a.mustRead;
      }
      // 필독 여부가 같으면 인덱스 역순(최신순)
      return b.idx - a.idx;
    });
  }, []);

  /**
   * 전체 공지사항 목록을 API로부터 가져옴
   */
  const getNoticeList = useCallback(async () => {
    try {
      setIsNoticeLoading(true);

      const response = await requestReadNotices();

      // API 응답 데이터 정렬 및 스토어 저장
      const sortedNotices = noticeDataSort(response.notices as any);
      setNoticeData(sortedNotices);

      return sortedNotices;
    } catch (e) {
      logger.error(`Failed to get notices. ${e.stack || e}`);

      return [];
    } finally {
      setIsNoticeLoading(false);
    }
  }, [setNoticeData, noticeDataSort]);

  /**
   * 로컬 스토리지에 캐시된 공지사항 데이터 로드
   */
  const getCachedNotices = useCallback(async (): Promise<
    INoticeData[] | null
  > => {
    try {
      const cachedData = await AsyncStorage.getItem(NOTICE_CACHE_KEY);

      return cachedData ? JSON.parse(cachedData) : null;
    } catch (e) {
      logger.error(`Failed to get cached notices. ${e.stack || e}`);

      return null;
    }
  }, []);

  /**
   * 공지사항 데이터를 로컬 스토리지에 캐싱
   */
  const cacheNotices = useCallback(async (notices: INoticeData[]) => {
    try {
      await AsyncStorage.setItem(NOTICE_CACHE_KEY, JSON.stringify(notices));
    } catch (e) {
      logger.error(`Failed to cache notices. ${e.stack || e}`);
    }
  }, []);

  /**
   * 홈 화면 바텀시트용 공지사항 로드 (캐시 우선 전략)
   */
  const getNoticeBottomSheet = useCallback(async () => {
    const isNeverShowAgain = useNoticeStore.getState().isNeverShowAgain;

    // 하루 동안 보지 않기 상태 시 공지사항 갱신 안함
    if (isNeverShowAgain) return;

    try {
      // 캐시된 데이터 먼저 확인하여 즉시 UI 반영
      const cachedNotices = await getCachedNotices();
      if (cachedNotices) {
        const mustReadNotices = cachedNotices.filter((n) => n.mustRead === 1);

        setNoticeData(cachedNotices);
        setMainBottomSheetData(mustReadNotices);

        // 백그라운드에서 조용히 최신 데이터 갱신
        getNoticeList()
          .then((newNotices) => cacheNotices(newNotices))
          .catch((e) => logger.error(`Background cache update failed: ${e}`));

        return;
      }

      // 캐시가 없는 경우 API 호출 (응답 속도에 따라 바텀시트 노출 결정)
      const allNotices = await getNoticeList();

      const mustReadNotices = allNotices.filter((n) => n.mustRead === 1);

      setMainBottomSheetData(mustReadNotices);

      await cacheNotices(allNotices);
    } catch (e) {
      logger.error(`Failed to get notice bottom sheet. ${e.stack || e}`);

      setMainBottomSheetData([]);
    }
  }, [
    getCachedNotices,
    setNoticeData,
    setMainBottomSheetData,
    getNoticeList,
    cacheNotices,
  ]);

  // 반환 객체를 메모이제이션하여 훅을 사용하는 컴포넌트의 불필요한 리렌더링 방지
  return useMemo(
    () => ({
      getNoticeList,
      getNoticeBottomSheet,
    }),
    [getNoticeList, getNoticeBottomSheet],
  );
};
