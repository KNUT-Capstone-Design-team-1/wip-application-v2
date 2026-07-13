import { create } from 'zustand';

export interface IHeaderTitleStore {
  title: string;
  setTitle: (title: string) => void;
  resetTitle: () => void;
}

export const useHeaderTitleStore = create<IHeaderTitleStore>((set) => ({
  title: '',
  setTitle: (title: string) => set({ title }),
  resetTitle: () => set({ title: '' }),
}));
