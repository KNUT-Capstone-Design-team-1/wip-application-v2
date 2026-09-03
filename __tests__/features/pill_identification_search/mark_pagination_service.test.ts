import { MarkPaginationService } from '../../../src/features/pill_identification_search/services/mark_pagination_service';
import { INITIAL_LOAD_COUNT } from '../../../src/features/pill_identification_search/constants/identification_pagination_constant';

describe('MarkPaginationService 단위 테스트', () => {
  let service: MarkPaginationService;

  beforeEach(() => {
    service = new MarkPaginationService();
  });

  test('배치 단위(120개)로 딱 떨어질 때 다음 데이터가 있을 가능성을 고려해 5페이지를 가산한다', () => {
    // 120개 / 24개 = 5페이지 + 5여유 = 10
    const total = service.calculateTotalPages(INITIAL_LOAD_COUNT);
    expect(total).toBe(10);
  });

  test('배치 단위로 떨어지지 않을 때는 올림 계산된 페이지만 반환한다', () => {
    // 48개 / 24개 = 2페이지
    const total1 = service.calculateTotalPages(48);
    expect(total1).toBe(2);

    // 25개 / 24개 = 2페이지
    const total2 = service.calculateTotalPages(25);
    expect(total2).toBe(2);
  });

  test('데이터가 0개일 때 0을 반환한다', () => {
    const total = service.calculateTotalPages(0);
    expect(total).toBe(0);
  });
});
