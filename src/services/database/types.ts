export type TConfigKey =
  | 'pillDataSchemaVersion'
  | 'pillDataDataVersion'
  | 'markImagesSchemaVersion'
  | 'markImagesDataVersion'
  | 'nearbyPharmaciesSchemaVersion'
  | 'nearbyPharmaciesDataVersion';

export type TDataTable = 'pill_data' | 'mark_images' | 'nearby_pharmacies';

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
  | 'ERROR-INSERT-TABLE';

// 알약 데이터 테이블 스키마
export interface IPillData {
  ITEM_SEQ: string; // 품목일련번호
  ITEM_NAME: string; // 품목명
  ENTP_NAME: string; // 업체명
  ENTP_SEQ: string; // 업소일련번호
  ITEM_PERMIT_DATE: string; // 허가일자
  ETC_OTC_CODE: string; // 전문일반
  CHART: string; // 성상
  BAR_CODE: string; // 표준코드
  MATERIAL_NAME: string; // 원료성분
  VALID_TERM: string; // 유효기간
  STORAGE_METHOD: string; // 저장방법
  PACK_UNIT: string; // 포장단위
  MAIN_ITEM_INGR: string; // 주성분명
  INGR_NAME: string; // 첨가제명
  ITEM_IMAGE: string; // 큰제품이미지
  PRINT_FRONT: string; // 표시앞
  PRINT_BACK: string; // 표시뒤
  DRUG_SHAPE: string; // 의약품제형
  COLOR_CLASS1: string; // 색상앞
  COLOR_CLASS2: string; // 색상뒤
  LINE_FRONT: string; // 분할선앞
  LINE_BACK: string; // 분할선뒤
  IMG_REGIST_TS: string; // 이미지생성일자(약학정보원)
  CLASS_NAME: string; // 분류명
  MARK_CODE_FRONT: string; // 표기코드앞
  MARK_CODE_BACK: string; // 표기코드뒤
  FORM_CODE: string; // 제형코드명
}

// 마크 이미지 테이블 스키마
export interface IMarkImages {
  code: string;
  title: string;
  base64: string;
}

// 주변 약국 테이블 스키마
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
  x: string; // X 좌표
  y: string; // Y 좌표
}

export type TResourceDataSchemas = IPillData | IMarkImages | INearbyPharmacies;

// config 테이블 스키마
export interface IConfig {
  key: TConfigKey;
  value: string | number;
}

export interface ITableColumnSchema {
  name: string;
  type: 'TEXT' | 'BLOB' | 'INTEGER' | 'DOUBLE';
  size: number; // byte
  nullable: boolean;
  defaultValue: string | number | null;
  isPK: boolean;
}

export interface IWhereQueryClause {
  query: string;
  values: (str: any) => (string | number)[];
}

export type TWhereQueryClauseFunc = (
  param: Record<string, any>,
) => Record<string, IWhereQueryClause>;

export interface IPillDataSearchParam extends Omit<
  IPillData,
  | 'DRUG_SHAPE'
  | 'COLOR_CLASS1'
  | 'COLOR_CLASS2'
  | 'LINE_FRONT'
  | 'LINE_BACK'
  | 'FORM_CODE'
> {
  DRUG_SHAPE: string[];
  COLOR_CLASS1: string[];
  COLOR_CLASS2: string[];
  LINE_FRONT: string[];
  LINE_BACK: string[];
  FORM_CODE: string[];
  PRINT_FRONT_EXACTLY: string; // 표시앞 일치
  PRINT_BACK_EXACTLY: string; // 표시뒤 일치
}

export type TQuerySearchParamResult<T> = Record<keyof T, IWhereQueryClause>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IMarkImagesSearchParam extends Omit<IMarkImages, 'base64'> {}

export interface INearbyPharmaciesSearchParam extends Omit<
  INearbyPharmacies,
  'postalCode' | 'telephone' | 'openData' | 'x' | 'y'
> {
  coordinate: { x: number; y: number };
}
