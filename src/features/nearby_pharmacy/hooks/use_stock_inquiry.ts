import { useCallback, useRef } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { usePharmacyCall } from '@features/nearby_pharmacy/hooks/use_pharmacy_call';
import { useCommonModalStore } from '@store/common_modal_store';
import {
  STOCK_INQUIRY_ROUTE,
  STOCK_INQUIRY_MODAL,
  CALL_BACK_NAV_DELAY_MS,
} from '@features/nearby_pharmacy/constants/stock_inquiry';

// 재고 문의 안내 공통 모달 팝업 실행
export const openStockInquiryModal = () => {
  useCommonModalStore.getState().showModal({
    ...STOCK_INQUIRY_MODAL,
    onConfirm: () => {
      router.push({
        pathname: STOCK_INQUIRY_ROUTE,
        params: { stockInquiry: 'true' },
      });
    },
  });
};

// 재고 문의 모드 후 복귀 및 전화 연결 훅
export const useStockInquiry = () => {
  const params = useLocalSearchParams<{ stockInquiry?: string }>();
  const isStockInquiryMode = params.stockInquiry === 'true';
  const { callPharmacy } = usePharmacyCall();

  // 전화 실행 중복 방지
  const callingRef = useRef(false);

  // 약국 선택 시 원래 화면 복귀 후 전화 앱 실행
  const handleStockInquiryCall = useCallback(
    (telephone: string) => {
      const isAlreadyCalling = callingRef.current;

      if (isAlreadyCalling) {
        return;
      }

      callingRef.current = true;

      // 원래 화면으로 복귀
      router.back();

      // 화면 전환 후 전화 앱 실행
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
