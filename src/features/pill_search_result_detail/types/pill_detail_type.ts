export interface IPillDetail {
  ITEM_SEQ: string;
  ITEM_NAME: string;
  ENTP_NAME: string;
  ITEM_IMAGE?: string;
  CHART?: string;
  MAIN_ITEM_INGR?: string;
  CLASS_NAME?: string;
  DRUG_SHAPE?: string;
  FORM_CODE?: string;
  PRINT_FRONT?: string;
  PRINT_BACK?: string;
  PACK_UNIT?: string;
  VALID_TERM?: string;
  ITEM_ENG_NAME?: string;
  ETC_OTC_CODE?: string;
  CLASS_NO?: string;
  COLOR_CLASS1?: string;
  COLOR_CLASS2?: string;
  LINE_FRONT?: string;
  LINE_BACK?: string;
  LENGTH_LONG?: string;
  LENGTH_SHORT?: string;
  LENGTH_THICK?: string;
  MATERIAL_NAME?: string;
  MATERIAL_ENG_NAME?: string;
  INGR_NAME?: string;
  TOTAL_CONTENT?: string;
  STORAGE_METHOD?: string;
  BAR_CODE?: string;
  INSURANCE_CODE?: string;
  COVERAGE_ENG_NAME?: string;
  ITEM_PERMIT_DATE?: string;
  APPROVAL_TYPE?: string;
  ENTP_ENG_NAME?: string;
  ENTP_PERMIT_NO?: string;
  ENTP_BIZ_NO?: string;
  BUSINESS_LICENCE_NUMBER?: string;
  OEM_ENTP_NAME?: string;
  CANCEL_STATUS?: string;
  CANCEL_DATE?: string;
  CHANGE_DATE?: string;
  CHANGE_CONTENT?: string;
  REEXAM_TARGET_YN?: string;
  REEXAM_CONT?: string;
  DRUG_CLASS?: string;
  NEW_DRUG_YN?: string;
  RARE_DRUG_YN?: string;
  ATC_CODE?: string;
  EE_DOC_DATA?: string;
  UD_DOC_DATA?: string;
  NB_DOC_DATA?: string;
  isNarcotic?: boolean;
  narcoticIngredients?: string[];
  isCannabis?: boolean;
  cannabisIngredients?: string[];
  isPsychotropic?: boolean;
  psychotropicIngredients?: string[];
  isProhibited?: boolean;
  prohibitedIngredients?: string[];
  isDrivingWarning?: boolean;
}

export interface IPillDetailInfoProps {
  data: IPillDetail;
  saveState: boolean;
  onSaveToggle: () => void;
}

export interface IDetailSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  content?: string;
}
