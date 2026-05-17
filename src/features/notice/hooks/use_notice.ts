import { INoticeData } from '../types/notice_type';
import { useNoticeStore } from '../store/notice_store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getNoticeToken } from '../utils/notice';

const NOTICE_CACHE_KEY = 'cachedNoticeData';

/*
 * 공지사항 전체 데이터 가져오는 기능 추가
 * home의 바텀시트에 보여줄 공지 추가
 * 공지 상세 정보 데이터 가져오는 기능 추가
 */
export const useNotices = () => {
  const { setNoticeData, setMainBottomSheetData, setIsNoticeLoading } =
    useNoticeStore((state) => state.actions);

  const getNoticeList = async () => {
    try {
      setIsNoticeLoading(true);

      const url = process.env.EXPO_PUBLIC_CLOUD_FLARE_WIP_NOTICE_URL;

      if (!url) {
        console.error('Notice API URL is not defined');
        return [];
      }

      const token = await getNoticeToken();
      const response = await axios.get(`${url}/notices`, {
        headers: {
          'x-auth-token': token,
        },
      });

      const sortedNotices = noticeDataSort(response.data.notices);

      // Store에 데이터 설정
      setNoticeData(sortedNotices);

      return sortedNotices;
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      return [];
    } finally {
      setIsNoticeLoading(false);
    }
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

  // 캐시된 공지사항 데이터 가져오기
  const getCachedNotices = async (): Promise<INoticeData[] | null> => {
    try {
      const cachedData = await AsyncStorage.getItem(NOTICE_CACHE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      return null;
    } catch (error) {
      console.error('Failed to get cached notices:', error);
      return null;
    }
  };

  // 공지사항 데이터 캐싱하기
  const cacheNotices = async (notices: INoticeData[]) => {
    try {
      await AsyncStorage.setItem(NOTICE_CACHE_KEY, JSON.stringify(notices));
    } catch (error) {
      console.error('Failed to cache notices:', error);
    }
  };

  // main에 바텀 시트에 보여줄 공지사항 골라내는 함수
  const getNoticeBottomSheet = async () => {
    try {
      setIsNoticeLoading(true);

      // 1. 먼저 캐시된 데이터 확인
      const cachedNotices = await getCachedNotices();
      if (cachedNotices) {
        console.log('캐시된 공지사항 데이터 사용');
        const cachedMustReadNotice = cachedNotices.filter(
          (notice: INoticeData) => {
            return notice.mustRead === 1;
          },
        );
        setNoticeData(cachedNotices);
        setMainBottomSheetData(cachedMustReadNotice);
        setIsNoticeLoading(false);

        // 백그라운드에서 새 데이터 가져오기 (캐시 갱신용)
        getNoticeList()
          .then((allNotices) => {
            cacheNotices(allNotices);
          })
          .catch((error) => {
            console.error('백그라운드 공지사항 갱신 실패:', error);
          });

        return;
      }

      // 2. 캐시가 없으면 API 호출 (1.5초 타임아웃)
      const startTime = performance.now();
      const allNotices = await getNoticeList();
      const endTime = performance.now();

      const duration = endTime - startTime;

      // 1.5초(1500ms) 이상 걸렸으면 바텀시트 표시 안 함
      if (duration >= 1500) {
        setNoticeData(allNotices); // 공지사항 목록 화면을 위해 데이터는 저장
        setMainBottomSheetData([]); // 바텀시트는 표시 안 함
        // 그래도 다음을 위해 캐싱은 해둠
        await cacheNotices(allNotices);
        return;
      }

      const mustReadNotice = allNotices.filter((notice: INoticeData) => {
        return notice.mustRead === 1;
      });

      setMainBottomSheetData(mustReadNotice);

      // 새로 가져온 데이터 캐싱
      await cacheNotices(allNotices);
    } catch (error) {
      console.error('Failed to load notices:', error);
      setMainBottomSheetData([]);
    } finally {
      setIsNoticeLoading(false);
    }
  };

  return {
    getNoticeList,
    getNoticeDetail,
    getNoticeBottomSheet,
  };
};
