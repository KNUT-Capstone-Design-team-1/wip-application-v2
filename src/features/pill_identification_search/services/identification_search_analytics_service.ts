import { useAppTrackStore } from '@store/app_track_store';

// 식별 검색 사용자 액션 및 통계 트래킹 서비스 인터페이스
export interface IIdentificationSearchAnalyticsService {
  recordSearchAction(): void;
}

// 식별 검색 사용자 액션 및 통계 트래킹 서비스 구현체
export class IdentificationSearchAnalyticsService implements IIdentificationSearchAnalyticsService {
  // 검색 코어 액션 카운트 기록
  recordSearchAction(): void {
    useAppTrackStore
      .getState()
      .increaseCoreActionCount('identification_search');
  }
}

// 식별 검색 트래킹 서비스 싱글톤 인스턴스
export const identificationSearchAnalyticsService =
  new IdentificationSearchAnalyticsService();
