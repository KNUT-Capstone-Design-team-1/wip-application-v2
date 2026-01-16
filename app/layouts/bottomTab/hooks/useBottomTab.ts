import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback } from 'react';

export const useBottomTab = () => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  /**
   * 탭 클릭 시 해당 경로로 이동
   */
  const handleTabPress = useCallback((path: string) => {
      router.push(path);
    },
    [router],
  );

  /**
   * 현재 탭이 활성화 상태인지 확인
   */
  const isTabActive = useCallback((tabPath: string) => {
      return pathname === tabPath;
    },
    [pathname],
  );

  return {
    insets,
    pathname,
    handleTabPress,
    isTabActive,
  };
};
