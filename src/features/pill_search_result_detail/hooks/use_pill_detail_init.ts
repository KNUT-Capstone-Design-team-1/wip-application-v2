import { useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  usePillDetailLoadActions,
  usePillDetailSaveActions,
} from './use_pill_detail_actions';

// 화면 진입 시 조회·저장 상태 초기화와 이탈 정리.
export const usePillDetailInit = () => {
  const { load, cancel } = usePillDetailLoadActions();
  const { refreshSavedFolders } = usePillDetailSaveActions();

  useFocusEffect(
    useCallback(() => {
      void load();

      return cancel;
    }, [load, cancel]),
  );

  useEffect(() => {
    void refreshSavedFolders();
  }, [refreshSavedFolders]);
};
