import { create } from 'zustand';
import { type TPillSearchParam } from '@api/db/query';
import { idSelectData } from '@constants/data';
import { useMarkStore } from '@/store/markStore';

interface ISearchIdStore {
  searchIdShapes: string[];
  searchIdColors: string[];
  searchIdFormCodes: string[];
  searchIdDividings: string[];
  searchIdFront: string;
  searchIdBack: string;
  searchProductName: string;
  searchCompanyName: string;
  searchMark: string;
  setSearchIdShapes: (searchIdShapes: string[]) => void;
  setSearchIdColors: (searchIdColors: string[]) => void;
  setSearchIdFront: (searchIdFront: string) => void;
  setSearchIdBack: (searchIdBack: string) => void;
  setProductName: (searchProductName: string) => void;
  setCompanyName: (searchCompanyName: string) => void;
  setSearchMark: (searchMarkName: string) => void;
  resetSearchId: () => void;
  getSearchIdItems: () => Omit<TPillSearchParam, 'DIVIDING' | 'MARK'>;
  setFormCodeNames: (formCodes: string[]) => void;
  setDividingNames: (dividings: string[]) => void;
}

export const useSearchIdStore = create<ISearchIdStore>((set, get) => ({
  searchIdShapes: ['shape0'],
  searchIdColors: ['color0'],
  searchIdFront: '',
  searchIdBack: '',
  searchProductName: '',
  searchCompanyName: '',
  searchMark: '',
  searchIdFormCodes: ['formCode0'],
  searchIdDividings: ['dividing0'],
  setSearchIdShapes: (searchIdShapes) => set({ searchIdShapes }),
  setSearchIdColors: (searchIdColors) => set({ searchIdColors }),
  setSearchIdFront: (searchIdFront) => set({ searchIdFront }),
  setSearchIdBack: (searchIdBack) => set({ searchIdBack }),
  setProductName: (searchProductName) => set({ searchProductName }),
  setCompanyName: (searchCompanyName) => set({ searchCompanyName }),
  setSearchMark: (searchMark) => set({ searchMark }),
  setFormCodeNames: (searchIdFormCodes) => set({ searchIdFormCodes }),
  setDividingNames: (searchIdDividings) => set({ searchIdDividings }),
  resetSearchId: () => {
    set({
      searchIdShapes: ['shape0'],
      searchIdColors: ['color0'],
      searchIdFront: '',
      searchIdBack: '',
      searchProductName: '',
      searchCompanyName: '',
      searchIdFormCodes: ['formCode0'],
      searchIdDividings: ['dividing0'],
      searchMark: '',
    });

    useMarkStore.getState().resetSelectedMarkBase64();
  },
  getSearchIdItems: () => {
    const searchIdShapes = get().searchIdShapes;
    const searchIdColors = get().searchIdColors;
    const searchIdFront = get().searchIdFront;
    const searchIdBack = get().searchIdBack;
    const searchProduct = get().searchProductName;
    const searchCompany = get().searchCompanyName;
    const searchIdFormCodes = get().searchIdFormCodes;
    const searchIdDividings = get().searchIdDividings;
    const searchMark = get().searchMark;

    const data: Omit<TPillSearchParam, 'DIVIDING' | 'MARK'> = {
      PRINT_FRONT: '',
      PRINT_BACK: '',
      ITEM_NAME: '',
      ENTP_NAME: '',
      DRUG_SHAPE: [],
      COLOR_CLASS1: [],
      COLOR_CLASS2: [],
      LINE_FRONT: [],
      LINE_BACK: [],
      FORM_CODE: [],
      MARK_CODE_FRONT: '',
      MARK_CODE_BACK: '',
    };

    if (searchIdFront.length > 0) {
      data['PRINT_FRONT'] = searchIdFront;
    }

    if (searchIdBack.length > 0) {
      data['PRINT_BACK'] = searchIdBack;
    }

    if (searchProduct.length > 0) {
      data['ITEM_NAME'] = searchProduct;
    }

    if (searchCompany.length > 0) {
      data['ENTP_NAME'] = searchCompany;
    }

    if (searchMark.length > 0) {
      data['MARK_CODE_FRONT'] = searchMark;
      data['MARK_CODE_BACK'] = searchMark;
    }

    for (const item of idSelectData) {
      item.data.forEach((val) => {
        switch (val.category) {
          case 'shape':
            if (val.category + val.key === 'shape0') {
              break;
            }

            if (searchIdShapes.includes(val.category + val.key)) {
              data['DRUG_SHAPE']?.push(val.name);
            }
            break;
          case 'color':
            if (val.category + val.key === 'color0') {
              break;
            }

            if (searchIdColors.includes(val.category + val.key)) {
              data['COLOR_CLASS1']?.push(val.name);
              data['COLOR_CLASS2']?.push(val.name);
            }
            break;

          case 'formCode':
            if (val.category + val.key === 'formCode0') {
              break;
            }

            if (searchIdFormCodes.includes(val.category + val.key)) {
              data['FORM_CODE'].push(val.name);
            }
            break;

          case 'dividing':
            if (val.category + val.key === 'dividing0') {
              break;
            }

            if (searchIdDividings.includes(val.category + val.key)) {
              // 분할선 값 변환: "없음" -> "", "+ 형" -> "+", "- 형" -> "-"
              let lineValue = val.name;
              if (val.name === '없음') {
                lineValue = '';
              } else if (val.name === '+ 형') {
                lineValue = '+';
              } else if (val.name === '- 형') {
                lineValue = '-';
              }

              data['LINE_FRONT'].push(lineValue);
              data['LINE_BACK'].push(lineValue);
            }
            break;
        }
      });
    }

    return data;
  },
}));
