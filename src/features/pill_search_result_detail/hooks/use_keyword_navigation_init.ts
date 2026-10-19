import { useEffect } from 'react';
import type { IPillDetail } from '../types/pill_detail_type';
import { collectPillWarningKeywords } from '../utils/pill_warning_keywords';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 약 변경·문서 로딩 시 검색 상태 초기화.
export const useKeywordNavigationInit = (data: IPillDetail | null) => {
  const { store, controller } = useKeywordNavigationContext();

  useEffect(() => {
    controller.reset();
    store.getState().setVisible(false);

    return controller.cancel;
  }, [store, controller, data?.ITEM_SEQ]);

  useEffect(() => {
    store.getState().setKeywords(collectPillWarningKeywords(data));
  }, [store, data]);
};
