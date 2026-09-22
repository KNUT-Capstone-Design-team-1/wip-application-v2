import { useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { usePharmacyToast } from '@features/nearby_pharmacy/hooks/use_pharmacy_toast';
import { usePharmacySearch } from '@features/nearby_pharmacy/hooks/use_pharmacy_search';
import { usePharmacyLocation } from '@features/nearby_pharmacy/hooks/use_pharmacy_location';
import { usePharmacySelection } from '@features/nearby_pharmacy/hooks/use_pharmacy_selection';
import { NEARBY_PHARMACY_RADIUS_KM } from '@features/nearby_pharmacy/constants/nearby_pharmacy';

// 주변 약국 화면의 상태와 로직을 조율하는 통합 커스텀 훅 (Facade)
export const useNearbyPharmacy = () => {
  // 토스트 메시지 표시 훅
  const { showToast } = usePharmacyToast();

  // 최초 진입 시 위치 초기화 완료 여부 플래그
  const isInitializedRef = useRef(false);

  // 1. 약국 검색 및 데이터 상태 관리 훅
  const { pharmacies, loading, lastFetchedCenter, fetchPharmacies } =
    usePharmacySearch();

  // 2. 지도 위치 및 권한 관리 훅 (위치 확인 시 fetchPharmacies 자동 연동)
  const { location, initialRegion, mapRef, handleLocate, initializeLocation } =
    usePharmacyLocation(fetchPharmacies);

  // 3. 약국 마커 선택 및 클러스터 인터랙션 훅
  const {
    selectedPharmacy,
    clusterPharmacies,
    handleCopy,
    handleMarkerPress,
    handleCloseInfoCard,
    openClusterList,
    closeClusterList,
    handleClusterPharmacySelect,
  } = usePharmacySelection(mapRef);

  // 화면 진입 시 최초 1회만 위치 초기화 및 안내 토스트 표시 (탭 전환 시 중복 실행 방지)
  useFocusEffect(
    useCallback(() => {
      // 이미 초기화된 상태면 재실행 방지 early return
      if (isInitializedRef.current) {
        return;
      }

      isInitializedRef.current = true;

      // 위치 기반 서비스 파이프라인 가동
      initializeLocation();

      // 탐색 반경 안내 토스트 출력
      showToast({
        message: `${NEARBY_PHARMACY_RADIUS_KM}km 이내 약국만 표시됩니다`,
      });
    }, [initializeLocation, showToast]),
  );

  return {
    // 지도 및 뷰포트 상태
    mapRef,
    initialRegion,
    location,

    // 약국 데이터 및 로딩
    pharmacies,
    loading,
    lastFetchedCenter,
    fetchPharmacies,

    // 선택된 약국 및 클러스터 상태
    selectedPharmacy,
    clusterPharmacies,

    // 사용자 조작 핸들러
    handleLocate,
    handleCopy,
    handleMarkerPress,
    handleCloseInfoCard,
    openClusterList,
    closeClusterList,
    handleClusterPharmacySelect,

    // 수동 위치 새로고침 함수
    refreshLocation: initializeLocation,
  };
};

export default useNearbyPharmacy;
