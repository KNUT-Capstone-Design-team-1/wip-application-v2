import { type Image as ImageType } from 'react-native-image-crop-picker';
import { create } from 'zustand';

export type TImgFile = {
  front: ImageType | null;
  back: ImageType | null;
};

interface IImgFileStore {
  imgFile: TImgFile;
  setImgFile: (imgFile: TImgFile) => void;
}

export const useImgFileStore = create<IImgFileStore>((set) => ({
  imgFile: { front: null, back: null },
  setImgFile: (imgFile) => set({ imgFile }),
}));
