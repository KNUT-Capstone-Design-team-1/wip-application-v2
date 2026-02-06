import { create } from 'zustand';

interface ISearchIdValue {
  sideLabelFrontText: string,
  sideLabelBackText: string,
  productNameText: string,
  companyName: string,
  manufactureName: string[],
  dividerLineData: string[],
  shape: string[],
  frontColor: string[],
  backColor: string[],
}

interface ISearchIdStore extends ISearchIdValue{
  setSideLabelFrontText: (value: string) => void;
  setSideLabelBackText: (value: string) => void;
  setProductNameText: (value: string) => void;
  setCompanyName: (value: string) => void;
  setManufactureName: (value: string[]) => void;
  setDividerLineData: (value: string[]) => void;
  setShape: (value: string[]) => void;
  setFrontColor: (value: string[]) => void;
  setBackColor: (value: string[]) => void;
  resetSelectedSearchId: () => void;
  getSelectedSearchId: () => any;
}

export const useSearchIdStore = create<ISearchIdStore>((set, get) => ({
  sideLabelFrontText: '',
  sideLabelBackText: '',
  productNameText: '',

  companyName: '',
  manufactureName: [],
  dividerLineData: [],
  shape: [],
  frontColor: [],
  backColor: [],
  setSideLabelFrontText: (value) =>
    set({
      sideLabelFrontText: value,
    }),
  setSideLabelBackText: (value) =>
    set({
      sideLabelBackText: value,
    }),
  setProductNameText: (value: string) =>
    set({
      productNameText: value,
    }),
  setCompanyName: (value: string) =>
    set({
      companyName: value,
    }),
  setManufactureName: (arr: string[]) =>
    set({
      manufactureName: arr,
    }),
  setDividerLineData: (arr: string[]) =>
    set({
      dividerLineData: arr,
    }),
  setShape: (arr: string[]) =>
    set({
      shape: arr,
    }),
  setFrontColor: (arr: string[]) =>
    set({
      frontColor: arr,
    }),
  setBackColor: (arr: string[]) =>
    set({
      backColor: arr,
    }),
  resetSelectedSearchId: () =>
    set({
      sideLabelFrontText: '',
      sideLabelBackText: '',
      productNameText: '',
      companyName: '',
      manufactureName: [],
      dividerLineData: [],
      shape: [],
      frontColor: [],
      backColor: [],
    }),
  getSelectedSearchId: () => {
    const searchIdFrontText = get().sideLabelFrontText,
      searchIdBackText = get().sideLabelBackText,
      searchProductNameText = get().productNameText,
      searchCompanyName = get().companyName,
      searchManufactureName = get().manufactureName,
      searchDividerLineData = get().dividerLineData,
      searchShape = get().shape,
      searchFrontColor = get().frontColor,
      searchBackColor = get().backColor;

    const data: SearchPillData = {
      PRINT_FRONT: searchIdFrontText,
      PRINT_BACK: searchIdBackText,
      ITEM_NAME: searchProductNameText,
      ENTP_NAME: searchCompanyName,
      DRUG_SHAPE: searchShape,
      COLOR_CLASS1: searchFrontColor,
      COLOR_CLASS2: searchBackColor,
      LINE_FRONT: searchManufactureName,
      LINE_BACK: searchDividerLineData,
      // FORM_CODE: [],
      MARK_CODE_FRONT: '',
      MARK_CODE_BACK: '',
    };

    console.log('data', data);

    return data;
  },
}));

interface SearchPillData {
  PRINT_FRONT: string;
  PRINT_BACK: string;
  ITEM_NAME: string;
  ENTP_NAME: string;
  COLOR_CLASS1: string[];
  COLOR_CLASS2: string[];
  LINE_FRONT: string[];
  LINE_BACK: string[];
  MARK_CODE_FRONT: string;
  MARK_CODE_BACK: string;
}
