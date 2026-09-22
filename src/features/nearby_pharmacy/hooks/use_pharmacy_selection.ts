import { useState, useCallback, RefObject } from 'react';
import MapView from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';
import { usePharmacyToast } from '@features/nearby_pharmacy/hooks/use_pharmacy_toast';
import { pharmacyActionService } from '@features/nearby_pharmacy/services/pharmacy_action_service';
import { IUsePharmacySelectionReturn } from '@features/nearby_pharmacy/types/nearby_pharmacy_hook_type';
import { useAppTrackStore } from '@store/app_track_store';

// 약국 마커 선택 및 클러스터 팝업 상호작용을 전담하는 커스텀 훅
export const usePharmacySelection = (
  mapRef: RefObject<MapView | null>,
): IUsePharmacySelectionReturn => {
  // 토스트 메시지 훅
  const { showToast } = usePharmacyToast();

  // 현재 지도에서 선택된 개별 약국
  const [selectedPharmacy, setSelectedPharmacy] =
    useState<INearbyPharmacies | null>(null);

  // 클러스터 클릭 시 모달/바텀시트에 노출할 약국 목록
  const [clusterPharmacies, setClusterPharmacies] = useState<
    INearbyPharmacies[] | null
  >(null);

  // 약국 정보 클립보드 복사 핸들러
  const handleCopy = useCallback(
    async (text: string) => {
      const isSuccess = await pharmacyActionService.copyText(text);

      if (isSuccess) {
        showToast({
          message: '복사되었습니다.',
        });
      }
    },
    [showToast],
  );

  // 지도 위의 개별 약국 마커 터치 시 선택 처리
  const handleMarkerPress = useCallback((pharmacy: INearbyPharmacies) => {
    setClusterPharmacies(null);

    setSelectedPharmacy(pharmacy);

    useAppTrackStore.getState().increaseSubActionCount('nearby_pharmacy');
  }, []);

  // 선택된 약국 정보 카드 닫기
  const handleCloseInfoCard = useCallback(() => {
    setSelectedPharmacy(null);
  }, []);

  // 클러스터 마커 터치 시 약국 목록 열기
  const openClusterList = useCallback((list: INearbyPharmacies[]) => {
    setClusterPharmacies(list);

    setSelectedPharmacy(null);
  }, []);

  // 클러스터 약국 목록 닫기
  const closeClusterList = useCallback(() => {
    setClusterPharmacies(null);
  }, []);

  // 클러스터 목록에서 특정 약국을 탭했을 때 카메라 이동 및 선택
  const handleClusterPharmacySelect = useCallback(
    (pharmacy: INearbyPharmacies) => {
      const lat = parseFloat(pharmacy.Y);
      const lng = parseFloat(pharmacy.X);

      // 클러스터 목록 닫고 해당 약국 카드 활성화
      setClusterPharmacies(null);

      setSelectedPharmacy(pharmacy);

      useAppTrackStore.getState().increaseSubActionCount('nearby_pharmacy');

      // 좌표 유효성 검증
      const isValidCoords =
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180;

      // 비정상 좌표는 카메라 이동 건너뛰기 (early return)
      if (!isValidCoords) {
        return;
      }

      const latitudeDelta = 0.005;
      const longitudeDelta = 0.005;
      const latOffset = latitudeDelta * 0.15;

      // 선택된 약국 위치로 카메라 줌인 애니메이션
      mapRef.current?.animateToRegion(
        {
          latitude: lat - latOffset,
          longitude: lng,
          latitudeDelta,
          longitudeDelta,
        },
        400,
      );
    },
    [mapRef],
  );

  return {
    selectedPharmacy,
    clusterPharmacies,
    handleCopy,
    handleMarkerPress,
    handleCloseInfoCard,
    openClusterList,
    closeClusterList,
    handleClusterPharmacySelect,
  };
};
