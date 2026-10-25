import { useCallback } from 'react';
import { openStockInquiryModal } from '@features/nearby_pharmacy/hooks/use_stock_inquiry';
import { usePillDetailContext } from './use_pill_detail_context';

// 클릭 시 최신 알약 정보로 재고 문의.
export const usePillStockInquiryActions = () => {
  const store = usePillDetailContext();

  const onStockInquiry = useCallback(() => {
    const { pillData: data, image } = store.getState();

    const hasNoData = !data;

    if (hasNoData) {
      return;
    }

    openStockInquiryModal({
      seq: data.ITEM_SEQ,
      name: data.ITEM_NAME,
      entpName: data.ENTP_NAME,
      className: data.CLASS_NAME,
      image: image || data.ITEM_IMAGE,
    });
  }, [store]);

  return { onStockInquiry };
};
