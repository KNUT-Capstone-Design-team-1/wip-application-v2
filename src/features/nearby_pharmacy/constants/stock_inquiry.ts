export const STOCK_INQUIRY_ROUTE = '/nearby-pharmacy-inquiry' as const;

export const STOCK_INQUIRY_MODAL = {
  title: '약국 재고 문의',
  message:
    '약국에 재고를 문의하시겠습니까?\n\n확인을 누르면 주변 약국을 탐색하고 전화를 통해 재고를 문의하실 수 있습니다.',
  confirmText: '확인',
  cancelText: '취소',
} as const;

export const CALL_BACK_NAV_DELAY_MS = 500;
