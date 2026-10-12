import { IFunctionalFoodNutrients } from '@services/database/types';

// 카테고리 필터 칩
export interface ICategoryChip {
  label: string; // 화면에 표시할 라벨
  value: string; // foodMediumCategoryName LIKE 검색어 ('' = 전체)
}

// 상세 화면 영양성분 표의 각 행 정의
export interface INutrientField {
  key: keyof IFunctionalFoodNutrients; // 데이터 키
  label: string; // 성분명
  unit: string; // 단위
}
