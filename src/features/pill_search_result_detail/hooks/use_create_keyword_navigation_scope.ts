import { useMemo, useRef } from 'react';
import { ScrollView } from 'react-native';
import { createKeywordNavigationStore } from '../store/keyword_navigation_store';
import { createKeywordNavigationController } from '../utils/keyword_navigation_controller';
import { KeywordNavigationScope } from '../types/keyword_navigation_scope_type';

// 네이티브 레이아웃 반영 대기.
const waitForNativeLayout = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

// 스크롤 뷰의 화면 좌표 측정.
const measureScrollViewport = (scroll: ScrollView | null): Promise<number> =>
  new Promise((resolve) => {
    const native = scroll?.getNativeScrollRef();

    if (!native) {
      resolve(0);

      return;
    }

    native.measureInWindow((_x: number, y: number) => resolve(y));
  });

// 상세 화면별 명령 의존성 연결.
export const useCreateKeywordNavigationScope = (): KeywordNavigationScope => {
  const scrollRef = useRef<ScrollView>(null);
  const store = useMemo(createKeywordNavigationStore, []);
  const controller = useMemo(
    () =>
      createKeywordNavigationController({
        setActiveKeyword: (keyword) =>
          store.getState().setActiveKeyword(keyword),
        setStatus: (status) => store.getState().setStatus(status),
        nextFrame: waitForNativeLayout,
        getViewportY: () => measureScrollViewport(scrollRef.current),
        scrollTo: (y) => scrollRef.current?.scrollTo({ y, animated: false }),
      }),
    [store],
  );

  return useMemo(() => ({ store, scrollRef, controller }), [store, controller]);
};
