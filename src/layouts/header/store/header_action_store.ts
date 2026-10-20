import { create } from 'zustand';

interface HeaderActionState {
  onSearch: (() => void) | null;
  setSearch: (onSearch: (() => void) | null) => void;
}

export const useHeaderActionStore = create<HeaderActionState>((set) => ({
  onSearch: null,
  setSearch: (onSearch) => set({ onSearch }),
}));
