export interface ISearchPillData {
  PRINT_FRONT: string;
  PRINT_BACK: string;
  ITEM_NAME: string;
  ENTP_NAME: string;
  DRUG_SHAPE: string[];
  FORM_CODE: string[];
  COLOR_CLASS1: string[];
  COLOR_CLASS2: string[];
  LINE_FRONT: string[];
  LINE_BACK: string[];
  MARK_CODE_FRONT: string;
  MARK_CODE_BACK: string;
}

export interface ISearchIdValue {
  sideLabelFrontText: string;
  sideLabelBackText: string;
  productNameText: string;
  companyName: string;
  manufacturerName: string[];
  dividerLineData: string[];
  shape: string[];
  frontColor: string[];
  backColor: string[];
}

export interface ISearchIdStore extends ISearchIdValue{
  setSideLabelFrontText: (value: string) => void;
  setSideLabelBackText: (value: string) => void;
  setProductNameText: (value: string) => void;
  setCompanyName: (value: string) => void;
  setManufacturerName: (value: string[]) => void;
  setDividerLineData: (value: string[]) => void;
  setShape: (value: string[]) => void;
  setFrontColor: (value: string[]) => void;
  setBackColor: (value: string[]) => void;
  resetSelectedSearchId: () => void;
  getSelectedSearchId: () => any;
}
