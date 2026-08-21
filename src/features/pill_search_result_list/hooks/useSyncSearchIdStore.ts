import { useCallback } from 'react';
import { useSearchResultListStore } from '../store/search_result_list_store';
import { useSearchIdStore } from '@features/pill_identification_search/store/search_id_store';

export const useSyncSearchIdStore = () => {
  const { searchParam } = useSearchResultListStore();

  const syncToSearchIdStore = useCallback(() => {
    if (!searchParam) return;

    const store = useSearchIdStore.getState();

    // 초기화
    store.resetSelectedSearchId();

    // 텍스트 매칭
    if (searchParam.PRINT_FRONT_EXACTLY) {
      store.setSideLabelFrontText(searchParam.PRINT_FRONT_EXACTLY);
      store.setIsExactMatch(true);
    } else if (searchParam.PRINT_FRONT) {
      store.setSideLabelFrontText(searchParam.PRINT_FRONT);
    }

    if (searchParam.PRINT_BACK_EXACTLY) {
      store.setSideLabelBackText(searchParam.PRINT_BACK_EXACTLY);
      store.setIsExactMatch(true);
    } else if (searchParam.PRINT_BACK) {
      store.setSideLabelBackText(searchParam.PRINT_BACK);
    }

    // 이름, 제조사 등
    if (searchParam.ITEM_NAME) store.setProductNameText(searchParam.ITEM_NAME);
    if (searchParam.ENTP_NAME) store.setCompanyName(searchParam.ENTP_NAME);

    // 배열 조건들
    if (searchParam.FORM_CODE && searchParam.FORM_CODE.length > 0) {
      store.setManufacturerName(searchParam.FORM_CODE);
    }

    const lines = Array.from(
      new Set([
        ...(searchParam.LINE_FRONT || []),
        ...(searchParam.LINE_BACK || []),
      ]),
    );
    if (lines.length > 0) store.setDividerLineData(lines);

    if (searchParam.DRUG_SHAPE && searchParam.DRUG_SHAPE.length > 0) {
      store.setShape(searchParam.DRUG_SHAPE);
    }

    // 색상
    const colors = Array.from(
      new Set([
        ...(searchParam.COLOR_CLASS1 || []),
        ...(searchParam.COLOR_CLASS2 || []),
      ]),
    );
    if (colors.length > 0) store.setColors(colors);

    // 마크
    if (searchParam.MARK_CODE_FRONT)
      store.setMarkCodeFront(searchParam.MARK_CODE_FRONT);
    if (searchParam.MARK_CODE_BACK)
      store.setMarkCodeBack(searchParam.MARK_CODE_BACK);
  }, [searchParam]);

  return { syncToSearchIdStore };
};
