import { create } from 'zustand';

interface ICameraGuideModalState {
  isGuideModalVisible: boolean;
  setIsGuideModalVisible: (isGuideModalVisible: boolean) => void;
}

export const useCameraGuideModalStore = create<ICameraGuideModalState>(
  (set) => ({
    isGuideModalVisible: false,
    setIsGuideModalVisible: (isGuideModalVisible: boolean) =>
      set({ isGuideModalVisible }),
  }),
);
