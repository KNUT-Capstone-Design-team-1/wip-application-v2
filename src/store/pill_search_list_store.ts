import { create } from 'zustand';

interface IPillSearchListStore {
  limitValue: number;
  setLimitValue: (value: number) => void;
  getLimitValue: () => number;
}

export const usePillSearchListStore = create<IPillSearchListStore>(
  (set, get) => ({
    limitValue: 1,
    setLimitValue: (value: number) =>
      set({
        limitValue: value,
      }),
    getLimitValue: () => {
      return get().limitValue;
    },
  }),
);
