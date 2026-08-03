import { create } from 'zustand';

interface IFullLoadingStore {
  isLoading: boolean;
  message: string;
  setShow: (message?: string) => void;
  setHide: () => void;
}

export const useFullLoadingStore = create<IFullLoadingStore>((set) => ({
  isLoading: false,
  message: '',
  setShow: (message) =>
    set(() => ({
      isLoading: true,
      message: message || '',
    })),
  setHide: () => set(() => ({ isLoading: false, message: '' })),
}));
