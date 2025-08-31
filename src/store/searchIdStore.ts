import { create } from 'zustand';
import { type TPillSearchParam } from '@api/db/query';
import { idSelectData } from '@constants/data';
import { useMarkStore } from '@/store/markStore';

interface ISearchIdStore {
  searchIdShapes: string[];
  searchIdColors: string[];
  searchIdDosages: string[];
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
  getSearchIdItems: () => TPillSearchParam;
  setDosageNames: (dosages: string[]) => void;
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
  searchIdDosages: ['dosage0'],
  searchIdDividings: ['dividing0'],
  setSearchIdShapes: (searchIdShapes) => set({ searchIdShapes }),
  setSearchIdColors: (searchIdColors) => set({ searchIdColors }),
  setSearchIdFront: (searchIdFront) => set({ searchIdFront }),
  setSearchIdBack: (searchIdBack) => set({ searchIdBack }),
  setProductName: (searchProductName) => set({ searchProductName }),
  setCompanyName: (searchCompanyName) => set({ searchCompanyName }),
  setSearchMark: (searchMark) => set({ searchMark }),
  setDosageNames: (searchIdDosages) => set({ searchIdDosages }),
  setDividingNames: (searchIdDividings) => set({ searchIdDividings }),
  resetSearchId: () => {
    set({
      searchIdShapes: ['shape0'],
      searchIdColors: ['color0'],
      searchIdFront: '',
      searchIdBack: '',
      searchProductName: '',
      searchCompanyName: '',
      searchIdDosages: ['dosage0'],
      searchIdDividings: ['dividing0'],
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
    const searchIdDividings = get().searchIdDividings;
    const searchMark = get().searchMark;

    const data: TPillSearchParam = {
      PRINT_FRONT: '',
      PRINT_BACK: '',
      PRODUCT: '',
      COMPANY: '',
      DRUG_SHAPE: [],
      COLOR_CLASS1: [],
      COLOR_CLASS2: [],
      LINE_FRONT: [],
      LINE_BACK: [],
      CHART: [],
      MARK: '',
    };

    if (searchIdFront.length > 0) {
      data['PRINT_FRONT'] = '*' + searchIdFront.replace(/(?<=.)|(?=.)/g, '*');
    }

    if (searchIdBack.length > 0) {
      data['PRINT_BACK'] = '*' + searchIdBack.replace(/(?<=.)|(?=.)/g, '*');
    }

    if (searchProduct.length > 0) {
      data['PRODUCT'] = '*' + searchProduct.replace(/(?<=.)|(?=.)/g, '*');
    }

    if (searchCompany.length > 0) {
      data['COMPANY'] = '*' + searchCompany.replace(/(?<=.)|(?=.)/g, '*');
    }

    if (searchMark.length > 0) {
      data['MARK'] = '*' + searchMark.replace(/(?<=.)|(?=.)/g, '*');
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

          case 'dosage':
            if (val.category + val.key == 'dosage0') {
              break;
            }

            if (searchIdDividings.includes(val.category + val.key)) {
              data['CHART']?.push(val.name);
            }
            break;

          case 'dividing':
            if (val.category + val.key == 'dividing0') {
              break;
            }

            if (searchIdDividings.includes(val.category + val.key)) {
              data['LINE_FRONT']?.push(val.name);
              data['LINE_BACK']?.push(val.name);
            }
            break;
        }
      });
    }

    return data;
  },
}));
