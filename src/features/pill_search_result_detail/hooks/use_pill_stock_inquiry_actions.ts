import { useCallback } from 'react';
import { openStockInquiryModal } from '@features/nearby_pharmacy/hooks/use_stock_inquiry';
import { IPillDetail } from '../types/pill_detail_type';

// 재고 문의 명령 제공.
export const usePillStockInquiryActions = (
  data: IPillDetail,
  image?: string,
) => {
  const onStockInquiry = useCallback(
    () =>
      openStockInquiryModal({
        seq: data.ITEM_SEQ,
        name: data.ITEM_NAME,
        entpName: data.ENTP_NAME,
        className: data.CLASS_NAME,
        image: image || data.ITEM_IMAGE,
      }),
    [
      data.ITEM_SEQ,
      data.ITEM_NAME,
      data.ENTP_NAME,
      data.CLASS_NAME,
      data.ITEM_IMAGE,
      image,
    ],
  );

  return { onStockInquiry };
};
