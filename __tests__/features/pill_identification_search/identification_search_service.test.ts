import { IdentificationSearchService } from '../../../src/features/pill_identification_search/services/identification_search_service';
import { IIdentificationSearchQueryService } from '../../../src/features/pill_identification_search/services/identification_search_query_service';
import { IIdentificationSearchAnalyticsService } from '../../../src/features/pill_identification_search/services/identification_search_analytics_service';
import { ISearchPillData } from '../../../src/features/pill_identification_search/types';

describe('IdentificationSearchService (Facade) 단위 테스트', () => {
  let mockQueryService: jest.Mocked<IIdentificationSearchQueryService>;
  let mockAnalyticsService: jest.Mocked<IIdentificationSearchAnalyticsService>;
  let service: IdentificationSearchService;

  beforeEach(() => {
    mockQueryService = {
      searchPills: jest.fn(),
    };
    mockAnalyticsService = {
      recordSearchAction: jest.fn(),
    };
    service = new IdentificationSearchService(
      mockQueryService,
      mockAnalyticsService,
    );
  });

  test('searchPills 호출 시 queryService로 위임한다', async () => {
    const mockResult = {
      results: [{ ITEM_SEQ: '123' } as any],
      totalCount: 1,
      searchParam: { ITEM_NAME: '약' },
    };
    mockQueryService.searchPills.mockResolvedValue(mockResult);

    const raw: ISearchPillData = {
      PRINT_FRONT: '',
      PRINT_BACK: '',
      ITEM_NAME: '약',
      ENTP_NAME: '',
      DRUG_SHAPE: null,
      FORM_CODE: null,
      COLOR_CLASS1: null,
      COLOR_CLASS2: null,
      LINE_FRONT: null,
      LINE_BACK: null,
      MARK_CODE_FRONT: '',
      MARK_CODE_BACK: '',
      isExactMatch: false,
    };

    const result = await service.searchPills(raw, { page: 1, limit: 30 });

    expect(mockQueryService.searchPills).toHaveBeenCalledWith(raw, {
      page: 1,
      limit: 30,
    });
    expect(result).toEqual(mockResult);
  });

  test('recordSearchAction 호출 시 analyticsService로 위임한다', () => {
    service.recordSearchAction();

    expect(mockAnalyticsService.recordSearchAction).toHaveBeenCalledTimes(1);
  });
});
