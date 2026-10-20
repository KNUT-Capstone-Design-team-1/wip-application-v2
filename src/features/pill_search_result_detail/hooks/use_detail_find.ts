import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import type { DetailFindStateSetters } from '../types/keyword_navigation_type';
import { useKeywordNavigationActions } from './use_keyword_navigation_actions';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 검색 실행·입력 변경·닫기 명령을 상태 구독 없이 제공한다.
export const useDetailFindActions = (
  query: string,
  {
    setQuery,
    setSearching,
    setHasSearched,
    setMatchCount,
  }: DetailFindStateSetters,
) => {
  const { store, controller } = useKeywordNavigationContext();
  const { previous, next } = useKeywordNavigationActions();
  const request = useRef(0);

  // 이전 검색 응답과 진행 중인 인덱스 이동을 무효화한다.
  const cancel = useCallback(() => {
    request.current++;
    controller.cancel();
  }, [controller]);

  // 입력 중인 검색어를 반영하고 이전 검색 상태를 해제한다.
  const updateQuery = useCallback(
    (value: string) => {
      cancel();

      setQuery(value);
      setSearching(false);
      setHasSearched(false);
      store.getState().setSearchQuery('');
    },
    [cancel, setQuery, setSearching, setHasSearched, store],
  );

  // 검색어를 강조한 뒤 첫 일치 위치로 이동하고 최신 요청의 결과만 반영한다.
  const search = useCallback(async () => {
    const value = query.trim();
    const hasQuery = !!value;

    if (!hasQuery) {
      return;
    }

    Keyboard.dismiss();

    const id = ++request.current;

    setSearching(true);
    setHasSearched(false);
    store.getState().setSearchQuery(value);
    store.getState().setVisible(true);

    try {
      const count = await controller.jump(value);
      const isCurrentRequest = id === request.current;

      if (!isCurrentRequest) {
        return;
      }

      setHasSearched(true);
      setMatchCount(count ?? null);
    } finally {
      const isCurrentRequest = id === request.current;

      if (isCurrentRequest) {
        setSearching(false);
      }
    }
  }, [query, store, controller, setSearching, setHasSearched, setMatchCount]);

  // 검색을 취소하고 폼과 탐색 표시를 초기화한다.
  const close = useCallback(() => {
    cancel();

    store.getState().setSearchOpen(false);
    store.getState().setSearchQuery('');
    store.getState().setVisible(false);
    setQuery('');
    setSearching(false);
    setHasSearched(false);
    setMatchCount(null);
    Keyboard.dismiss();
  }, [cancel, store, setQuery, setSearching, setHasSearched, setMatchCount]);

  return useMemo(
    () => ({ search, updateQuery, close, cancel, previous, next }),
    [search, updateQuery, close, cancel, previous, next],
  );
};

// 폼 내부 상태와 언마운트 시 검색 취소를 관리한다.
export const useDetailFind = () => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const { search, updateQuery, close, cancel, previous, next } =
    useDetailFindActions(query, {
      setQuery,
      setSearching,
      setHasSearched,
      setMatchCount,
    });

  useEffect(() => cancel, [cancel]);

  return {
    query,
    searching,
    matchCount,
    hasSearched,
    search,
    updateQuery,
    close,
    previous,
    next,
  };
};
