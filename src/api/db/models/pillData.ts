import { Realm } from '@realm/react'

export type TPillData = {
  ITEM_SEQ: string // 품목 일련 번호
  ITEM_NAME: string // 품목명
  ENTP_SEQ: string // 업체 일련 번호
  ENTP_NAME: string // 업체명
  ITEM_IMAGE?: string // 큰 제품 이미지
  PRINT_FRONT?: string // 글자 앞
  PRINT_BACK?: string // 글자 뒤
  DRUG_SHAPE?: string // 모양
  COLOR_CLASS1?: string // 색깔 (앞)
  COLOR_CLASS2?: string // 색깔 뒤
  LINE_FRONT?: string // 분할선 (앞)
  LINE_BACK?: string // 분할선 (뒤)
  IMG_REGIST_TS?: string // 약학 정보원 이미지 생성일
  CLASS_NAME?: string // 분류명
  ETC_OTC_CODE?: string // 전문/일반
  ITEM_PERMIT_DATE?: string // 품목 허가 일자
  // Finished Medicine Permission Detail Schema
  CHART?: string // 성상
  BAR_CODE?: string // 표준코드
  MATERIAL_NAME?: string // 원료성분
  VALID_TERM?: string // 유효기간
  STORAGE_METHOD?: string // 저장방법
  PACK_UNIT?: string // 포장단위
  MAIN_ITEM_INGR?: string // 주성분명
  INGR_NAME?: string // 첨가제명
  VECTOR?: number[] // PRINT_FRONT_BACK 유니코드 벡터
  SIMILARITY?: number
}

export class PillData extends Realm.Object<PillData> {
  ITEM_SEQ!: string // 품목 일련 번호
  ITEM_NAME!: string // 품목명
  ENTP_SEQ!: string // 업체 일련 번호
  ENTP_NAME!: string // 업체명
  ITEM_IMAGE?: string // 큰 제품 이미지
  PRINT_FRONT?: string // 글자 앞
  PRINT_BACK?: string // 글자 뒤
  DRUG_SHAPE?: string // 모양
  COLOR_CLASS1?: string // 색깔 (앞)
  COLOR_CLASS2?: string // 색깔 뒤
  LINE_FRONT?: string // 분할선 (앞)
  LINE_BACK?: string // 분할선 (뒤)
  IMG_REGIST_TS?: string // 약학 정보원 이미지 생성일
  CLASS_NAME?: string // 분류명
  ETC_OTC_CODE?: string // 전문/일반
  ITEM_PERMIT_DATE?: string // 품목 허가 일자
  // Finished Medicine Permission Detail Schema
  CHART?: string // 성상
  BAR_CODE?: string // 표준코드
  MATERIAL_NAME?: string // 원료성분
  VALID_TERM?: string // 유효기간
  STORAGE_METHOD?: string // 저장방법
  PACK_UNIT?: string // 포장단위
  MAIN_ITEM_INGR?: string // 주성분명
  INGR_NAME?: string // 첨가제명
  VECTOR?: number[] // PRINT_FRONT_BACK 유니코드 벡터

  static schema: Realm.ObjectSchema = {
    name: 'PillData',
    properties: {
      ITEM_SEQ: 'string', // 품목 일련 번호
      ITEM_NAME: 'string', // 품목명
      ENTP_SEQ: 'string', // 업체 일련 번호
      ENTP_NAME: 'string', // 업체명
      ITEM_IMAGE: 'string?', // 큰 제품 이미지
      PRINT_FRONT: 'string?', // 글자 앞
      PRINT_BACK: 'string?', // 글자 뒤
      DRUG_SHAPE: 'string?', // 모양
      COLOR_CLASS1: 'string?', // 색깔 (앞)
      COLOR_CLASS2: 'string?', // 색깔 뒤
      LINE_FRONT: 'string?', // 분할선 (앞)
      LINE_BACK: 'string?', // 분할선 (뒤)
      IMG_REGIST_TS: 'string?', // 약학 정보원 이미지 생성일
      CLASS_NAME: 'string?', // 분류명
      ETC_OTC_CODE: 'string?', // 전문/일반
      ITEM_PERMIT_DATE: 'string?', // 품목 허가 일자
      // Finished Medicine Permission Detail Schema
      CHART: 'string?', // 성상
      BAR_CODE: 'string?', // 표준코드
      MATERIAL_NAME: 'string?', // 원료성분
      VALID_TERM: 'string?', // 유효기간
      STORAGE_METHOD: 'string?', // 저장방법
      PACK_UNIT: 'string?', // 포장단위
      MAIN_ITEM_INGR: 'string?', // 주성분명
      INGR_NAME: 'string?', // 첨가제명
      VECTOR: {
        type: 'list',
        objectType: 'int',
        optional: true
      }
    },
    primaryKey: 'ITEM_SEQ',
  }
}