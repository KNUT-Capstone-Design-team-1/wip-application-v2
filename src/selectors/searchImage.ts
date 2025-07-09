import { searchImageAtom } from '@/atoms/searchImage';
import { convertImgUriToBase64, getResizeImgUri } from '@/utils/image';
import { selector } from 'recoil';

export const searchImageState = selector({
  key: 'searchImageState',
  get: ({ get }) => {
    const searchImage = get(searchImageAtom);
    return searchImage;
  },
  set: ({ reset }) => {
    reset(searchImageAtom);
  },
});

export const searchImageBase64State = selector({
  key: 'searchImageBase64State',
  get: async ({ get }) => {
    const searchImage = get(searchImageAtom);
    if (searchImage == '') {
      return '';
    }
    try {
      const resized = await getResizeImgUri(searchImage);
      const base64 = await convertImgUriToBase64(resized);
      return base64;
    } catch (error) {
      console.error(error);
      return '';
    }
  },
});
