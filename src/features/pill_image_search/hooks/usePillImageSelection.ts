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
import { requestReview } from '@utils/store_review';
import { useInterstitialAd } from '@features/ads/hooks/useInterstitialAd';

/**
 * 이미지에서 알약 특징(모양, 색상, 식별문자 등) 추출
 * @param frontUri 앞면 이미지 URI
 * @param backUri 뒷면 이미지 URI
 * @returns 추출된 특징 파라미터 객체
 */
const extractPillFeatures = async (frontUri: string, backUri: string) => {
  // 이미지 파일을 Base64로 변환 (병렬 처리)
  const [frontBase64, backBase64] = await Promise.all([
    new File(frontUri).base64(),
    new File(backUri).base64(),
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

  // 추출된 특징으로 DB 검색 파라미터 구성 후 반환
  return {
    PRINT_FRONT: extractionResult.PRINT_FRONT,
    PRINT_BACK: extractionResult.PRINT_BACK,
    DRUG_SHAPE: extractionResult.SHAPE,
    COLOR_CLASS1: extractionResult.COLOR,
  };
};

/**
 * 추출된 특징 파라미터 기반으로 로컬 DB에서 알약 데이터 검색
 * @param searchParam 추출된 검색용 파라미터 객체
 * @returns 전체 검색 데이터 개수 및 결과 목록
 */
const searchPillData = async (searchParam: any) => {
  const totalDataCount = await getPillDataCount(searchParam);

  const results = await getPillDatas(searchParam, { page: 1, limit: 30 });

  return { totalDataCount, results };
};

/**
 * 알약 이미지 선택 및 통합 검색 흐름을 관리하는 커스텀 Hook
 * @returns 상태값 및 이벤트 핸들러 모음
 */
export const usePillImageSelection = () => {
  const { showInterstitial } = useInterstitialAd();

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

  // 단일 이미지 등록 (빈 공간에 순차적으로 사진 채움)
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

  // 다중 이미지 등록 (앨범/파일 탐색기에서 다수 선택 시 처리)
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

  // 특정 위치(앞면/뒷면)의 이미지 삭제 처리
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

  // 선택된 여러 장의 이미지를 서버로 전송해 알약 특징 추출 및 DB 검색 수행
  const handleSearch = useCallback(async () => {
    const { front, back } = pillImages;
    const isMissingImage = !front || !back;

    if (isMissingImage) {
      Alert.alert('안내', '알약의 앞면과 뒷면 이미지가 모두 필요합니다.');
      return;
    }

    // 상태 업데이트 및 백그라운드 API 검색 시작
    setIsSearching(true);
    let apiError: any = null;

    const searchPromise = (async () => {
      try {
        const searchParam = await extractPillFeatures(front, back);

        logger.info(
          `[IMAGE-SEARCH] Extracted features: ${JSON.stringify(searchParam)}`,
        );
        setSearchParam(searchParam);

        const { totalDataCount, results } = await searchPillData(searchParam);

        return { totalDataCount, results };
      } catch (e) {
        apiError = e;
        return null;
      }
    })();

    // 전면 광고 호출 및 닫힘 대기
    const adPromise = new Promise<void>((resolve) =>
      showInterstitial(() => resolve(), 'IMAGE_SEARCH'),
    );

    await adPromise;

    setIsLoading(true); // 광고가 닫힌 후, API가 아직 끝나지 않았다면 로딩 화면 표시

    const searchData = await searchPromise; // API 완료 대기 (이미 끝났다면 즉시 통과)

    setIsLoading(false);
    setIsSearching(false);

    if (apiError || !searchData) {
      logger.error(
        `[IMAGE-SEARCH] Failed to image search. ${apiError?.stack || apiError}`,
      );

      Alert.alert('오류', '이미지 분석에 실패했습니다.\n다시 시도해 주세요.');

      return;
    }

    // 검색 완료 처리 및 화면 이동
    setSearchResultData(searchData.results);
    setTotalDataCount(searchData.totalDataCount);

    router.push('/pill-search-result-list'); // 검색 완료 후 결과 화면으로 이동

    // 화면 전환 애니메이션을 고려하여 리뷰 요청 지연 처리
    setTimeout(() => {
      requestReview(); // 검색 성공 시 리뷰 요청 (내부 로직에 따라 노출 여부 결정됨)
    }, 500);
  }, [
    pillImages,
    setIsSearching,
    setIsLoading,
    setSearchResultData,
    setSearchParam,
    setTotalDataCount,
    showInterstitial,
  ]);

  // 앞면과 뒷면 이미지가 모두 선택되었는지 여부 확인
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
