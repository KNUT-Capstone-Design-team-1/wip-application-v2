// @api/client/mark.ts
import { apiClient } from '@api/apiClient';
import { TMarkDataResponse } from '@/types/TApiType';
import { ToastAndroid } from 'react-native';

/*
  title : 마크 이름
  limit : 호출 개수
  page : 선택된 pagination
  retries : 남은 재시도 횟수
  delay : 재시도 까지 기다릴 딜레이(ms)
  attemptCounter : 현재 시도 횟수 (내부적으로만 사용)
*/

// 재시도 로직 잠시 주석 처리 api 호출 실패 시 앱 다시 실행시키는 방향으로 수정
const getMarkData = async (
  title: string,
  limit: number,
  page: number,
  retries?: number,
  delay?: number,
  attemptCounter: number = 1, // 기본값 1부터 시작
) => {
  try {
    const response: TMarkDataResponse = await apiClient.get(
      `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_MARK_IMAGE_URL}?page=${page}&limit=${limit}&title=${encodeURIComponent(title)}`,
    );

    return {
      pages: response.totalPage,
      markData: response.data,
    };
  } catch (e) {
    console.log(`Mark data api error`);

    // if (attemptCounter > 3 || retries <= 0) {
    //   // 최대 재시도 초과 → 안내 메시지
    //   ToastAndroid.show(
    //     '마크 검색이 원활하게 되지 않습니다. 앱을 종료 후 다시 시작해주세요.',
    //     ToastAndroid.LONG,
    //   );
    //   throw new Error('Mark api all retries failed');
    // }

    ToastAndroid.show(
      // `다시 요청을 보내는 중입니다... (${attemptCounter}회 시도)`,
      `마크 검색에 실패했습니다. 앱 종료 후 다시 실행시켜주세요.`,
      ToastAndroid.SHORT,
    );

    // delay 후 재귀 호출
    // await new Promise((resolve) => setTimeout(resolve, delay));

    // return getMarkData(
    //   title,
    //   limit,
    //   page,
    //   // retries - 1,
    //   // delay,
    //   // attemptCounter + 1,
    // );

    return null;
  }
};

export default getMarkData;
