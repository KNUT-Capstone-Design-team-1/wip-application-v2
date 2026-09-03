import { IdentificationSearchQueryService } from '../../../src/features/pill_identification_search/services/identification_search_query_service';
import { IIdentificationSearchRepository } from '../../../src/features/pill_identification_search/data/repositories/identification_search_repository';
import { ISearchPillData } from '../../../src/features/pill_identification_search/types';

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

// Mock logger to suppress external logging errors during tests
jest.mock('../../../src/utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
}));

describe('IdentificationSearchQueryService 단위 테스트', () => {
  let mockRepository: jest.Mocked<IIdentificationSearchRepository>;
  let service: IdentificationSearchQueryService;

  beforeEach(() => {
    mockRepository = {
      searchPills: jest.fn(),
      countPills: jest.fn(),
    };
    service = new IdentificationSearchQueryService(mockRepository);
  });

  test('searchPills 호출 시 파라미터를 빌드하고 검색 결과와 총 개수를 반환한다', async () => {
    const mockPills = [
      {
        ITEM_SEQ: '199303108',
        ITEM_NAME: '타이레놀정500밀리그람',
        ENTP_NAME: '(주)한국얀센',
      } as any,
    ];

    mockRepository.searchPills.mockResolvedValue(mockPills);
    mockRepository.countPills.mockResolvedValue(1);

    const raw: ISearchPillData = {
      PRINT_FRONT: 'TY',
      PRINT_BACK: '',
      ITEM_NAME: '타이레놀',
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

    const { results, totalCount, searchParam } = await service.searchPills(
      raw,
      { page: 1, limit: 30 },
    );

    expect(mockRepository.searchPills).toHaveBeenCalledTimes(1);
    expect(mockRepository.countPills).toHaveBeenCalledTimes(1);
    expect(searchParam.PRINT_FRONT).toBe('TY');
    expect(searchParam.ITEM_NAME).toBe('타이레놀');
    expect(results).toEqual(mockPills);
    expect(totalCount).toBe(1);
  });

  test('쿼리 실패 시 빈 배열과 0을 안전하게 반환한다', async () => {
    mockRepository.searchPills.mockRejectedValue(new Error('DB Query Error'));

    const raw: ISearchPillData = {
      PRINT_FRONT: '',
      PRINT_BACK: '',
      ITEM_NAME: '',
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

    const { results, totalCount } = await service.searchPills(raw);

    expect(results).toEqual([]);
    expect(totalCount).toBe(0);
  });
});
