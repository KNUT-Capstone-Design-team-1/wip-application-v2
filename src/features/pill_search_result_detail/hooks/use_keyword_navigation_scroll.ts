import { useCallback } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 네이티브 스크롤 이벤트를 이동 제어기로 전달.
export const useKeywordNavigationScroll = () => {
  const { scrollRef, controller } = useKeywordNavigationContext();

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) =>
      controller.onScroll(event.nativeEvent.contentOffset.y),
    [controller],
  );

  return {
    scrollRef,
    onScroll,
    onScrollBeginDrag: controller.onScrollBeginDrag,
  };
};
