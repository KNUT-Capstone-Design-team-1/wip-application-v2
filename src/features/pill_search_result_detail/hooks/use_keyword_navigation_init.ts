import { useEffect } from 'react';
import type { IPillDetail } from '../types/pill_detail_type';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 약 변경 시 검색 상태와 진행 중인 이동을 초기화한다.
export const useKeywordNavigationInit = (data: IPillDetail | null) => {
  const { store, controller } = useKeywordNavigationContext();

  useEffect(() => {
    controller.reset();

    store.getState().setVisible(false);
    store.getState().setSearchOpen(false);
    store.getState().setSearchQuery('');

    return controller.cancel;
  }, [store, controller, data?.ITEM_SEQ]);
};
