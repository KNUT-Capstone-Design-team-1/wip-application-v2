import { useState, useCallback, RefObject } from 'react';
import MapView from 'react-native-maps';
import { INearbyPharmacies } from '@services/database/types';
import { usePharmacyToast } from '@features/nearby_pharmacy/hooks/use_pharmacy_toast';
import { pharmacyActionService } from '@features/nearby_pharmacy/services/pharmacy_action_service';
import {
  IUsePharmacySelectionReturn,
  TPharmacySelectionState,
} from '@features/nearby_pharmacy/types/nearby_pharmacy_hook_type';
import { getPharmacyCoordinate } from '@features/nearby_pharmacy/utils/map_marker';
import {
  DETAIL_LATITUDE_DELTA,
  DETAIL_LONGITUDE_DELTA,
} from '@features/nearby_pharmacy/constants/map';
import { useAppTrackStore } from '@store/app_track_store';

// 약국 마커 선택 및 클러스터 팝업 상호작용 전담 훅
export const usePharmacySelection = (
  mapRef: RefObject<MapView | null>,
): IUsePharmacySelectionReturn => {
  const { showToast } = usePharmacyToast();

  // 단일 선택 상태 (개별 약국 또는 클러스터 목록 중 단 하나만 활성화)
  const [selection, setSelection] = useState<TPharmacySelectionState>(null);

  // 파생 상태: 선택된 약국 정보
  const selectedPharmacy =
    selection?.type === 'pharmacy' ? selection.pharmacy : null;

  // 파생 상태: 클러스터 약국 목록
  const clusterPharmacies =
    selection?.type === 'cluster' ? selection.pharmacies : null;

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

  // 개별 약국 마커 터치 시 선택 처리
  const handleMarkerPress = useCallback((pharmacy: INearbyPharmacies) => {
    setSelection({
      type: 'pharmacy',
      pharmacy,
    });

    useAppTrackStore.getState().increaseSubActionCount('nearby_pharmacy');
  }, []);

  // 선택된 약국 정보 카드 닫기
  const handleCloseInfoCard = useCallback(() => {
    setSelection(null);
  }, []);

  // 클러스터 마커 터치 시 약국 목록 열기
  const openClusterList = useCallback((list: INearbyPharmacies[]) => {
    setSelection({
      type: 'cluster',
      pharmacies: list,
    });
  }, []);

  // 클러스터 약국 목록 닫기
  const closeClusterList = useCallback(() => {
    setSelection(null);
  }, []);

  // 클러스터 목록에서 특정 약국 선택 시 카메라 이동 및 카드 활성화
  const handleClusterPharmacySelect = useCallback(
    (pharmacy: INearbyPharmacies) => {
      // 클러스터 목록 닫고 해당 약국 카드 활성화
      setSelection({
        type: 'pharmacy',
        pharmacy,
      });

      useAppTrackStore.getState().increaseSubActionCount('nearby_pharmacy');

      const coordinate = getPharmacyCoordinate(pharmacy);

      // 비정상 좌표는 카메라 이동 건너뜀
      if (!coordinate) {
        return;
      }

      // 하단 카드에 가려지지 않도록 오프셋 적용하여 상세 줌 레벨로 이동
      const latOffset = DETAIL_LATITUDE_DELTA * 0.18;

      mapRef.current?.animateToRegion(
        {
          latitude: coordinate.latitude - latOffset,
          longitude: coordinate.longitude,
          latitudeDelta: DETAIL_LATITUDE_DELTA,
          longitudeDelta: DETAIL_LONGITUDE_DELTA,
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
