import { useMemo, useRef } from 'react';
import { useToast } from '@hooks/use_toast';
import { ScrollView } from 'react-native';
import { createKeywordNavigationStore } from '../store/keyword_navigation_store';
import type { KeywordNavigationScope } from '../types/keyword_navigation_type';
import { createKeywordNavigationController } from '../utils/keyword_navigation_controller';

// 네이티브 레이아웃 반영 대기.
const waitForNativeLayout = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

// 스크롤 뷰의 화면 좌표 측정.
const measureScrollViewport = (scroll: ScrollView | null): Promise<number> =>
  new Promise((resolve) => {
    const native = scroll?.getNativeScrollRef();

    const hasNoNativeScroll = !native;

    if (hasNoNativeScroll) {
      resolve(0);

      return;
    }

    native.measureInWindow((_x: number, y: number) => resolve(y));
  });

// 상세 화면별 명령 의존성 연결.
export const useCreateKeywordNavigationScope = (): KeywordNavigationScope => {
  const { showToast } = useToast();
  const scrollRef = useRef<ScrollView>(null);
  const store = useMemo(createKeywordNavigationStore, []);
  const controller = useMemo(
    () =>
      createKeywordNavigationController({
        onSearchUnavailable: (reason) =>
          showToast({
            message:
              reason === 'timeout'
                ? '표를 불러오는 중입니다. 잠시 후 다시 검색해 주세요.'
                : '일부 표를 불러오지 못했습니다. 상세 정보를 다시 열어 주세요.',
            duration: 2500,
          }),
        getKeywords: () => store.getState().keywords,
        setAvailability: (availability) =>
          store.getState().setAvailability(availability),
        nextFrame: waitForNativeLayout,
        getViewportY: () => measureScrollViewport(scrollRef.current),
        scrollTo: (y) => scrollRef.current?.scrollTo({ y, animated: false }),
      }),
    [store, showToast],
  );

  return useMemo(() => ({ store, scrollRef, controller }), [store, controller]);
};
