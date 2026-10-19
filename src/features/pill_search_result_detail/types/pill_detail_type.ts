import type { createPillDetailStore } from '../store/pill_detail_store';

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
  INSURANCE_CODE?: string;
  COVERAGE_ENG_NAME?: string;
  ITEM_PERMIT_DATE?: string;
  ENTP_ENG_NAME?: string;
  OEM_ENTP_NAME?: string;
  CHANGE_DATE?: string;
  CHANGE_CONTENT?: string;
  DRUG_CLASS?: string;
  NEW_DRUG_YN?: string;
  RARE_DRUG_YN?: string;
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
  prohibitedNotes?: string[];
  isDrivingWarning?: boolean;
  drivingWarningKeywords?: string[];
}

export interface PillDetailRoute {
  itemSeq?: string;
  image?: string;
}

export interface PillDetailState extends PillDetailRoute {
  pillData: IPillDetail | null;
  loading: boolean;
  detailLoading: boolean;
  savedFolderIds: number[];
  isFolderModalVisible: boolean;
  hasSaved: boolean;
  setPillData: (pillData: IPillDetail | null) => void;
  setLoading: (loading: boolean) => void;
  setDetailLoading: (detailLoading: boolean) => void;
  setSavedFolderIds: (savedFolderIds: number[]) => void;
  setFolderModalVisible: (isFolderModalVisible: boolean) => void;
  setHasSaved: (hasSaved: boolean) => void;
}

export type PillDetailStore = ReturnType<typeof createPillDetailStore>;

export interface PillDetailLoadService {
  getBasicDetail: (itemSeq: string) => Promise<IPillDetail | null>;
  getRemoteDetail: (itemSeq: string) => Promise<Partial<IPillDetail> | null>;
}

export interface PillSpecField {
  id: string;
  label: string;
  text: string;
}
