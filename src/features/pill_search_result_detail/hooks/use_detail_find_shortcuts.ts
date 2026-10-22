import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 화면이 활성화된 동안만 브라우저 찾기 단축키 연결.
export const useDetailFindShortcuts = () => {
  const { store, controller } = useKeywordNavigationContext();
  useFocusEffect(
    useCallback(() => {
      const open = () => store.getState().setSearchOpen(true);
      const onKeyDown = (event: KeyboardEvent) => {
        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === 'f'
        ) {
          event.preventDefault();
          open();
        }
        if (event.key === 'Escape' && store.getState().isSearchOpen) {
          controller.cancel();
          store.getState().setSearchOpen(false);
          store.getState().setSearchQuery('');
          store.getState().setVisible(false);
        }
      };
      if (Platform.OS === 'web') window.addEventListener('keydown', onKeyDown);
      return () => {
        if (Platform.OS === 'web')
          window.removeEventListener('keydown', onKeyDown);
      };
    }, [store, controller]),
  );
};
