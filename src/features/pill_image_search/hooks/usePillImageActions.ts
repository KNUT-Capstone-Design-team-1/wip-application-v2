import { useCallback } from 'react';
import { usePillImageStore } from '../store/pill_image_store';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { router } from 'expo-router';
import logger from '@utils/logger';
import { useInterstitialAd } from '@features/ads/hooks/useInterstitialAd';
import { useAppTrackStore } from '@store/app_track_store';
import { useFullLoadingStore } from '@store/full_loading_store';
import {
  pickImageFromLibrary,
  pickImageFromFiles,
} from '../utils/imagePickerUtils';
import { useToast } from '@hooks/use_toast';
import { useImageSearchBottomSheetStore } from '../store/image_search_bottom_sheet_store';
import {
  extractPillFeatures,
  hasExtractedFeatures,
  searchPillData,
} from '../utils/pillImageActionUtils';

/**
 * 알약 이미지 검색 액션(이벤트 핸들러)을 제공하는 훅.
 * 리렌더링 유발 없이 Zustand store의 getState() 및 stable setter 함수를 통해 작업 수행.
 */
export const usePillImageActions = () => {
  const { showInterstitial } = useInterstitialAd();
  const { showToast } = useToast();

  const setFrontImage = usePillImageStore((state) => state.setFrontImage);
  const setBackImage = usePillImageStore((state) => state.setBackImage);
  const setPillImages = usePillImageStore((state) => state.setPillImages);
  const removeFrontImage = usePillImageStore((state) => state.removeFrontImage);
  const removeBackImage = usePillImageStore((state) => state.removeBackImage);
  const resetPillImages = usePillImageStore((state) => state.resetPillImages);
  const setIsSearching = usePillImageStore((state) => state.setIsSearching);
  const setDirection = usePillImageStore((state) => state.setDirection);
  const setFrontImageOnLoad = usePillImageStore(
    (state) => state.setFrontImageOnLoad,
  );
  const setBackImageOnLoad = usePillImageStore(
    (state) => state.setBackImageOnLoad,
  );

  const setSearchResultData = useSearchResultListStore(
    (state) => state.setSearchResultData,
  );
  const setIsLoading = useSearchResultListStore((state) => state.setIsLoading);
  const setSearchParam = useSearchResultListStore(
    (state) => state.setSearchParam,
  );
  const setTotalDataCount = useSearchResultListStore(
    (state) => state.setTotalDataCount,
  );

  const setSheetOpen = useImageSearchBottomSheetStore(
    (state) => state.setSheetOpen,
  );

  // 이미지 로드 완료
  const handleImageOnLoad = useCallback(
    (side: 'front' | 'back', state: boolean) => {
      if (side === 'front') {
        setFrontImageOnLoad(state);
      } else {
        setBackImageOnLoad(state);
      }
    },
    [setFrontImageOnLoad, setBackImageOnLoad],
  );

  // 이미지 한장 등록 처리
  const handleImageSelect = useCallback(
    (imageUri: string, direction: 'front' | 'back') => {
      if (direction === 'front') {
        setFrontImage(imageUri);
        setDirection('back');
        return;
      }
      setBackImage(imageUri);
      setDirection('front');
    },
    [setFrontImage, setBackImage, setDirection],
  );

  // 이미지 여러장 등록 처리
  const handleMultipleImageSelect = useCallback(
    (images: string[]) => {
      if (images.length === 1) {
        const pillImages = usePillImageStore.getState().pillImages;
        if (pillImages.front && !pillImages.back) {
          handleImageSelect(images[0], 'back');
          return;
        }
        handleImageSelect(images[0], 'front');
        return;
      }
      if (images.length >= 2) {
        setPillImages({ front: images[0], back: images[1] });
      }
    },
    [handleImageSelect, setPillImages],
  );

  // 선택 또는 촬영한 이미지 제거
  const handleImageRemove = useCallback(
    (side: 'front' | 'back') => {
      if (side === 'front') {
        removeFrontImage();
      } else {
        removeBackImage();
      }
    },
    [removeFrontImage, removeBackImage],
  );

  // 전체 또는 특정 방향 이미지 교체
  const handleImageReplace = useCallback(
    async (
      type: 'album' | 'file',
      side?: 'front' | 'back',
    ): Promise<boolean> => {
      try {
        const count = side ? 1 : 2;
        const images =
          type === 'album'
            ? await pickImageFromLibrary(count)
            : await pickImageFromFiles(count);
        if (images && images.length > 0) {
          if (side === 'front') {
            setFrontImage(images[0]);
          } else if (side === 'back') {
            setBackImage(images[0]);
          } else {
            handleMultipleImageSelect(images);
          }
          return true;
        }
        return false;
      } catch (e) {
        logger.error(e);
        showToast({
          type: 'error',
          message: '이미지 선택 중 오류가 발생했습니다.',
        });
        return false;
      }
    },
    [handleMultipleImageSelect, setFrontImage, setBackImage, showToast],
  );

  // '앨범에서 선택하기' 버튼 클릭 핸들러
  const handleAlbumPress = useCallback(async () => {
    const pillImages = usePillImageStore.getState().pillImages;
    if (!pillImages.front && !pillImages.back) {
      await handleImageReplace('album');
      return;
    }

    setSheetOpen('album');
  }, [handleImageReplace, setSheetOpen]);

  // '파일 탐색기에서 선택하기' 버튼 클릭 핸들러
  const handleFilePress = useCallback(async () => {
    const pillImages = usePillImageStore.getState().pillImages;
    if (!pillImages.front && !pillImages.back) {
      await handleImageReplace('file');
      return;
    }
    setSheetOpen('file');
  }, [handleImageReplace, setSheetOpen]);

  // 카메라 촬영 핸들러
  const handleCameraCapture = (imageUri: string) => {
    const direction = usePillImageStore.getState().direction;
    handleImageSelect(imageUri, direction);
    setDirection(direction === 'front' ? 'back' : 'front');
  };

  // 카메라 화면 닫기 핸들러
  const handleCameraClose = () => {};

  // 알약 촬영 방향 선택
  const handlePreviewPress = (direction: 'front' | 'back') => {
    setDirection(direction);
  };

  // 이미지 검색 실행
  const handleSearch = useCallback(async () => {
    const { front, back } = usePillImageStore.getState().pillImages;
    if (!front || !back) {
      showToast({ message: '알약의 앞면과 뒷면 이미지가 모두 필요합니다.' });
      return;
    }
    const { setShow, setHide } = useFullLoadingStore.getState();
    setShow('이미지를 분석하여 알약을 찾는 중입니다...');
    setIsSearching(true);
    let apiError: any = null;

    try {
      const searchPromise = (async () => {
        try {
          const searchParam = await extractPillFeatures(front, back);
          logger.info(
            `[IMAGE-SEARCH] Extracted features: ${JSON.stringify(searchParam)}`,
          );

          // 빈 값 확인
          if (!hasExtractedFeatures(searchParam)) {
            return { isEmpty: true, totalDataCount: 0, results: [] };
          }

          setSearchParam(searchParam);
          const { totalDataCount, results } = await searchPillData(searchParam);
          return { isEmpty: false, totalDataCount, results };
        } catch (e) {
          apiError = e;
          return null;
        }
      })();

      const adPromise = new Promise<void>((resolve) =>
        showInterstitial(() => resolve(), 'IMAGE_SEARCH'),
      );
      await adPromise;

      const searchData = await searchPromise;
      if (apiError || !searchData) {
        logger.error(
          `[IMAGE-SEARCH] Failed to image search. ${apiError?.stack || apiError}`,
        );
        showToast({
          type: 'error',
          message: '이미지 분석에 실패했습니다. 다시 시도해 주세요.',
        });
        return;
      }

      if (searchData.isEmpty) {
        showToast({
          message:
            '알약의 특징을 인식하지 못했어요.\n다시 촬영하거나 식별 검색을 이용해 보세요.',
          duration: 4000,
        });
        return;
      }

      setSearchResultData(searchData.results);
      setTotalDataCount(searchData.totalDataCount);
      useAppTrackStore.getState().increaseCoreActionCount('image_search');
      router.push('/pill-search-result-list');
    } finally {
      setIsLoading(false);
      setIsSearching(false);
      setHide();
    }
  }, [
    setIsSearching,
    setIsLoading,
    setSearchResultData,
    setSearchParam,
    setTotalDataCount,
    showInterstitial,
  ]);

  return {
    handleImageRemove,
    handleAlbumPress,
    handleFilePress,
    handleCameraCapture,
    handleCameraClose,
    handleSearch,
    resetPillImages,
    handlePreviewPress,
    handleImageReplace,
    handleImageOnLoad,
  };
};
