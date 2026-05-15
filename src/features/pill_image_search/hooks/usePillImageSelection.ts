import { useCallback } from 'react';
import { usePillImageStore } from '../store/pill_image_store';
import { requestPillImageFeatureExtraction } from '@services/apis/google_cloud/wip_pill_image_feature_extraction';
import { getPillDatas } from '@services/database/queries/pill_data';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import { router } from 'expo-router';
import RNFS from 'react-native-fs';
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

  const { setSearchResultData, setIsLoading, setSearchParam } =
    useSearchResultListStore();

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
      router.push('/pill-search-result-list');

      // 1. 이미지 파일을 Base64로 변환
      const frontBase64 = await RNFS.readFile(pillImages.front, 'base64');
      // 뒷면 이미지도 특징 추출에 사용할 수 있지만, 현재 API는 하나만 받음 (필요 시 수정)
      // const backBase64 = await RNFS.readFile(pillImages.back, 'base64');

      // 2. 특징 추출 API 호출
      const extractionResult =
        await requestPillImageFeatureExtraction(frontBase64);

      if (!extractionResult) {
        throw new Error('특징 추출 실패');
      }

      const { PRINT, SHAPE, COLOR } = extractionResult;

      // 3. 추출된 특징으로 DB 검색
      const searchParam = {
        PRINT_FRONT: PRINT.join(' '),
        DRUG_SHAPE: SHAPE,
        COLOR_CLASS1: COLOR,
      };

      console.log('추출된 특징 기반 검색 시작:', searchParam);
      setSearchParam(searchParam);

      const results = await getPillDatas(searchParam, { page: 1, limit: 30 });
      setSearchResultData(results);
    } catch (error) {
      logger.error(`이미지 검색 실패: ${error}`);

      Alert.alert('검색 실패', '이미지 분석 중 오류가 발생했습니다.');

      router.back();
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
