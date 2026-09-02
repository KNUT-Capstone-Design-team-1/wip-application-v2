import { create } from 'zustand';

interface ICameraGuideModalState {
  isGuideModalVisible: boolean;
  setIsGuideModalVisible: (isGuideModalVisible: boolean) => void;
}

/**
 * 카메라 가이드 모달 상태 관리를 위한 Dumb Store
 * - 가이드 모달 표시 여부의 순수 state 및 setter만 관리합니다.
 */
export const useCameraGuideModalStore = create<ICameraGuideModalState>(
  (set) => ({
    isGuideModalVisible: false,
    setIsGuideModalVisible: (isGuideModalVisible: boolean) =>
      set({ isGuideModalVisible }),
  }),
);
