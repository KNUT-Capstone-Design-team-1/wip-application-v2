import { atom } from 'recoil';

export const imgFileState = atom({
  key: 'imgFileState',
  default: { front: null, back: null },
});
