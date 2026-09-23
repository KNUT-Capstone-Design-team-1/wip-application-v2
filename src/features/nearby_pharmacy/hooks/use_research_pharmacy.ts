import { useMemo, useCallback, useRef } from 'react';
import { Region } from 'react-native-maps';
import { nearbyPharmacyService } from '@features/nearby_pharmacy/services/nearby_pharmacy_service';
import { usePharmacyToast } from '@features/nearby_pharmacy/hooks/use_pharmacy_toast';
import { usePharmacyCurrentTime } from '@features/nearby_pharmacy/hooks/use_pharmacy_current_time';
import { isPharmacyOpenNow } from '@features/nearby_pharmacy/utils/business_hours';
import {
  ILastFetchedCenter,
  IPharmacySearchCoordinates,
} from '@features/nearby_pharmacy/types/pharmacy_domain_type';
import { IUseResearchPharmacyReturn } from '@features/nearby_pharmacy/types/nearby_pharmacy_hook_type';
import { INearbyPharmacies } from '@services/database/types';
import { PHARMACY_TOAST_MESSAGES } from '@features/nearby_pharmacy/constants/ui';

// 지도의 이동 거리를 계산하여 '현재 지도에서 검색' 버튼 노출 여부 및 재검색을 제어하는 훅
export const useResearchPharmacy = (
  region: Region | null,
  lastFetchedCenter: ILastFetchedCenter | null,
  fetchPharmacies: (
    coords: IPharmacySearchCoordinates,
  ) => Promise<INearbyPharmacies[] | undefined> | Promise<void>,
  onResetSelection?: () => void,
  isOpenOnly = false,
): IUseResearchPharmacyReturn => {
  // 토스트 메시지 훅
  const { showToast } = usePharmacyToast();

  // 현재 시각 구독 (영업 상태 실시간 판별)
  const currentTime = usePharmacyCurrentTime();

  // 비동기 응답 시점의 최신 isOpenOnly 필터 상태 참조
  const isOpenOnlyRef = useRef(isOpenOnly);
  isOpenOnlyRef.current = isOpenOnly;

  // 현재 뷰포트 이동량 기준 재검색 노출 여부 계산
  const shouldResearch = useMemo(() => {
    return nearbyPharmacyService.checkShouldResearch(region, lastFetchedCenter);
  }, [region, lastFetchedCenter]);

  // 현재 지도 중심 위치 기준 재검색 실행 핸들러 (이전 선택 정보 초기화 포함)
  const handleResearchHere = useCallback(async () => {
    if (region) {
      onResetSelection?.();
      const result = await fetchPharmacies({
        x: region.longitude,
        y: region.latitude,
      });

      // '영업 중인 약국만 표시' 필터가 활성화된 상태에서 표시할 영업 중인 약국이 없으면 안내 토스트 출력
      if (isOpenOnlyRef.current && result) {
        const hasOpenPharmacy = result.some((pharmacy) =>
          isPharmacyOpenNow(pharmacy.openTime, pharmacy.closeTime, currentTime),
        );

        if (!hasOpenPharmacy) {
          showToast({
            type: 'default',
            message: PHARMACY_TOAST_MESSAGES.NO_OPEN_PHARMACY,
          });
        }
      }
    }
  }, [currentTime, fetchPharmacies, onResetSelection, region, showToast]);

  return { shouldResearch, handleResearchHere };
};
