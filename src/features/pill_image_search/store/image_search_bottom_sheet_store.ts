import { create } from 'zustand';

type TSheetType = 'album' | 'file';

interface IImageSearchBottomSheetState {
  isSheetOpen: boolean;
  sheetType: TSheetType;
  setSheetOpen: (sheetType: TSheetType) => void;
  sheetClose: () => void;
}

export const useImageSearchBottomSheetStore =
  create<IImageSearchBottomSheetState>((set) => ({
    isSheetOpen: false,
    sheetType: 'album',
    setSheetOpen: (sheetType: TSheetType) => {
      set({ isSheetOpen: true, sheetType });
    },
    sheetClose: () => {
      set({ isSheetOpen: false, sheetType: 'album' });
    },
  }));
