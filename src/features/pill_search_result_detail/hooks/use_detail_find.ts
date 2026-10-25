import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { useStore } from 'zustand';
import { useToast } from '@hooks/use_toast';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 검색 입력·실행과 키워드 클릭 요청을 한 흐름으로 관리한다.
export const useDetailFind = () => {
  const { store, controller } = useKeywordNavigationContext();
  const { showToast } = useToast();
  const searchRequest = useStore(store, (state) => state.searchRequest);
  const [query, setQuery] = useState(searchRequest?.query ?? '');
  const queryRef = useRef(query);
  const requestId = useRef(0);
  const activeQuery = useRef<string | null>(null);

  // 이전 검색 응답과 진행 중인 인덱스 이동을 무효화한다.
  const cancel = useCallback(() => {
    requestId.current++;
    activeQuery.current = null;
    controller.cancel();
  }, [controller]);

  const search = useCallback(
    async (submittedQuery: string) => {
      const text = submittedQuery.replace(/[\r\n]/g, '');
      const value = text.trim();
      if (!value || activeQuery.current === value) return;

      // React 상태보다 최신인 네이티브 제출 문자열을 먼저 반영한다.
      activeQuery.current = value;
      queryRef.current = text;
      setQuery(text);
      Keyboard.dismiss();
      const id = ++requestId.current;
      store.getState().setSearchQuery(value);

      try {
        const count = await controller.jump(value);
        if (id !== requestId.current) return;

        if (count === 0) {
          showToast({
            message: '일치하는 단어가 없습니다.',
            duration: 2500,
          });
        }
      } finally {
        if (id === requestId.current) {
          activeQuery.current = null;
        }
      }
    },
    [store, controller, showToast],
  );

  const updateQuery = useCallback(
    (value: string) => {
      // 통합검색과 동일하게 엔터가 입력 문자열에 포함된 경우도 즉시 검색한다.
      if (/[\r\n]/.test(value)) {
        void search(value);
        return;
      }

      // 제출·포커스 해제 후 전달되는 동일한 값은 진행 중인 검색을 취소하지 않는다.
      if (value === queryRef.current) return;

      queryRef.current = value;
      cancel();
      setQuery(value);
      store.getState().setSearchQuery('');
    },
    [cancel, store, search],
  );

  useEffect(() => {
    if (!searchRequest) return;

    void search(searchRequest.query);
  }, [searchRequest, search]);

  useEffect(() => cancel, [cancel]);

  return { query, search, updateQuery };
};
