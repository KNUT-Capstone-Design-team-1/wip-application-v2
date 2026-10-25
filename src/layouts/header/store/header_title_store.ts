import { create } from 'zustand';
import type { IHeaderTitleStore } from '../types/header_store_type';

export const useHeaderTitleStore = create<IHeaderTitleStore>((set) => ({
  title: '',
  setTitle: (title: string) => set({ title }),
  resetTitle: () => set({ title: '' }),
}));
