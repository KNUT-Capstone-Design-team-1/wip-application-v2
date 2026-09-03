import {
  INITIAL_LOAD_COUNT,
  ITEMS_PER_PAGE,
} from '@features/pill_identification_search/constants/identification_pagination_constant';

// 식별 마크 페이징 계산 비즈니스 서비스 인터페이스
export interface IMarkPaginationService {
  calculateTotalPages(loadedCount: number): number;
}

// 식별 마크 페이징 계산 비즈니스 서비스 구현체
export class MarkPaginationService implements IMarkPaginationService {
  // 현재 로드된 마크 수에 기반하여 총 페이지 수 계산
  calculateTotalPages(loadedCount: number): number {
    const loadedPages = Math.ceil(loadedCount / ITEMS_PER_PAGE);

    // 데이터가 INITIAL_LOAD_COUNT 단위로 딱 떨어지면 추가 데이터가 더 있을 수 있으므로 여유 페이지 추가
    const isExactBatch =
      loadedCount > 0 && loadedCount % INITIAL_LOAD_COUNT === 0;

    if (isExactBatch) {
      return loadedPages + 5;
    }

    return loadedPages;
  }
}

// 식별 마크 페이징 서비스 싱글톤 인스턴스
export const markPaginationService = new MarkPaginationService();
