import { create } from 'zustand';
import { convertImgUriToBase64, getResizeImgUri } from '@utils/image';

interface ISearchImgStore {
  searchImg: string;
  searchImgBase64: string;
  setSearchImg: (searchImg: string) => void;
  resetSearchImg: () => void;
}

export const useSearchImgStore = create<ISearchImgStore>((set) => ({
  searchImg: '',
  searchImgBase64: '',
  setSearchImg: async (searchImg) => {
    if (searchImg === '') {
      set({ searchImg: '', searchImgBase64: '' });
      return;
    }
    try {
      const resized = await getResizeImgUri(searchImg);
      const base64 = await convertImgUriToBase64(resized);
      set({ searchImg, searchImgBase64: base64 });
    } catch (error) {
      console.error(error);
      set({ searchImg: '', searchImgBase64: '' });
    }
  },
  resetSearchImg: () => set({ searchImg: '', searchImgBase64: '' }),
}));
