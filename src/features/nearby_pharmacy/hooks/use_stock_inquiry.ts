import { useCallback, useRef } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { usePharmacyCall } from '@features/nearby_pharmacy/hooks/use_pharmacy_call';
import { useCommonModalStore } from '@store/common_modal_store';
import {
  STOCK_INQUIRY_ROUTE,
  STOCK_INQUIRY_MODAL,
  CALL_BACK_NAV_DELAY_MS,
} from '@features/nearby_pharmacy/constants/stock_inquiry';

// 재고 문의 안내 공통 모달 팝업 실행 함수
export const openStockInquiryModal = () => {
  useCommonModalStore.getState().showModal({
    ...STOCK_INQUIRY_MODAL,
    // 모달 확인 버튼 클릭 시 재고 문의 화면으로 이동
    onConfirm: () => {
      router.push({
        pathname: STOCK_INQUIRY_ROUTE,
        params: { stockInquiry: 'true' },
      });
    },
  });
};

// 재고 문의 모드 제어 및 전화 연결 커스텀 훅 (Presentation Layer)
export const useStockInquiry = () => {
  const params = useLocalSearchParams<{ stockInquiry?: string }>();
  const isStockInquiryMode = params.stockInquiry === 'true';
  const { callPharmacy } = usePharmacyCall();

  // 중복 전화 걸기 방지 플래그
  const callingRef = useRef(false);

  // 약국 선택 시 원래 화면 복귀 후 전화 앱 실행 핸들러
  const handleStockInquiryCall = useCallback(
    (telephone: string) => {
      const isAlreadyCalling = callingRef.current;

      if (isAlreadyCalling) {
        return;
      }

      callingRef.current = true;

      // 이전 화면으로 복귀
      router.back();

      // 화면 전환 완료 후 전화 앱 실행
      setTimeout(() => {
        callPharmacy(telephone);
        callingRef.current = false;
      }, CALL_BACK_NAV_DELAY_MS);
    },
    [callPharmacy],
  );

  return {
    isStockInquiryMode,
    handleStockInquiryCall,
  };
};
