import { TConfigKey } from './config';

// 설정 테이블 스키마
export interface IConfig {
  key: TConfigKey;
  value: string | number;
}

// 알약 데이터 테이블 스키마
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
  X: string; // X 좌표
  Y: string; // Y 좌표
  distance?: number; // 사용자 위치 기반 계산된 거리 (m)
}

// 대마초 테이블 스키마
export interface ICannabis {
  chemicalNameKr: string; // 품명(국문)
  chemicalNameEn: string; // 품명(영문)
  synonyms: string; // 이명
  casNumber: string; // CAS No
  isomerCasNumber: string; // 이성질체 CAS No
  molecularFormula: string; // 분자식
  molecularWeight: string; // 분자량
}

// 마약 테이블 스키마
export interface INarcotics {
  chemicalNameKr: string; // 품명(국문)
  chemicalNameEn: string; // 품명(영문)
  synonyms: string; // 이명
  casNumber: string; // CAS No
  isomerCasNumber: string; // 이성질체 CAS No
  molecularFormula: string; // 분자식
  molecularWeight: string; // 분자량
}

// 향정신성 테이블 스키마
export interface IPsychotropics {
  chemicalNameKr: string; // 품명(국문)
  chemicalNameEn: string; // 품명(영문)
  synonyms: string; // 이명
  casNumber: string; // CAS No
  isomerCasNumber: string; // 이성질체 CAS No
  molecularFormula: string; // 분자식
  molecularWeight: string; // 분자량
}

// 도핑 금지 약물
export interface IProhibitedList {
  contents: string; // 내용
}

// 건강기능식품 영양성분 테이블 스키마
export interface IFunctionalFoodNutrients {
  foodCode: string; // 식품코드
  foodName: string; // 식품명
  foodMajorCategoryName: string; // 식품대분류명
  representativeFoodName: string; // 대표식품명
  foodMediumCategoryName: string; // 식품중분류명
  nutrientServingSize: string; // 영양성분제공단위량
  energy: string; // 에너지(kcal)
  moisture: string; // 수분(g)
  protein: string; // 단백질(g)
  fat: string; // 지방(g)
  ash: string; // 회분(g)
  carbohydrate: string; // 탄수화물(g)
  sugars: string; // 당류(g)
  dietaryFiber: string; // 식이섬유(g)
  calcium: string; // 칼슘(mg)
  iron: string; // 철(mg)
  phosphorus: string; // 인(mg)
  potassium: string; // 칼륨(mg)
  sodium: string; // 나트륨(mg)
  vitaminA: string; // 비타민 A(μg RAE)
  retinol: string; // 레티놀(μg)
  betaCarotene: string; // 베타카로틴(μg)
  thiamine: string; // 티아민(mg)
  riboflavin: string; // 리보플라빈(mg)
  niacin: string; // 니아신(mg)
  vitaminC: string; // 비타민 C(mg)
  vitaminD: string; // 비타민 D(μg)
  cholesterol: string; // 콜레스테롤(mg)
  saturatedFattyAcids: string; // 포화지방산(g)
  transFattyAcids: string; // 트랜스지방산(g)
  sourceName: string; // 출처명
  servingSize: string; // 1회분량
  servingWeightVolume: string; // 1회분량중량/부피
  dailyIntakeFrequency: string; // 1일섭취횟수
  intakeTarget: string; // 섭취대상
  foodWeightVolume: string; // 식품중량/부피
  itemReportNumber: string; // 품목제조신고번호
  manufacturerName: string; // 제조사명
  importerName: string; // 수입업체명
  distributorName: string; // 유통업체명
  originCountryName: string; // 원산지국명
  dataCreatedAt: string; // 데이터생성일자
  dataReferenceDate: string; // 데이터기준일자
}

// API를 통해 받아오는 원본 데이터 스키마 유니온 타입
export type TResourceDataSchemas =
  | IPillData
  | IMarkImages
  | INearbyPharmacies
  | ICannabis
  | INarcotics
  | IPsychotropics
  | IProhibitedList;
// | IFunctionalFoodNutrients; // UI 미구현으로 인해 DB 업데이트/동기화 대상에서 제외 (추후 UI 구현 시 주석 해제)

// 테이블 컬럼의 메타데이터 스키마 정의
export interface ITableColumnSchema {
  name: string;
  type: 'TEXT' | 'BLOB' | 'INTEGER' | 'DOUBLE';
  nullable: boolean;
  defaultValue: string | number | null;
  isPK: boolean;
}

// 저장된 알약 폴더 스키마
export interface ISavedPillFolder {
  id: number;
  name: string;
  is_default: boolean; // 1(true) 또는 0(false)
  created_at: string;
}

// 저장된 알약(다대다 매핑) 스키마
export interface ISavedPill {
  idx: number;
  folder_id: number;
  item_seq: string;
  item_name: string;
  created_at: string;
}
