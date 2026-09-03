import { MarkSearchService } from '../../../src/features/pill_identification_search/services/mark_search_service';
import { IMarkSearchRepository } from '../../../src/features/pill_identification_search/data/repositories/mark_search_repository';
import { IMarkPaginationService } from '../../../src/features/pill_identification_search/services/mark_pagination_service';
import { INITIAL_LOAD_COUNT } from '../../../src/features/pill_identification_search/constants/identification_pagination_constant';

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

describe('MarkSearchService 단위 테스트', () => {
  let mockRepository: jest.Mocked<IMarkSearchRepository>;
  let mockPaginationService: jest.Mocked<IMarkPaginationService>;
  let service: MarkSearchService;

  beforeEach(() => {
    mockRepository = {
      getMarks: jest.fn(),
    };
    mockPaginationService = {
      calculateTotalPages: jest.fn(),
    };
    service = new MarkSearchService(mockRepository, mockPaginationService);
  });

  test('getMarks 호출 시 검색 파라미터를 구성하여 리포지토리에 위임한다', async () => {
    const mockMarks = [
      { code: '1001', title: '원형 마크', base64: 'data:image/png;base64,...' },
    ];
    mockRepository.getMarks.mockResolvedValue(mockMarks);

    const result = await service.getMarks('원형', 1, 30);

    expect(mockRepository.getMarks).toHaveBeenCalledWith(
      { title: '원형' },
      { page: 1, limit: 30 },
    );
    expect(result).toEqual(mockMarks);
  });

  test('키워드가 없으면 빈 검색 조건과 기본 INITIAL_LOAD_COUNT로 조회한다', async () => {
    mockRepository.getMarks.mockResolvedValue([]);

    await service.getMarks('   ');

    expect(mockRepository.getMarks).toHaveBeenCalledWith(
      {},
      { page: 1, limit: INITIAL_LOAD_COUNT },
    );
  });

  test('calculateTotalPages 호출 시 paginationService로 위임한다', () => {
    mockPaginationService.calculateTotalPages.mockReturnValue(10);

    const total = service.calculateTotalPages(120);

    expect(mockPaginationService.calculateTotalPages).toHaveBeenCalledWith(120);
    expect(total).toBe(10);
  });
});
