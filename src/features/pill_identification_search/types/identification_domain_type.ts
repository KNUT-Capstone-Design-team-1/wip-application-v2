import { IPillData } from '@services/database/types';

// 식별 검색 폼에서 입력된 원본 검색 조건 모델
export interface ISearchPillData {
  // 전면 식별문자
  PRINT_FRONT: string;

  // 후면 식별문자
  PRINT_BACK: string;

  // 의약품명
  ITEM_NAME: string;

  // 제약업체명
  ENTP_NAME: string;

  // 제형 모양 (원형, 타원형 등)
  DRUG_SHAPE: string[] | null;

  // 제형 구분 코드 (정제, 경질캡슐 등)
  FORM_CODE: string[] | null;

  // 색상 1
  COLOR_CLASS1: string[] | null;

  // 색상 2
  COLOR_CLASS2: string[] | null;

  // 전면 분할선
  LINE_FRONT: string[] | null;

  // 후면 분할선
  LINE_BACK: string[] | null;

  // 전면 식별마크 코드
  MARK_CODE_FRONT: string;

  // 후면 식별마크 코드
  MARK_CODE_BACK: string;

  // 식별문자 완전 일치 여부
  isExactMatch: boolean;
}

// 식별 검색 결과 알약 데이터 모델
export type IPillSearchResultItem = IPillData;

// 식별 검색 쿼리 옵션 모델
export interface IPillSearchQueryOption {
  // 페이지 번호 (1부터 시작)
  page: number;

  // 페이지당 건수
  limit: number;
}
