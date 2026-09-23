import { useState, useMemo, useCallback } from 'react';
import { usePharmacyToast } from '@features/nearby_pharmacy/hooks/use_pharmacy_toast';
import { INearbyPharmacies } from '@services/database/types';
import { isPharmacyOpenNow } from '@features/nearby_pharmacy/utils/business_hours';
import { usePharmacyCurrentTime } from '@features/nearby_pharmacy/hooks/use_pharmacy_current_time';
import { IUsePharmacyOpenFilterReturn } from '@features/nearby_pharmacy/types/nearby_pharmacy_hook_type';
import { PHARMACY_TOAST_MESSAGES } from '@features/nearby_pharmacy/constants/ui';

// 영업 중인 약국 필터링 상태 및 토글 로직을 관리하는 커스텀 훅
export const usePharmacyOpenFilter = (
  pharmacies: INearbyPharmacies[],
  onDeselectPharmacy: () => void,
): IUsePharmacyOpenFilterReturn => {
  // 주변 약국 전용 위치가 적용된 토스트 노출 훅
  const { showToast } = usePharmacyToast();

  // 1분 단위 및 포커스 복귀 시 갱신되는 현재 시각 구독
  const currentTime = usePharmacyCurrentTime();

  // '영업 중인 약국만 표시' 필터 활성화 여부 상태
  const [isOpenOnly, setIsOpenOnly] = useState(false);

  // 필터 조건(영업 중인 약국만 표시)이 적용된 약국 목록 계산 (currentTime 변화에 따라 자동 재계산)
  const displayedPharmacies = useMemo(() => {
    // 필터 미적용 시 전체 약국 반환
    if (!isOpenOnly) {
      return pharmacies;
    }

    // 현재 영업 중인 약국만 필터링하여 반환
    return pharmacies.filter((pharmacy) => {
      return isPharmacyOpenNow(
        pharmacy.openTime,
        pharmacy.closeTime,
        currentTime,
      );
    });
  }, [pharmacies, isOpenOnly, currentTime]);

  // 영업 중인 약국만 표시 체크박스 토글 핸들러
  const handleToggleOpenOnly = useCallback(() => {
    setIsOpenOnly((prev) => {
      const nextValue = !prev;

      // 필터 변경 시 기존 선택 카드 및 클러스터 목록 닫기
      onDeselectPharmacy();

      if (nextValue) {
        // 현재 영업 중인 약국 수 계산
        const openPharmacies = pharmacies.filter((p) =>
          isPharmacyOpenNow(p.openTime, p.closeTime, currentTime),
        );

        if (openPharmacies.length === 0) {
          showToast({
            type: 'default',
            message: PHARMACY_TOAST_MESSAGES.NO_OPEN_PHARMACY,
          });
        } else {
          showToast({
            type: 'default',
            message: PHARMACY_TOAST_MESSAGES.OPEN_PHARMACY_COUNT(
              openPharmacies.length,
            ),
          });
        }
      } else {
        showToast({
          type: 'default',
          message: PHARMACY_TOAST_MESSAGES.ALL_PHARMACIES,
        });
      }

      return nextValue;
    });
  }, [onDeselectPharmacy, pharmacies, currentTime, showToast]);

  return {
    isOpenOnly,
    displayedPharmacies,
    handleToggleOpenOnly,
  };
};
