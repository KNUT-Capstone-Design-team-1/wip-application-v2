import { create } from 'zustand';
import {
  ISearchPillData,
  ISearchIdStore,
} from '@features/pill_identification_search/types/search_id_types';

export const useSearchIdStore = create<ISearchIdStore>((set, get) => ({
  sideLabelFrontText: '',
  sideLabelBackText: '',
  productNameText: '',

  companyName: '',
  manufacturerName: null,
  dividerLineData: null,
  shape: null,
  colors: null,
  markCodeFront: '',
  markCodeBack: '',
  isExactMatch: false,

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
  setManufacturerName: (arr: string[] | null) =>
    set({
      manufacturerName: arr,
    }),
  setDividerLineData: (arr: string[] | null) =>
    set({
      dividerLineData: arr,
    }),
  setShape: (arr: string[] | null) =>
    set({
      shape: arr,
    }),
  setColors: (arr: string[] | null) =>
    set({
      colors: arr,
    }),
  setMarkCodeFront: (value: string) =>
    set({
      markCodeFront: value,
    }),
  setMarkCodeBack: (value: string) =>
    set({
      markCodeBack: value,
    }),
  setIsExactMatch: (value: boolean) =>
    set({
      isExactMatch: value,
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
      colors: null,
      markCodeFront: '',
      markCodeBack: '',
      isExactMatch: false,
    }),
  getSelectedSearchId: () => {
    const searchIdFrontText = get().sideLabelFrontText,
      searchIdBackText = get().sideLabelBackText,
      searchProductNameText = get().productNameText,
      searchCompanyName = get().companyName,
      searchManufacturerName = get().manufacturerName,
      searchDividerLineData = get().dividerLineData,
      searchShape = get().shape,
      searchColors = get().colors,
      searchMarkCodeFront = get().markCodeFront,
      searchMarkCodeBack = get().markCodeBack,
      searchIsExactMatch = get().isExactMatch;

    const data: ISearchPillData = {
      PRINT_FRONT: searchIdFrontText,
      PRINT_BACK: searchIdBackText,
      ITEM_NAME: searchProductNameText,
      ENTP_NAME: searchCompanyName,
      DRUG_SHAPE: searchShape,
      COLOR_CLASS1: searchColors,
      COLOR_CLASS2: searchColors,
      FORM_CODE: searchManufacturerName,
      LINE_FRONT: searchDividerLineData,
      LINE_BACK: searchDividerLineData,
      MARK_CODE_FRONT: searchMarkCodeFront,
      MARK_CODE_BACK: searchMarkCodeBack,
      isExactMatch: searchIsExactMatch,
    };

    console.log('data', data);

    return data;
  },
}));
