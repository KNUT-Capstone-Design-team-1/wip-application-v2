import { type ImagePickerAsset } from 'expo-image-picker';
import { create } from 'zustand';

export type TImgFile = {
  front: ImagePickerAsset | null;
  back: ImagePickerAsset | null;
};

interface IImgFileStore {
  imgFile: TImgFile;
  setImgFile: (imgFile: TImgFile) => void;
}

export const useImgFileStore = create<IImgFileStore>((set) => ({
  imgFile: { front: null, back: null },
  setImgFile: (imgFile) => set({ imgFile }),
}));
