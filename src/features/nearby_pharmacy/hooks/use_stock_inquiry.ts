import { useCallback, useRef } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { usePharmacyCall } from '@features/nearby_pharmacy/hooks/use_pharmacy_call';
import { useCommonModalStore } from '@store/common_modal_store';
import {
  STOCK_INQUIRY_ROUTE,
  STOCK_INQUIRY_MODAL,
} from '@features/nearby_pharmacy/constants/stock_inquiry';

export interface IStockInquiryPillContext {
  seq?: string;
  name?: string;
  entpName?: string;
  className?: string;
  image?: string;
}

// 재고 문의 안내 공통 모달 팝업 실행 함수
export const openStockInquiryModal = (
  pillContext?: IStockInquiryPillContext,
) => {
  useCommonModalStore.getState().showModal({
    ...STOCK_INQUIRY_MODAL,
    // 모달 확인 버튼 클릭 시 재고 문의 화면으로 이동
    onConfirm: () => {
      router.push({
        pathname: STOCK_INQUIRY_ROUTE,
        params: {
          stockInquiry: 'true',
          pillSeq: pillContext?.seq || '',
          pillName: pillContext?.name || '',
          pillEntpName: pillContext?.entpName || '',
          pillClassName: pillContext?.className || '',
          pillImage: pillContext?.image || '',
        },
      });
    },
  });
};

// 재고 문의 모드 제어 및 전화 연결 커스텀 훅 (Presentation Layer)
export const useStockInquiry = () => {
  const params = useLocalSearchParams<{
    stockInquiry?: string;
    pillSeq?: string;
    pillName?: string;
    pillEntpName?: string;
    pillClassName?: string;
    pillImage?: string;
  }>();
  const isStockInquiryMode = params.stockInquiry === 'true';
  const pillContext: IStockInquiryPillContext = {
    seq: params.pillSeq,
    name: params.pillName,
    entpName: params.pillEntpName,
    className: params.pillClassName,
    image: params.pillImage,
  };

  const { callPharmacy } = usePharmacyCall();

  // 중복 전화 걸기 방지 플래그
  const callingRef = useRef(false);

  // 약국 선택 시 전화 앱 실행 핸들러
  const handleStockInquiryCall = useCallback(
    (telephone: string) => {
      const isAlreadyCalling = callingRef.current;

      if (isAlreadyCalling) {
        return;
      }

      callingRef.current = true;
      callPharmacy(telephone);
      callingRef.current = false;
    },
    [callPharmacy],
  );

  return {
    isStockInquiryMode,
    pillContext,
    handleStockInquiryCall,
  };
};
