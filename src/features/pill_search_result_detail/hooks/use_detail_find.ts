import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, type TextInput } from 'react-native';
import { useStore } from 'zustand';
import { useToast } from '@hooks/use_toast';
import type { KeywordSearchRequest } from '../types/keyword_navigation_type';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 검색 입력·실행과 키워드 클릭 요청을 한 흐름으로 관리한다.
export const useDetailFind = () => {
  const { store, controller } = useKeywordNavigationContext();
  const { showToast } = useToast();
  const searchRequest = useStore(store, (state) => state.searchRequest);
  const inputRef = useRef<TextInput>(null);
  const autoFocus = useRef(!searchRequest).current;
  const [query, setQuery] = useState(searchRequest?.query ?? '');
  const queryRef = useRef(query);
  const activeSearch = useRef<KeywordSearchRequest | null>(null);

  // 이전 검색 응답과 진행 중인 인덱스 이동을 무효화한다.
  const cancel = useCallback(() => {
    activeSearch.current = null;
    controller.cancel();
  }, [controller]);

  const search = useCallback(
    async (submittedQuery: string, fromStart = false) => {
      const text = submittedQuery.replace(/[\r\n]/g, '');
      const value = text.trim();
      // 빈 입력·중복 제출도 포커스와 키보드는 해제한다.
      inputRef.current?.blur();
      Keyboard.dismiss();
      if (!value || (!fromStart && activeSearch.current?.query === value))
        return;

      // React 상태보다 최신인 네이티브 제출 문자열을 먼저 반영한다.
      const request = { query: value };
      activeSearch.current = request;
      queryRef.current = text;
      setQuery(text);
      store.getState().setSearchQuery(value);

      try {
        const count = await controller.jump(value, fromStart);
        if (activeSearch.current !== request) return;

        if (count === 0) {
          showToast({
            message: '일치하는 단어가 없습니다.',
            duration: 2500,
          });
        }
      } finally {
        if (activeSearch.current === request) {
          activeSearch.current = null;
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
    const input = inputRef.current;
    const subscription = Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current?.blur();
    });
    return () => {
      cancel();
      subscription.remove();
      input?.blur();
      Keyboard.dismiss();
    };
  }, [cancel]);

  useEffect(() => {
    if (!searchRequest) return;

    void search(searchRequest.query, true);
  }, [searchRequest, search]);

  return { inputRef, autoFocus, query, search, updateQuery };
};
