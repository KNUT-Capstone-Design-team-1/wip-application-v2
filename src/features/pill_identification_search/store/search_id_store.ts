import { create } from 'zustand';
import { ISearchPillData, ISearchIdStore } from "@/src/features/pill_identification_search/types/search_id_types";

export const useSearchIdStore = create<ISearchIdStore>((set, get) => ({
  sideLabelFrontText: '',
  sideLabelBackText: '',
  productNameText: '',

  companyName: '',
  manufacturerName: null,
  dividerLineData: null,
  shape: null,
  frontColor: null,
  backColor: null,
  markCodeFront: '',
  markCodeBack: '',
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
  setManufacturerName: (arr: string[]) =>
    set({
      manufacturerName: arr,
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
  setMarkCodeFront: (value: string) =>
    set({
      markCodeFront: value,
    }),
  setMarkCodeBack: (value: string) =>
    set({
      markCodeBack: value,
    }),
  resetSelectedSearchId: () =>
    set({
      sideLabelFrontText: '',
      sideLabelBackText: '',
      productNameText: '',
      companyName: '',
      manufacturerName: null,
      dividerLineData: null,
      shape: null,
      frontColor: null,
      backColor: null,
      markCodeFront: '',
      markCodeBack: '',
    }),
  getSelectedSearchId: () => {
    const searchIdFrontText = get().sideLabelFrontText,
      searchIdBackText = get().sideLabelBackText,
      searchProductNameText = get().productNameText,
      searchCompanyName = get().companyName,
      searchManufacturerName = get().manufacturerName,
      searchDividerLineData = get().dividerLineData,
      searchShape = get().shape,
      searchFrontColor = get().frontColor,
      searchBackColor = get().backColor,
      searchMarkCodeFront = get().markCodeFront,
      searchMarkCodeBack = get().markCodeBack;

    const data: ISearchPillData = {
      PRINT_FRONT: searchIdFrontText,
      PRINT_BACK: searchIdBackText,
      ITEM_NAME: searchProductNameText,
      ENTP_NAME: searchCompanyName,
      DRUG_SHAPE: searchShape,
      COLOR_CLASS1: searchFrontColor,
      COLOR_CLASS2: searchBackColor,
      FORM_CODE: searchManufacturerName,
      LINE_FRONT: searchDividerLineData,
      LINE_BACK: searchDividerLineData,
      MARK_CODE_FRONT: searchMarkCodeFront,
      MARK_CODE_BACK: searchMarkCodeBack,
    };

    console.log('data', data);

    return data;
  },
}));
