import { useState, useMemo, useCallback } from 'react';
import { usePharmacyToast } from '@features/nearby_pharmacy/hooks/use_pharmacy_toast';
import { INearbyPharmacies } from '@services/database/types';
import { isPharmacyOpenNow } from '@features/nearby_pharmacy/utils/business_hours';

// 영업 중인 약국 필터링 상태 및 토글 로직을 관리하는 커스텀 훅
export const usePharmacyOpenFilter = (
  pharmacies: INearbyPharmacies[],
  selectedPharmacy: INearbyPharmacies | null,
  onDeselectPharmacy: () => void,
) => {
  // 주변 약국 전용 위치가 적용된 토스트 노출 훅
  const { showToast } = usePharmacyToast();

  // '영업중인 약국만 표시' 필터 활성화 여부 상태
  const [isOpenOnly, setIsOpenOnly] = useState(false);

  // 필터 조건(영업중인 약국만 표시)이 적용된 약국 목록 계산
  const displayedPharmacies = useMemo(() => {
    // 필터 미적용 시 전체 약국 반환
    if (!isOpenOnly) {
      return pharmacies;
    }

    // 현재 영업 중인 약국만 필터링하여 반환
    return pharmacies.filter((pharmacy) => {
      return isPharmacyOpenNow(pharmacy.openTime, pharmacy.closeTime);
    });
  }, [pharmacies, isOpenOnly]);

  // 선택된 약국이 닫혀있는 경우 선택 상태 해제
  const deselectIfClosed = useCallback(() => {
    // 선택된 약국이 없는 경우 조기 종료
    if (!selectedPharmacy) {
      return;
    }

    // 선택된 약국의 영업 상태 확인
    const isOpen = isPharmacyOpenNow(
      selectedPharmacy.openTime,
      selectedPharmacy.closeTime,
    );

    // 영업 중이 아니면 상세 카드 닫기
    if (!isOpen) {
      onDeselectPharmacy();
    }
  }, [selectedPharmacy, onDeselectPharmacy]);

  // 영업중인 약국만 표시 체크박스 토글 핸들러
  const handleToggleOpenOnly = useCallback(() => {
    setIsOpenOnly((prev) => {
      const nextValue = !prev;

      // 필터 활성화 시 처리
      if (nextValue) {
        deselectIfClosed();

        // 현재 영업 중인 약국 수 계산
        const openPharmacies = pharmacies.filter((p) =>
          isPharmacyOpenNow(p.openTime, p.closeTime),
        );

        // 영업 중인 약국 수에 따른 안내 토스트 메시지 노출
        if (openPharmacies.length === 0) {
          showToast({
            type: 'default',
            message: '현재 영업중인 주변 약국이 없습니다.',
          });
        } else {
          showToast({
            type: 'default',
            message: `영업중인 약국 ${openPharmacies.length}곳을 표시합니다.`,
          });
        }
      } else {
        // 필터 해제 시 전체 약국 표시 안내 토스트 노출
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
