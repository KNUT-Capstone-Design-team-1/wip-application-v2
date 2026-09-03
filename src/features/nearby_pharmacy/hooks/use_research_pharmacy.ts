import { useMemo, useCallback } from 'react';
import { Region } from 'react-native-maps';
import { nearbyPharmacyService } from '@features/nearby_pharmacy/services/nearby_pharmacy_service';

// 지도의 이동 거리를 계산하여 '이 위치에서 재검색' 버튼 노출 여부를 제어하는 커스텀 훅 (Presentation Layer)
export const useResearchPharmacy = (
  region: Region | null,
  lastFetchedCenter: { lat: number; lng: number } | null,
  fetchPharmacies: (coords: { x: number; y: number }) => void,
) => {
  // 현재 뷰포트 이동량 기준 재검색 노출 여부 계산
  const shouldResearch = useMemo(() => {
    return nearbyPharmacyService.checkShouldResearch(region, lastFetchedCenter);
  }, [region, lastFetchedCenter]);

  // 현재 지도 중심 위치 기준 재검색 실행 핸들러
  const handleResearchHere = useCallback(() => {
    const hasRegion = Boolean(region);

    if (hasRegion && region) {
      fetchPharmacies({ x: region.longitude, y: region.latitude });
    }
  }, [fetchPharmacies, region]);

  return { shouldResearch, handleResearchHere };
};
