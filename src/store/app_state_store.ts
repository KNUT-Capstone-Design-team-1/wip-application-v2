import { create } from 'zustand';

interface IAppStateStore {
  isExited: boolean;
  setIsExited: (state: boolean) => void;
}

// 앱 생명 주기 상태 관리 스토어
export const useAppStateStore = create<IAppStateStore>((set) => ({
  isExited: false,
  setIsExited: (state: boolean) => set({ isExited: state }),
}));
