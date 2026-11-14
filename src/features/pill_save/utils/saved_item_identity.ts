// 의약품 품목번호와 영양제 품목제조신고번호가 겹쳐도 저장 항목을 구분한다.
export const FUNCTIONAL_FOOD_ITEM_PREFIX = 'functional-food:';

export const getFunctionalFoodItemSeq = (reportNumber: string) =>
  FUNCTIONAL_FOOD_ITEM_PREFIX + reportNumber;

export const getFunctionalFoodReportNumber = (itemSeq: string) =>
  itemSeq.startsWith(FUNCTIONAL_FOOD_ITEM_PREFIX)
    ? itemSeq.slice(FUNCTIONAL_FOOD_ITEM_PREFIX.length)
    : null;
