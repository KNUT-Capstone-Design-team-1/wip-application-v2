import { useState, useMemo, useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { usePharmacyToast } from '@features/nearby_pharmacy/hooks/use_pharmacy_toast';
import { INearbyPharmacies } from '@services/database/types';
import { isPharmacyOpenNow } from '@features/nearby_pharmacy/utils/business_hours';

// 영업 중인 약국 필터링 상태 및 토글 로직을 관리하는 커스텀 훅
export const usePharmacyOpenFilter = (
  pharmacies: INearbyPharmacies[],
  onDeselectPharmacy: () => void,
) => {
  // 주변 약국 전용 위치가 적용된 토스트 노출 훅
  const { showToast } = usePharmacyToast();

  // '영업중인 약국만 표시' 필터 활성화 여부 상태
  const [isOpenOnly, setIsOpenOnly] = useState(false);

  // 시간 경과에 따른 실시간 영업 상태 갱신용 타임스탬프 상태
  const [minuteTick, setMinuteTick] = useState(Date.now());

  // 1분 주기 갱신 및 앱 포그라운드 복귀 시 영업 상태 재연산
  useEffect(() => {
    const timer = setInterval(() => {
      setMinuteTick(Date.now());
    }, 60000);

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const isForeground = nextAppState === 'active';

      if (isForeground) {
        setMinuteTick(Date.now());
      }
    });

    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);

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
  }, [pharmacies, isOpenOnly, minuteTick]);

  // 영업중인 약국만 표시 체크박스 토글 핸들러
  const handleToggleOpenOnly = useCallback(() => {
    // 체크 또는 체크 해제 시 마커 선택 해제
    onDeselectPharmacy();

    const nextValue = !isOpenOnly;
    setIsOpenOnly(nextValue);

    // 필터 활성화 시 처리
    if (nextValue) {
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
  }, [isOpenOnly, onDeselectPharmacy, pharmacies, showToast]);

  return {
    isOpenOnly,
    displayedPharmacies,
    handleToggleOpenOnly,
  };
};
