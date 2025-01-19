import { Realm } from '@realm/react'

interface infoData extends Realm.Dictionary {
  EE?: string[],
  UD?: string[],
  NB?: string[]
}

export class PillBox extends Realm.Object<PillBox> {
  ITEM_SEQ!: string // 품목 일련 번호
  ITEM_NAME!: string // 품목명
  ENTP_SEQ!: string // 업체 일련 번호
  ENTP_NAME!: string // 업체명
  ITEM_IMAGE?: string // 큰 제품 이미지
  MAIN_ITEM_INGR?: string // 주성분명
  CHART?: string // 성상
  PACK_UNIT?: string // 포장 단위
  STORAGE_METHOD?: string // 저장 방법
  VALID_TERM?: string // 유효 기간
  MATERIAL_NAME?: string // 원료 성분
  INGR_NAME?: string // 첨가제명
  DRUG_SHAPE?: string // 모양
  CLASS_NAME?: string // 분류명
  infoData?: infoData // 효능/효과, 용법/용량, 사용상 주의사항

  static schema: Realm.ObjectSchema = {
    name: 'PillBox',
    properties: {
      ITEM_SEQ: 'string', // 품목 일련 번호
      ITEM_NAME: 'string', // 품목명
      ENTP_SEQ: 'string', // 업체 일련 번호
      ENTP_NAME: 'string', // 업체명
      ITEM_IMAGE: 'string?', // 큰 제품 이미지
      MAIN_ITEM_INGR: 'string?', // 주성분명
      CHART: 'string?', // 성상
      PACK_UNIT: 'string?', // 포장 단위
      STORAGE_METHOD: 'string?', // 저장 방법
      VALID_TERM: 'string?', // 유효 기간
      MATERIAL_NAME: 'string?', // 원료 성분
      INGR_NAME: 'string?', // 첨가제명
      DRUG_SHAPE: 'string?', // 모양
      CLASS_NAME: 'string?', // 분류명
      infoData: {
        type: 'dictionary',
        objectType: 'mixed',
        optional: true,
      },
    },
    primaryKey: 'ITEM_SEQ',
  }
}