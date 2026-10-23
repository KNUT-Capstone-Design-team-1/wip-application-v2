import { useEffect } from 'react';
import type { IPillDetail } from '../types/pill_detail_type';
import { collectPillWarningKeywords } from '../utils/pill_warning_keywords';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 약 변경 시 검색 초기화, 데이터 갱신 시 경고 키워드 반영.
export const useKeywordNavigationInit = (data: IPillDetail | null) => {
  const { store, controller } = useKeywordNavigationContext();

  useEffect(() => {
    controller.reset();

    store.getState().setVisible(false);
    store.getState().setSearchOpen(false);
    store.getState().setSearchQuery('');

    return controller.cancel;
  }, [store, controller, data?.ITEM_SEQ]);

  useEffect(() => {
    const keywords = collectPillWarningKeywords(data);

    const { warningKeywords, setKeywords } = store.getState();

    const hasSameKeywords =
      keywords.length === warningKeywords.length &&
      keywords.every((keyword, index) => keyword === warningKeywords[index]);

    // 동일한 목록을 다시 설정하면 표 WebView까지 재로딩되므로 생략한다.
    if (hasSameKeywords) {
      return;
    }

    setKeywords(keywords);
  }, [store, data]);
};
