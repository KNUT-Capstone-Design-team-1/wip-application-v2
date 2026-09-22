import React, { useState, useMemo, useCallback } from 'react';
import { useToast } from '@hooks/use_toast';
import { INearbyPharmacies } from '@services/database/types';
import { isPharmacyOpenNow } from '@features/nearby_pharmacy/utils/business_hours';

// 영업 중 필터링 상태 및 토글 로직을 관리하는 커스텀 훅
export const usePharmacyOpenFilter = (
  pharmacies: INearbyPharmacies[],
  selectedPharmacy: INearbyPharmacies | null,
  onDeselectPharmacy: () => void,
) => {
  const { showToast } = useToast();
  const [isOpenOnly, setIsOpenOnly] = useState(false);

  // 필터 조건(지금 열려있는 약국)이 적용된 약국 목록 계산
  const displayedPharmacies = useMemo(() => {
    if (!isOpenOnly) {
      return pharmacies;
    }

    return pharmacies.filter((pharmacy) => {
      return isPharmacyOpenNow(pharmacy.openTime, pharmacy.closeTime);
    });
  }, [pharmacies, isOpenOnly]);

  // 선택된 약국이 닫혀있으면 선택 해제
  const deselectIfClosed = useCallback(() => {
    if (!selectedPharmacy) {
      return;
    }

    const isOpen = isPharmacyOpenNow(
      selectedPharmacy.openTime,
      selectedPharmacy.closeTime,
    );

    if (!isOpen) {
      onDeselectPharmacy();
    }
  }, [selectedPharmacy, onDeselectPharmacy]);

  // 지금 열려있는 약국만 보기 체크박스 토글 핸들러
  const handleToggleOpenOnly = useCallback(() => {
    setIsOpenOnly((prev) => {
      const nextValue = !prev;

      if (nextValue) {
        deselectIfClosed();

        const openPharmacies = pharmacies.filter((p) =>
          isPharmacyOpenNow(p.openTime, p.closeTime),
        );

        if (openPharmacies.length === 0) {
          showToast({
            type: 'default',
            message: '현재 영업 중인 주변 약국이 없습니다.',
          });
        } else {
          showToast({
            type: 'default',
            message: `영업 중인 약국 ${openPharmacies.length}곳을 표시합니다.`,
          });
        }
      } else {
        showToast({
          type: 'default',
          message: '전체 약국을 표시합니다.',
        });
      }

      return nextValue;
    });
  }, [deselectIfClosed, pharmacies, showToast]);

  return {
    isOpenOnly,
    displayedPharmacies,
    handleToggleOpenOnly,
  };
};
