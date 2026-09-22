import { useMemo, useCallback } from 'react';
import { Region } from 'react-native-maps';
import { nearbyPharmacyService } from '@features/nearby_pharmacy/services/nearby_pharmacy_service';
import {
  ILastFetchedCenter,
  IPharmacySearchCoordinates,
} from '@features/nearby_pharmacy/types/pharmacy_domain_type';
import { IUseResearchPharmacyReturn } from '@features/nearby_pharmacy/types/nearby_pharmacy_hook_type';

// 지도의 이동 거리를 계산하여 '이 위치에서 재검색' 버튼 노출 여부를 제어하는 훅
export const useResearchPharmacy = (
  region: Region | null,
  lastFetchedCenter: ILastFetchedCenter | null,
  fetchPharmacies: (coords: IPharmacySearchCoordinates) => void,
  onResetSelection?: () => void,
): IUseResearchPharmacyReturn => {
  // 현재 뷰포트 이동량 기준 재검색 노출 여부 계산
  const shouldResearch = useMemo(() => {
    return nearbyPharmacyService.checkShouldResearch(region, lastFetchedCenter);
  }, [region, lastFetchedCenter]);

  // 현재 지도 중심 위치 기준 재검색 실행 핸들러 (이전 선택 정보 초기화 포함)
  const handleResearchHere = useCallback(() => {
    if (region) {
      onResetSelection?.();
      fetchPharmacies({ x: region.longitude, y: region.latitude });
    }
  }, [fetchPharmacies, onResetSelection, region]);

  return { shouldResearch, handleResearchHere };
};
