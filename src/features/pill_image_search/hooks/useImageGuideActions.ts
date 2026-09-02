import { useCameraGuideModalStore } from '../store/camera_guide_store';

export const useImageGuideActions = () => {
  const setIsGuideModalVisible = useCameraGuideModalStore(
    (state) => state.setIsGuideModalVisible,
  );

  const handleGuideVisible = (visible: boolean) => {
    setIsGuideModalVisible(visible);
  };

  return { handleGuideVisible };
};
