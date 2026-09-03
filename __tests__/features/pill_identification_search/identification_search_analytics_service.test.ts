import { IdentificationSearchAnalyticsService } from '../../../src/features/pill_identification_search/services/identification_search_analytics_service';
import { useAppTrackStore } from '../../../src/store/app_track_store';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('IdentificationSearchAnalyticsService 단위 테스트', () => {
  let service: IdentificationSearchAnalyticsService;

  beforeEach(() => {
    service = new IdentificationSearchAnalyticsService();
  });

  test('recordSearchAction 호출 시 identification_search 코어 액션 카운트가 1 증가한다', () => {
    const initialCount =
      useAppTrackStore.getState().coreActionCounts.identification_search;

    service.recordSearchAction();

    const afterCount =
      useAppTrackStore.getState().coreActionCounts.identification_search;

    expect(afterCount).toBe(initialCount + 1);
  });
});
