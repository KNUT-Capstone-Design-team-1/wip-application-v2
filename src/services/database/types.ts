export type TConfigKey =
  | 'pillDataSchemaVersion'
  | 'pillDataDataVersion'
  | 'markImagesSchemaVersion'
  | 'markImagesDataVersion'
  | 'nearbyPharmaciesSchemaVersion'
  | 'nearbyPharmaciesDataVersion'
  | 'cannabisSchemaVersion'
  | 'cannabisDataVersion'
  | 'narcoticsSchemaVersion'
  | 'narcoticsDataVersion'
  | 'psychotropicsSchemaVersion'
  | 'psychotropicsDataVersion'
  | 'prohibitedListSchemaVersion'
  | 'prohibitedListDataVersion';

export type TDataTable =
  | 'pill_data'
  | 'mark_images'
  | 'nearby_pharmacies'
  | 'cannabis'
  | 'narcotics'
  | 'psychotropics'
  | 'prohibited_list';

// 동기화가 빠른 순서로 진행
export const ALL_DATA_TABLES: TDataTable[] = [
  'cannabis',
  'mark_images',
  'narcotics',
  'psychotropics',
  'nearby_pharmacies',
  'prohibited_list',
  'pill_data',
] as const;

export const TABLE_NAME_MAP: Record<TDataTable, string> = {
  pill_data: '알약 정보',
  mark_images: '알약 마크',
  nearby_pharmacies: '주변 약국',
  cannabis: '대마 정보',
  narcotics: '마약 정보',
  psychotropics: '향정신성 의약품 정보',
  prohibited_list: '금지 약물 정보',
} as const;

export type DATABSE_UPDATE_RESULT_CODE =
  | 'OK'
  | 'NO-UPDATED'
  | 'REQUIRE-UPDATE'
  | 'UNNECESSARY-UPDATE'
  | 'ERROR-CHECK-VERSION'
  | 'INVALID-SCHEMA'
  | 'ERROR-DROP-TABLE'
  | 'ERROR-CREATE-TABLE'
  | 'ERROR-INITIALIZE-TABLE'
  | 'ERROR-GET-RESOURCE'
  | 'ERROR-NO-RESOURCE-DATA'
  | 'ERROR-INSERT-TABLE'
  | 'ERROR-UPDATE-DATABASE-VERSION';

/**
 * 설정 테이블 스키마
 */
export interface IConfig {
  key: TConfigKey;
  value: string | number;
}

/**
 * 알약 데이터 테이블 스키마
 */
export interface IPillData {
  ITEM_SEQ: string; // 품목일련번호
  ITEM_NAME: string; // 품목명
  ENTP_NAME: string; // 업소명
  CHART: string; // 성상
  ITEM_IMAGE: string; // 큰제품이미지
  PRINT_FRONT: string; // 표시앞
  PRINT_BACK: string; // 표시뒤
  DRUG_SHAPE: string; // 의약품제형
  COLOR_CLASS1: string; // 색상앞
  COLOR_CLASS2: string; // 색상뒤
  LINE_FRONT: string; // 분할선앞
  LINE_BACK: string; // 분할선뒤
  LENGTH_LONG: string; // 크기장축
  LENGTH_SHORT: string; // 크기단축
  LENGTH_THICK: string; // 크기두께
  CLASS_NO: string; // 분류번호
  CLASS_NAME: string; // 분류명
  ETC_OTC_CODE: string; // 전문일반구분
  ITEM_PERMIT_DATE: string; // 품목허가일자
  FORM_CODE: string; // 제형코드명
  DRUG_SHAPE_FRONT: string; // 표기내용앞
  DRUG_SHAPE_BACK: string; // 표기내용뒤
  MARK_IMAGE_FRONT: string; // 표기이미지앞
  MARK_IMAGE_BACK: string; // 표기이미지뒤
  MARK_CODE_FRONT: string; // 표기코드앞
  MARK_CODE_BACK: string; // 표기코드뒤
  CHANGE_DATE: string; // 변경일자
  ITEM_ENG_NAME: string; // 품목영문명
  COVERAGE_ENG_NAME: string; // 보험코드
  ENTP_ENG_NAME: string; // 업체 영문명
  MATERIAL_NAME: string; // 원료성분
  MATERIAL_ENG_NAME: string; // 영문성분명
  STORAGE_METHOD: string; // 저장방법
  VALID_TERM: string; // 유효기간
  PACK_UNIT: string; // 포장단위
  INSURANCE_CODE: string; // 보험코드
  DRUG_CLASS: string; // 마약류분류
  FINISH_MATERIAL_YN: string; // 완제원료구분
  NEW_DRUG_YN: string; // 신약여부
  INDUTY_CODE: string; // 업종구분
  CHANGE_CONTENT: string; // 변경내용
  TOTAL_CONTENT: string; // 총량
  MAIN_ITEM_INGR: string; // 주성분명
  INGR_NAME: string; // 첨가제명
  RARE_DRUG_YN: string; // 희귀의약품여부
  OEM_ENTP_NAME: string; // 위탁제조업체
}

/**
 * 마크 이미지 테이블 스키마
 */
export interface IMarkImages {
  code: string;
  title: string;
  base64: string;
}

/**
 * 주변 약국 테이블 스키마
 */
export interface INearbyPharmacies {
  id: string; // 암호화요양기호
  name: string; // 요양기관명
  states: string; // 시도코드명
  region: string; // 시군구코드명
  district: string; // 읍면동
  postalCode: string; // 우편번호
  address: string; // 주소
  telephone: string; // 전화번호
  openData: number; // 개설일자
  X: string; // X 좌표
  Y: string; // Y 좌표
}

/**
 * 대마초 테이블 스키마
 */
export interface ICannabis {
  chemicalNameKr: string; // 품명(국문)
  chemicalNameEn: string; // 품명(영문)
  synonyms: string; // 이명
  casNumber: string; // CAS No
  isomerCasNumber: string; // 이성질체 CAS No
  molecularFormula: string; // 분자식
  molecularWeight: string; // 분자량
}

/**
 * 마약 테이블 스키마
 */
export interface INarcotics {
  chemicalNameKr: string; // 품명(국문)
  chemicalNameEn: string; // 품명(영문)
  synonyms: string; // 이명
  casNumber: string; // CAS No
  isomerCasNumber: string; // 이성질체 CAS No
  molecularFormula: string; // 분자식
  molecularWeight: string; // 분자량
}

/**
 * 향정신성 테이블 스키마
 */
export interface IPsychotropics {
  chemicalNameKr: string; // 품명(국문)
  chemicalNameEn: string; // 품명(영문)
  synonyms: string; // 이명
  casNumber: string; // CAS No
  isomerCasNumber: string; // 이성질체 CAS No
  molecularFormula: string; // 분자식
  molecularWeight: string; // 분자량
}

/**
 * 도핑 금지 약물
 */
export interface IProhibitedList {
  contents: string; // 내용
}

export type TResourceDataSchemas =
  | IPillData
  | IMarkImages
  | INearbyPharmacies
  | ICannabis
  | INarcotics
  | IPsychotropics
  | IProhibitedList;

export interface ITableColumnSchema {
  name: string;
  type: 'TEXT' | 'BLOB' | 'INTEGER' | 'DOUBLE';
  nullable: boolean;
  defaultValue: string | number | null;
  isPK: boolean;
}

export interface IWhereQueryClause {
  query: string;
  values: (str: any) => (string | number)[];
  weight?: {
    query: string;
    values: (str: any) => (string | number)[];
  };
}

export type TWhereQueryClauseFunc = (
  param: Record<string, any>,
) => Record<string, IWhereQueryClause>;

export type TQuerySearchParamResult<T> = Partial<
  Record<keyof T, IWhereQueryClause>
>;

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

export type TMarkImagesSearchParam = Omit<IMarkImages, 'base64'>;

export type TNearbyPharmaciesSearchParam = Omit<
  INearbyPharmacies,
  'postalCode' | 'telephone' | 'openData' | 'x' | 'y'
> & {
  coordinate: { x: number; y: number };
};

export type TCannabisSearchParam = Pick<
  ICannabis,
  'chemicalNameKr' | 'chemicalNameEn'
> & {
  containedInKr?: string;
  containedInEn?: string;
};

export type TNarcoticsSearchParam = Pick<
  INarcotics,
  'chemicalNameKr' | 'chemicalNameEn'
> & {
  containedInKr?: string;
  containedInEn?: string;
};

export type TPsychotropicsSearchParam = Pick<
  IPsychotropics,
  'chemicalNameKr' | 'chemicalNameEn'
> & {
  containedInKr?: string;
  containedInEn?: string;
};

export type TProhibitedListSearchParam = Pick<IProhibitedList, 'contents'>;
