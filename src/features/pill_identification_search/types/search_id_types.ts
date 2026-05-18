export interface ISearchPillData {
  PRINT_FRONT: string;
  PRINT_BACK: string;
  ITEM_NAME: string;
  ENTP_NAME: string;
  DRUG_SHAPE: string[] | null;
  FORM_CODE: string[] | null;
  COLOR_CLASS1: string[] | null;
  COLOR_CLASS2: string[] | null;
  LINE_FRONT: string[] | null;
  LINE_BACK: string[] | null;
  MARK_CODE_FRONT: string;
  MARK_CODE_BACK: string;
  isExactMatch: boolean;
}

export interface ISearchIdState {
  sideLabelFrontText: string;
  sideLabelBackText: string;
  productNameText: string;
  companyName: string;
  manufacturerName: string[] | null;
  dividerLineData: string[] | null;
  shape: string[] | null;
  colors: string[] | null;
  markCodeFront: string;
  markCodeBack: string;
  isExactMatch: boolean;
}

export interface ISearchIdActions {
  setSideLabelFrontText: (value: string) => void;
  setSideLabelBackText: (value: string) => void;
  setProductNameText: (value: string) => void;
  setCompanyName: (value: string) => void;
  setManufacturerName: (arr: string[] | null) => void;
  setDividerLineData: (arr: string[] | null) => void;
  setShape: (arr: string[] | null) => void;
  setColors: (arr: string[] | null) => void;
  setMarkCodeFront: (value: string) => void;
  setMarkCodeBack: (value: string) => void;
  setIsExactMatch: (value: boolean) => void;
  resetSelectedSearchId: () => void;
  getSelectedSearchId: () => ISearchPillData;
}

export interface ISearchIdStore extends ISearchIdState, ISearchIdActions {}

export interface IIdentificationSectionData {
  key?: string;
  placeholder?: string;
  width?: string | number;
  parsingDataName?: string;
  iconUrl?: any;
  iconColor?: string;
  label?: string;
  value?: string | null;
}

export interface IIdentificationSection {
  type: 'textInput' | 'iconButton' | 'other';
  title: string;
  datas?: IIdentificationSectionData[];
}

export interface IIdentificationSearchData {
  [key: string]: IIdentificationSection;
}
