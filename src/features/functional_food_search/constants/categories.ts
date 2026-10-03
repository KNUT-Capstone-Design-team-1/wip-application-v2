import { ICategoryChip } from '../types';

/**
 * 카테고리 필터 칩 목록
 * value는 foodMediumCategoryName 에 대한 LIKE 검색어로 사용된다 ('' = 전체)
 * 실제 데이터(중분류) 분포를 기준으로 대표적인 항목을 선별
 */
export const CATEGORY_CHIPS: ICategoryChip[] = [
  { label: '전체', value: '' },
  { label: '비타민', value: '비타민' },
  { label: '프로바이오틱스', value: '프로바이오틱스' },
  { label: '복합', value: '복합' },
  { label: '단백질', value: '단백질' },
  { label: '홍삼', value: '홍삼' },
  { label: '마그네슘', value: '마그네슘' },
  { label: '칼슘', value: '칼슘' },
  { label: '프로폴리스', value: '프로폴리스' },
  { label: '코엔자임', value: '코엔자임' },
  { label: '아연', value: '아연' },
];

// 한 번에 불러올 검색 결과 개수
export const PAGE_LIMIT = 30;
