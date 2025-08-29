import { create } from 'zustand';
import { type TPillSearchParam } from '@api/db/query';
import { idSelectData } from '@constants/data';

interface ISearchIdStore {
  searchIdShapes: string[];
  searchIdColors: string[];
  searchIdFront: string;
  searchIdBack: string;
  setSearchIdShapes: (searchIdShapes: string[]) => void;
  setSearchIdColors: (searchIdColors: string[]) => void;
  setSearchIdFront: (searchIdFront: string) => void;
  setSearchIdBack: (searchIdBack: string) => void;
  resetSearchId: () => void;
  getSearchIdItems: () => TPillSearchParam;
}

export const useSearchIdStore = create<ISearchIdStore>((set, get) => ({
  searchIdShapes: ['shape0'],
  searchIdColors: ['color0'],
  searchIdFront: '',
  searchIdBack: '',
  setSearchIdShapes: (searchIdShapes) => set({ searchIdShapes }),
  setSearchIdColors: (searchIdColors) => set({ searchIdColors }),
  setSearchIdFront: (searchIdFront) => set({ searchIdFront }),
  setSearchIdBack: (searchIdBack) => set({ searchIdBack }),
  resetSearchId: () => {
    set({
      searchIdShapes: ['shape0'],
      searchIdColors: ['color0'],
      searchIdFront: '',
      searchIdBack: '',
    });
  },
  getSearchIdItems: () => {
    const searchIdShapes = get().searchIdShapes;
    const searchIdColors = get().searchIdColors;
    const searchIdFront = get().searchIdFront;
    const searchIdBack = get().searchIdBack;

    const data: TPillSearchParam = {
      PRINT_FRONT: '',
      PRINT_BACK: '',
      DRUG_SHAPE: [],
      COLOR_CLASS1: [],
      COLOR_CLASS2: [],
    };

    if (searchIdFront.length > 0) {
      data['PRINT_FRONT'] = '*' + searchIdFront.replace(/(?<=.)|(?=.)/g, '*');
    }

    if (searchIdBack.length > 0) {
      data['PRINT_BACK'] = '*' + searchIdBack.replace(/(?<=.)|(?=.)/g, '*');
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
        }
      });
    }

    return data;
  },
}));
