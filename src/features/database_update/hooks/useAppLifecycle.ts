import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppInitStore } from '../store/app_init_store';

/**
 * AppState 변화 감지하여 PAUSED / RUNNING 상태 전환
 */
export const useAppLifecycle = (
  currentTableIndexRef: React.RefObject<number>,
) => {
  const { setStatus } = useAppInitStore();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        const isBackgroundOrInactive =
          nextAppState === 'background' || nextAppState === 'inactive';

        const isRunning = useAppInitStore.getState().status === 'RUNNING';
        const isPaused = useAppInitStore.getState().status === 'PAUSED';

        if (isBackgroundOrInactive && isRunning) {
          setStatus('PAUSED');

          await AsyncStorage.setItem(
            'pausedTable',
            useAppInitStore.getState().updateCurrentTable || '',
          );

          await AsyncStorage.setItem(
            'pausedPage',
            useAppInitStore.getState().updateCurrentPage.toString(),
          );

          await AsyncStorage.setItem(
            'pausedTableIndex',
            currentTableIndexRef.current.toString(),
          );
          return;
        }

        if (nextAppState === 'active' && isPaused) {
          setStatus('RUNNING');
          return;
        }
      },
    );

    return () => subscription.remove();
  }, [setStatus, currentTableIndexRef]);
};
