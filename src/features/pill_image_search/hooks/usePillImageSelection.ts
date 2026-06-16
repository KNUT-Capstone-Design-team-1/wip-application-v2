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

  /**
   * 단일 이미지 선택 (카메라 촬영)
   */
  const handleImageSelect = useCallback(
    (imageUri: string) => {
      // 재촬영 시: 이미 2장이 있으면 앞면부터 다시 시작
      if (pillImages.front && pillImages.back) {
        console.log('재촬영 - 앞면부터 다시 저장');
        resetPillImages();
        setFrontImage(imageUri);
        return;
      }

      // 앞면이 비어있으면 앞면에, 아니면 뒷면에 저장
      if (!pillImages.front) {
        console.log('앞면 이미지 저장:', imageUri);
        setFrontImage(imageUri);
      } else if (!pillImages.back) {
        console.log('뒷면 이미지 저장:', imageUri);
        setBackImage(imageUri);
      }
    },
    [pillImages, resetPillImages, setFrontImage, setBackImage],
  );

  /**
   * 다중 이미지 선택 (앨범에서 2장)
   */
  const handleMultipleImageSelect = useCallback(
    (images: string[]) => {
      if (images.length >= 2) {
        console.log('앨범에서 2장 선택:', images);
        resetPillImages();
        setFrontImage(images[0]);
        setBackImage(images[1]);
      }
    },
    [resetPillImages, setFrontImage, setBackImage],
  );

  /**
   * 이미지 삭제
   */
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

  /**
   * 검색하기 (API 호출)
   */
  const handleSearch = useCallback(async () => {
    if (!pillImages.front || !pillImages.back) {
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

      if (!extractionResult) {
        throw new Error(`No extractionResult`);
      }

      const { PRINT, SHAPE, COLOR } = extractionResult;

      // 추출된 특징으로 DB 검색 파라미터 구성
      const searchParam = {
        PRINT_FRONT: PRINT.join(' '),
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
