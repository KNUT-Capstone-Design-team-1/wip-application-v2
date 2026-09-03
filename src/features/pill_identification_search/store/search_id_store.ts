import { create } from 'zustand';
import {
  ISearchPillData,
  ISearchIdStore,
} from '@features/pill_identification_search/types';

// 식별 검색 폼 상태 관리 Zustand 스토어 (Presentation State)
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

  // 전면 식별문자 변경
  setSideLabelFrontText: (value) =>
    set({
      sideLabelFrontText: value,
    }),

  // 후면 식별문자 변경
  setSideLabelBackText: (value) =>
    set({
      sideLabelBackText: value,
    }),

  // 의약품명 변경
  setProductNameText: (value: string) =>
    set({
      productNameText: value,
    }),

  // 제약업체명 변경
  setCompanyName: (value: string) =>
    set({
      companyName: value,
    }),

  // 제형 선택 변경
  setManufacturerName: (arr: string[] | null) =>
    set({
      manufacturerName: arr,
    }),

  // 분할선 선택 변경
  setDividerLineData: (arr: string[] | null) =>
    set({
      dividerLineData: arr,
    }),

  // 모양 선택 변경
  setShape: (arr: string[] | null) =>
    set({
      shape: arr,
    }),

  // 색상 선택 변경
  setColors: (arr: string[] | null) =>
    set({
      colors: arr,
    }),

  // 전면 마크코드 변경
  setMarkCodeFront: (value: string) =>
    set({
      markCodeFront: value,
    }),

  // 후면 마크코드 변경
  setMarkCodeBack: (value: string) =>
    set({
      markCodeBack: value,
    }),

  // 완전 일치 여부 변경
  setIsExactMatch: (value: boolean) =>
    set({
      isExactMatch: value,
    }),

  // 전체 검색 조건 초기화
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

  // 현재 스토어 상태를 검색 파라미터 원본 객체로 취합 반환
  getSelectedSearchId: () => {
    const state = get();

    const data: ISearchPillData = {
      PRINT_FRONT: state.sideLabelFrontText,
      PRINT_BACK: state.sideLabelBackText,
      ITEM_NAME: state.productNameText,
      ENTP_NAME: state.companyName,
      DRUG_SHAPE: state.shape,
      COLOR_CLASS1: state.colors,
      COLOR_CLASS2: state.colors,
      FORM_CODE: state.manufacturerName,
      LINE_FRONT: state.dividerLineData,
      LINE_BACK: state.dividerLineData,
      MARK_CODE_FRONT: state.markCodeFront,
      MARK_CODE_BACK: state.markCodeBack,
      isExactMatch: state.isExactMatch,
    };

    return data;
  },
}));
