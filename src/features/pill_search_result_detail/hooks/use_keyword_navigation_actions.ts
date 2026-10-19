import { useCallback, useMemo } from 'react';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 구독·생명주기 없는 검색 명령 제공.
export const useKeywordNavigationActions = () => {
  const { controller } = useKeywordNavigationContext();
  const jump = useCallback(
    (keyword: string) => controller.jump(keyword),
    [controller],
  );
  const clear = useCallback(() => controller.clear(), [controller]);

  return useMemo(
    () => ({
      jump,
      clear,
      register: controller.register,
      registerOpener: controller.registerOpener,
    }),
    [jump, clear, controller],
  );
};
