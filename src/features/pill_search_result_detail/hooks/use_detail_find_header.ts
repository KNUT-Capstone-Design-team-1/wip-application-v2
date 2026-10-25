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
        Keyboard.dismiss();
        controller.cancel();
        store.getState().setSearchOpen(false);
        store.getState().setSearchQuery('');
      };

      const toggle = () => {
        const isSearchOpen = store.getState().isSearchOpen;

        if (isSearchOpen) {
          close();
        } else {
          open();
        }
      };

      useHeaderActionStore.getState().setSearch(toggle);
      useHeaderActionStore
        .getState()
        .setSearchOpen(store.getState().isSearchOpen);
      const unsubscribe = store.subscribe((state, previous) => {
        const shouldUpdateHeader =
          state.isSearchOpen !== previous.isSearchOpen &&
          useHeaderActionStore.getState().onSearch === toggle;

        if (shouldUpdateHeader) {
          useHeaderActionStore.getState().setSearchOpen(state.isSearchOpen);
        }
      });
      const onKeyDown = (event: KeyboardEvent) => {
        const isFindShortcut =
          (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f';

        if (isFindShortcut) {
          event.preventDefault();
          open();
        }

        const shouldCloseSearch =
          event.key === 'Escape' && store.getState().isSearchOpen;

        if (shouldCloseSearch) {
          close();
        }
      };

      const isWeb = Platform.OS === 'web';

      if (isWeb) {
        window.addEventListener('keydown', onKeyDown);
      }

      return () => {
        unsubscribe();
        const ownsHeaderSearch =
          useHeaderActionStore.getState().onSearch === toggle;

        if (ownsHeaderSearch) {
          useHeaderActionStore.getState().setSearch(null);
        }

        const isWeb = Platform.OS === 'web';

        if (isWeb) {
          window.removeEventListener('keydown', onKeyDown);
        }
      };
    }, [store, controller]),
  );
};
