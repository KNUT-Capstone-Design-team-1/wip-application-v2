import { atom } from 'recoil';

type TSearchData = { data: any; mode: number };

export const searchDataState = atom<TSearchData>({
  key: 'searchDataState',
  default: { data: null, mode: 0 },
});
