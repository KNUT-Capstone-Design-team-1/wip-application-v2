import { useMemo, useCallback } from 'react';
import { Region } from 'react-native-maps';
import {
  KM_PER_LAT_DEGREE,
  KM_PER_LON_DEGREE,
  RESEARCH_DISPLACEMENT_RATIO,
  RESEARCH_MAX_DISPLACEMENT_KM,
} from '@features/nearby_pharmacy/constants/nearby_pharmacy';

// 지도의 이동 거리를 계산하여 '이 위치에서 재검색' 버튼 노출 여부를 제어하는 커스텀 훅
export const useResearchPharmacy = (
  region: Region | null,
  lastFetchedCenter: { lat: number; lng: number } | null,
  fetchPharmacies: (coords: { x: number; y: number }) => void,
) => {
  const shouldResearch = useMemo(() => {
    const isMissingCenterOrRegion = !lastFetchedCenter || !region;

    if (isMissingCenterOrRegion) {
      return false;
    }

    const displacementKm = Math.max(
      Math.abs(region.latitude - lastFetchedCenter.lat) * KM_PER_LAT_DEGREE,
      Math.abs(region.longitude - lastFetchedCenter.lng) * KM_PER_LON_DEGREE,
    );

    const visibleHeightKm = region.latitudeDelta * KM_PER_LAT_DEGREE;

    const thresholdKm = Math.min(
      visibleHeightKm * RESEARCH_DISPLACEMENT_RATIO,
      RESEARCH_MAX_DISPLACEMENT_KM,
    );

    return displacementKm > thresholdKm;
  }, [region, lastFetchedCenter]);

  // 현재 지도 중심 위치 기준 재검색 실행
  const handleResearchHere = useCallback(() => {
    const hasRegion = Boolean(region);

    if (hasRegion && region) {
      fetchPharmacies({ x: region.longitude, y: region.latitude });
    }
  }, [fetchPharmacies, region]);

  return { shouldResearch, handleResearchHere };
};
