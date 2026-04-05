export interface IPaginationProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
  currentGroup: number;
  setCurrentGroup: (group: number) => void;
}

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
}

export interface ISearchIdValue {
  sideLabelFrontText: string;
  sideLabelBackText: string;
  productNameText: string;
  companyName: string;
  manufacturerName: string[] | null;
  dividerLineData: string[] | null;
  shape: string[] | null;
  frontColor: string[] | null;
  backColor: string[] | null;
  markCodeFront: string;
  markCodeBack: string;
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
  setMarkCodeFront: (value: string) => void;
  setMarkCodeBack: (value: string) => void;
  resetSelectedSearchId: () => void;
  getSelectedSearchId: () => any;
}
