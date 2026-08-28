// 환경설정 테이블의 키 타입
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

// 데이터베이스 내 존재하는 테이블 이름 타입
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

// 테이블명에 대한 한국어 라벨 매핑
export const TABLE_NAME_MAP: Record<TDataTable, string> = {
  pill_data: '알약 정보',
  mark_images: '알약 마크',
  nearby_pharmacies: '주변 약국',
  cannabis: '대마 정보',
  narcotics: '마약 정보',
  psychotropics: '향정신성 의약품 정보',
  prohibited_list: '금지 약물 정보',
} as const;

// 테이블명과 해당 테이블의 스키마/데이터 버전 설정 키 매핑
export const TABLE_CONFIG_KEYS_MAP: Record<TDataTable, TConfigKey[]> = {
  pill_data: ['pillDataSchemaVersion', 'pillDataDataVersion'],
  mark_images: ['markImagesSchemaVersion', 'markImagesDataVersion'],
  nearby_pharmacies: [
    'nearbyPharmaciesSchemaVersion',
    'nearbyPharmaciesDataVersion',
  ],
  cannabis: ['cannabisSchemaVersion', 'cannabisDataVersion'],
  narcotics: ['narcoticsSchemaVersion', 'narcoticsDataVersion'],
  psychotropics: ['psychotropicsSchemaVersion', 'psychotropicsDataVersion'],
  prohibited_list: ['prohibitedListSchemaVersion', 'prohibitedListDataVersion'],
} as const;

// 데이터베이스 업데이트 및 초기화 결과 코드
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
