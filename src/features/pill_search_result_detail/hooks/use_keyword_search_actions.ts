import { useCallback } from 'react';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 키워드 터치 명령은 구독 없이 최신 상세 화면의 검색 요청으로 전달한다.
export const useKeywordSearchActions = () => {
  const { store } = useKeywordNavigationContext();

  const requestSearch = useCallback(
    (keyword: string) => {
      store.getState().requestSearch(keyword);
    },
    [store],
  );

  return { requestSearch };
};
