import { useCallback, useMemo } from 'react';
import { INoticeData } from '@features/notice/types/notice_type';
import { useNoticeStore } from '@features/notice/store/notice_store';
import { noticeService } from '@features/notice/services/notice_service';
import { useShallow } from 'zustand/react/shallow';
import logger from '@utils/logger';

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

  // 전체 공지사항 목록을 서비스로부터 가져옴
  const getNoticeList = useCallback(async (): Promise<INoticeData[]> => {
    try {
      setIsNoticeLoading(true);
      const sortedNotices = await noticeService.getNoticeList();
      setNoticeData(sortedNotices);
      return sortedNotices;
    } catch (e) {
      logger.error(`[USE-NOTICES] Failed to get notices: ${e}`);
      return [];
    } finally {
      setIsNoticeLoading(false);
    }
  }, [setNoticeData, setIsNoticeLoading]);

  // 홈 화면 바텀시트용 공지사항 로드 (캐시 우선 전략)
  const getNoticeBottomSheet = useCallback(async () => {
    try {
      // 캐시된 데이터 먼저 확인하여 즉시 UI 반영
      const cachedNotices = await noticeService.getCachedNotices();
      if (cachedNotices) {
        const mustReadNotices =
          noticeService.filterMustReadNotices(cachedNotices);

        setNoticeData(cachedNotices);
        setMainBottomSheetData(mustReadNotices);
      }

      // 캐시 유무와 관계없이 최신 필독 공지를 현재 화면에도 반영한다.
      const allNotices = await noticeService.getNoticeList();
      const mustReadNotices = noticeService.filterMustReadNotices(allNotices);

      setNoticeData(allNotices);
      setMainBottomSheetData(mustReadNotices);
      await noticeService.cacheNotices(allNotices);
    } catch (e) {
      logger.error(`[USE-NOTICES] Failed to get notice bottom sheet: ${e}`);
    }
  }, [setNoticeData, setMainBottomSheetData]);

  // 반환 객체를 메모이제이션하여 훅을 사용하는 컴포넌트의 불필요한 리렌더링 방지
  return useMemo(
    () => ({
      getNoticeList,
      getNoticeBottomSheet,
    }),
    [getNoticeList, getNoticeBottomSheet],
  );
};
