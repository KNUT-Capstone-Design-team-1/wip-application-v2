import { useCallback } from 'react';
import { usePillImageStore } from '../store/pill_image_store';
import { requestPillImageFeatureExtraction } from '@services/apis/google_cloud/wip_pill_image_feature_extraction';
import {
  getPillDataCount,
  getPillDatas,
} from '@services/database/queries/pill_data';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { router } from 'expo-router';
import { File } from 'expo-file-system';
import { Alert } from 'react-native';
import logger from '@utils/logger';

/**
 * 알약 이미지 선택 로직을 관리하는 Hook
 */
export const usePillImageSelection = () => {
  const {
    pillImages,
    hasImage,
    isSearching,
    setFrontImage,
    setBackImage,
    setPillImages,
    removeFrontImage,
    removeBackImage,
    resetPillImages,
    setIsSearching,
  } = usePillImageStore();

  const {
    setSearchResultData,
    setIsLoading,
    setSearchParam,
    setTotalDataCount,
  } = useSearchResultListStore();

  // 단일 이미지 등록 핸들러 (빈 공간에 순차적으로 사진을 채움)
  const handleImageSelect = useCallback(
    (imageUri: string) => {
      const hasBothImages = !!(pillImages.front && pillImages.back);
      if (hasBothImages) {
        resetPillImages();
        setFrontImage(imageUri);
        return;
      }

      const isFrontEmpty = !pillImages.front;
      if (isFrontEmpty) {
        setFrontImage(imageUri);
        return;
      }

      const isBackEmpty = !pillImages.back;
      if (isBackEmpty) {
        setBackImage(imageUri);
      }
    },
    [pillImages, resetPillImages, setFrontImage, setBackImage],
  );

  // 다중 이미지 등록 핸들러 (앨범/파일 탐색기에서 1~2장 선택 시 처리)
  const handleMultipleImageSelect = useCallback(
    (images: string[]) => {
      const isSingleImage = images.length === 1;
      if (isSingleImage) {
        handleImageSelect(images[0]);
        return;
      }

      const hasEnoughImages = images.length >= 2;
      if (hasEnoughImages) {
        setPillImages({ front: images[0], back: images[1] });
      }
    },
    [handleImageSelect, setPillImages],
  );

  // 특정 위치(앞면/뒷면)의 이미지 삭제 핸들러
  const handleImageRemove = useCallback(
    (side: 'front' | 'back') => {
      const isFront = side === 'front';
      if (isFront) {
        removeFrontImage();
        return;
      }

      removeBackImage();
    },
    [removeFrontImage, removeBackImage],
  );

  // 선택된 두 장의 이미지를 서버로 전송하여 알약 특징 추출 및 DB 검색 수행 핸들러
  const handleSearch = useCallback(async () => {
    const isMissingImage = !pillImages.front || !pillImages.back;
    if (isMissingImage) {
      Alert.alert(
        '이미지 부족',
        '알약의 앞면과 뒷면 이미지가 모두 필요합니다.',
      );
      return;
    }

    try {
      setIsSearching(true);
      setIsLoading(true);

      // 이미지 파일을 Base64로 변환 (병렬 처리)
      const [frontBase64, backBase64] = await Promise.all([
        new File(pillImages.front).base64(),
        new File(pillImages.back).base64(),
      ]);

      // 특징 추출 API 호출
      const extractionResult = await requestPillImageFeatureExtraction({
        front: frontBase64,
        back: backBase64,
      });

      const hasNoResult = !extractionResult;
      if (hasNoResult) {
        throw new Error(`No extractionResult`);
      }

      const { PRINT_FRONT, PRINT_BACK, SHAPE, COLOR } = extractionResult;

      // 추출된 특징으로 DB 검색 파라미터 구성
      const searchParam = {
        PRINT_FRONT,
        PRINT_BACK,
        DRUG_SHAPE: SHAPE,
        COLOR_CLASS1: COLOR,
      };

      logger.info(
        `[IMAGE-SEARCH] Extracted features: ${JSON.stringify(searchParam)}`,
      );

      setSearchParam(searchParam);

      const totalDataCount = await getPillDataCount(searchParam);
      const results = await getPillDatas(searchParam, { page: 1, limit: 30 });

      setSearchResultData(results);
      setTotalDataCount(totalDataCount);

      router.push('/pill-search-result-list'); // 검색 완료 후 결과 화면으로 이동
    } catch (e) {
      logger.error(`[IMAGE-SEARCH] Failed to image search. ${e.stack || e}`);

      Alert.alert(
        '검색 실패',
        '이미지 분석 중 오류가 발생했습니다. 다시 시도해 주세요.',
      );
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  }, [
    pillImages,
    setIsSearching,
    setIsLoading,
    setSearchResultData,
    setSearchParam,
  ]);

  // 앞면과 뒷면 이미지가 모두 선택되었는지 여부 확인 (true/false)
  const isBothImagesSelected = !!(pillImages.front && pillImages.back);

  return {
    pillImages,
    hasImage,
    isSearching,
    isBothImagesSelected,
    handleImageSelect,
    handleMultipleImageSelect,
    handleImageRemove,
    handleSearch,
    resetPillImages,
  };
};
