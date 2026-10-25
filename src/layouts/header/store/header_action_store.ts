import { create } from 'zustand';
import type { HeaderActionState } from '../types/header_store_type';

export const useHeaderActionStore = create<HeaderActionState>((set) => ({
  onSearch: null,
  isSearchOpen: false,
  setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
  setSearch: (onSearch) => set({ onSearch, isSearchOpen: false }),
}));
