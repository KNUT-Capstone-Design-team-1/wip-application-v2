import { useAppTrackStore } from '@store/app_track_store';

// 식별 검색 사용자 액션 및 통계 트래킹 서비스
export const identificationSearchAnalyticsService = {
  // 검색 코어 액션 카운트 기록
  recordSearchAction(): void {
    useAppTrackStore
      .getState()
      .increaseCoreActionCount('identification_search');
  },
};
