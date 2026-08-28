import {
  ICannabis,
  IMarkImages,
  INarcotics,
  INearbyPharmacies,
  IPillData,
  IProhibitedList,
  IPsychotropics,
} from './schemas';

// SQL WHERE 절 생성을 위한 조건절 스키마
export interface IWhereQueryClause {
  query: string;
  values: (str: any) => (string | number)[];
  weight?: {
    query: string;
    values: (str: any) => (string | number)[];
  };
}

// 파라미터를 받아 WHERE 쿼리 절 객체를 생성하는 함수 타입
export type TWhereQueryClauseFunc = (
  param: Record<string, any>,
) => Record<string, IWhereQueryClause>;

// 타입 T의 필드에 대응하는 조건절을 가진 검색 결과 객체 타입
export type TQuerySearchParamResult<T> = Partial<
  Record<keyof T, IWhereQueryClause>
>;

// 알약 데이터 검색을 위한 파라미터 타입
export type TPillDataSearchParam = Omit<
  IPillData,
  | 'DRUG_SHAPE'
  | 'COLOR_CLASS1'
  | 'COLOR_CLASS2'
  | 'LINE_FRONT'
  | 'LINE_BACK'
  | 'FORM_CODE'
> & {
  DRUG_SHAPE: string[] | null;
  COLOR_CLASS1: string[] | null;
  COLOR_CLASS2: string[] | null;
  LINE_FRONT: string[] | null;
  LINE_BACK: string[] | null;
  FORM_CODE: string[] | null;
  PRINT_FRONT_EXACTLY: string; // 표시앞 일치
  PRINT_BACK_EXACTLY: string; // 표시뒤 일치
  KEYWORD?: string; // 통합 검색어
};

// 마크 이미지 검색을 위한 파라미터 타입
export type TMarkImagesSearchParam = Omit<IMarkImages, 'base64'>;

// 주변 약국 검색을 위한 파라미터 타입
export type TNearbyPharmaciesSearchParam = Omit<
  INearbyPharmacies,
  'postalCode' | 'telephone' | 'openData' | 'x' | 'y'
> & {
  coordinate: { x: number; y: number };
};

// 대마초 데이터 검색을 위한 파라미터 타입
export type TCannabisSearchParam = Pick<
  ICannabis,
  'chemicalNameKr' | 'chemicalNameEn'
> & {
  containedInKr?: string;
  containedInEn?: string;
};

// 마약 데이터 검색을 위한 파라미터 타입
export type TNarcoticsSearchParam = Pick<
  INarcotics,
  'chemicalNameKr' | 'chemicalNameEn'
> & {
  containedInKr?: string;
  containedInEn?: string;
};

// 향정신성 데이터 검색을 위한 파라미터 타입
export type TPsychotropicsSearchParam = Pick<
  IPsychotropics,
  'chemicalNameKr' | 'chemicalNameEn'
> & {
  containedInKr?: string;
  containedInEn?: string;
};

// 병용 금기 데이터 검색을 위한 파라미터 타입
export type TProhibitedListSearchParam = Pick<IProhibitedList, 'contents'>;
