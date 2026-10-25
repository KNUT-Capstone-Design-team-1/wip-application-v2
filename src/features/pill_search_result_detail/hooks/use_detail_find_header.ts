import { useCallback } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useHeaderActionStore } from '@layouts/header/store/header_action_store';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 상세 화면이 활성화된 동안 헤더 검색 버튼과 찾기 단축키 연결.
export const useDetailFindHeader = () => {
  const { store, controller } = useKeywordNavigationContext();
  useFocusEffect(
    useCallback(() => {
      const open = () => store.getState().setSearchOpen(true);
      const close = () => {
        controller.cancel();
        store.getState().setSearchOpen(false);
        store.getState().setSearchQuery('');
        Keyboard.dismiss();
      };
      const toggle = () => {
        if (store.getState().isSearchOpen) close();
        else open();
      };
      useHeaderActionStore.getState().setSearch(toggle);
      useHeaderActionStore
        .getState()
        .setSearchOpen(store.getState().isSearchOpen);
      const unsubscribe = store.subscribe((state, previous) => {
        if (
          state.isSearchOpen !== previous.isSearchOpen &&
          useHeaderActionStore.getState().onSearch === toggle
        ) {
          useHeaderActionStore.getState().setSearchOpen(state.isSearchOpen);
        }
      });
      const onKeyDown = (event: KeyboardEvent) => {
        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === 'f'
        ) {
          event.preventDefault();
          open();
        }
        if (event.key === 'Escape' && store.getState().isSearchOpen) {
          close();
        }
      };
      if (Platform.OS === 'web') window.addEventListener('keydown', onKeyDown);
      return () => {
        unsubscribe();
        if (useHeaderActionStore.getState().onSearch === toggle) {
          useHeaderActionStore.getState().setSearch(null);
        }
        if (Platform.OS === 'web')
          window.removeEventListener('keydown', onKeyDown);
      };
    }, [store, controller]),
  );
};
