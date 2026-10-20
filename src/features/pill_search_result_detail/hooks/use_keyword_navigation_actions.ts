import type { WarningKeywordTarget } from '../types/special_classification_type';
import { getWarningKeywordTarget } from '../utils/pill_warning_keywords';
import { useCallback, useMemo } from 'react';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 구독·생명주기 없는 검색 명령 제공.
export const useKeywordNavigationActions = () => {
  const { store, controller } = useKeywordNavigationContext();
  const jump = useCallback(
    (keyword: string) => {
      store.getState().setSearchQuery('');
      store.getState().setSearchOpen(false);
      store.getState().setVisible(true);

      return controller.jump(keyword);
    },
    [store, controller],
  );

  // 강조된 본문 항목에서 탐색 시작.
  const select = useCallback(
    (targetId: string) => {
      store.getState().setVisible(true);

      return controller.select(targetId);
    },
    [store, controller],
  );

  // 본문 터치 시 버튼과 대기 중 이동 해제.
  const dismiss = useCallback(() => {
    if (store.getState().isSearchOpen) {
      return;
    }

    store.getState().setVisible(false);
    controller.cancel();
  }, [store, controller]);

  const previous = useCallback(() => controller.previous(), [controller]);

  const next = useCallback(() => controller.next(), [controller]);

  return useMemo(
    () => ({
      jump,
      select,
      dismiss,
      previous,
      next,
      register: controller.register,
      registerOpener: controller.registerOpener,
    }),
    [jump, select, dismiss, previous, next, controller],
  );
};

// 표시 이름을 탐색 가능한 실제 일치 문자열로 변환하는 경고 항목 명령.
export const useWarningKeywordActions = (
  matches?: readonly WarningKeywordTarget[],
) => {
  const { jump } = useKeywordNavigationActions();

  return useCallback(
    (displayName: string) =>
      jump(getWarningKeywordTarget(displayName, matches)),
    [jump, matches],
  );
};
