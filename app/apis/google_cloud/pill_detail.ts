import axios from 'axios';
import { getToken } from './google_cloud_token';

type TDrugPermissionDetailData = {
  ITEM_SEQ: string; // 품목기준코드
  ITEM_NAME: string; // 품목명
  ENTP_NAME: string; // 업체명
  ITEM_PERMIT_DATE: string; // 허가일자
  CNSGN_MANUF: string; // 위탁제조업체
  ETC_OTC_CODE: string; // 전문일반
  CHART: string; // 성상
  BAR_CODE: string; // 표준코드
  MATERIAL_NAME: string; // 원료성분
  EE_DOC_ID: string; // 효능효과
  UD_DOC_ID: string; // 용법용량
  NB_DOC_ID: string; // 주의사항
  INSERT_FILE: string; // 첨부문서
  STORAGE_METHOD: string; // 저장방법
  VALID_TERM: string; // 유효기간
  REEXAM_TARGET: string; // 재심사대상
  REEXAM_DATE: string; // 재심사기간
  PACK_UNIT: string; // 포장단위
  EDI_CODE: string; // 보험코드
  DOC_TEXT: string; // 제조방법
  PERMIT_KIND_NAME: string; // 허가/신고구분
  ENTP_NO: string; // 업체허가번호
  MAKE_MATERIAL_FLAG: string; // 완제/원료구분
  NEWDRUG_CLASS_NAME: string; // 신약
  INDUTY_TYPE: string; // 업종구분
  CANCEL_DATE: string; // 취소일자
  CANCEL_NAME: string; // 상태
  CHANGE_DATE: string; // 변경일자
  NARCOTIC_KIND_CODE: string; // 마약종류코드
  GBN_NAME: string; // 변경이력
  TOTAL_CONTENT: string; // 총량
  EE_DOC_DATA: string; // 효능효과 문서 데이터
  UD_DOC_DATA: string; // 용법용량 문서 데이터
  NB_DOC_DATA: string; // 주의사항(일반) 문서 데이터
  PN_DOC_DATA: string; // 주의사항(전문) 문서 데이터
  MAIN_ITEM_INGR: string; // 유효성분
  INGR_NAME: string; // 첨가제
  ATC_CODE: string; // ATC코드
  ITEM_ENG_NAME: string; // 품목영문명
  ENTP_ENG_NAME: string; // 업체영문명
  MAIN_INGR_NAME: string; // 주성분영문명
  BOZRNO: string; // 사업자등록번호
};

/**
 * 알약 상세정보 조회
 * @param itemSeq 알약 ID
 * @returns
 */
export const requestGetPillDetail = async (itemSeq: string) => {
  const serviceURL = process.env
    .EXPO_PUBLIC_GOOGLE_CLOUD_DRUG_DETAIL_URL as string;

  const token = getToken();

  const result = await axios.get<TDrugPermissionDetailData>(serviceURL, {
    params: { ITEM_SEQ: itemSeq },
    headers: { Authorization: `Bearer ${token}` },
  });

  return result.data;
};
