import { useCallback, useEffect, useRef } from 'react';
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {
  setScrollController,
  clearScrollController,
} from '../store/guide_scroll_registry';

/**
 * 투어가 스크롤 영역 안의 off-screen 타겟을 화면으로 끌어오도록
 * 현재 화면의 ScrollView 를 등록하는 훅.
 *
 *   const scroll = useGuideScroll();
 *   <ScrollView {...scroll} />
 */
export function useGuideScroll() {
  const ref = useRef<ScrollView>(null);
  const offsetY = useRef(0);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    offsetY.current = e.nativeEvent.contentOffset.y;
  }, []);

  useEffect(() => {
    const controller = {
      scrollTo: (y: number) =>
        ref.current?.scrollTo({ y: Math.max(0, y), animated: true }),
      getOffsetY: () => offsetY.current,
    };
    setScrollController(controller);
    return () => clearScrollController(controller);
  }, []);

  return { ref, onScroll, scrollEventThrottle: 16 };
}
