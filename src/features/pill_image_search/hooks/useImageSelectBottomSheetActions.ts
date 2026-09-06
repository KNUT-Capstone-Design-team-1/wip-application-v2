import { useImageSearchBottomSheetStore } from '../store/image_search_bottom_sheet_store';

export const useImageSelectBottomSheetActions = () => {
  const setSheetOpen = useImageSearchBottomSheetStore(
    (state) => state.setSheetOpen,
  );

  const setSheetClose = useImageSearchBottomSheetStore(
    (state) => state.sheetClose,
  );

  /**
   * Image Select Bottom Sheet Open 시 동작 처리
   * @param sheetType - 앨범 또는 파일 탐색기 타입 지정
   */
  const handleBottomSheetOpen = (sheetType: 'album' | 'file') => {
    setSheetOpen(sheetType);
  };

  /**
   * Image Select Bottom Sheet Close 시 동작 처리
   */
  const handleBottomSheetClose = () => {
    setSheetClose();
  };

  return { handleBottomSheetOpen, handleBottomSheetClose };
};
