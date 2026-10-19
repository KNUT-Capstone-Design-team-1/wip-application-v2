import { KEYWORD_SCROLL_TOP_INSET } from '../constants/pill_detail';
import type {
  KeywordNavigationOptions,
  KeywordMeasure,
  KeywordTarget,
} from '../types/keyword_navigation_type';
import {
  findKeywordTargetIndex,
  measureKeywordTargets,
} from './keyword_navigation_targets';

// 화면별 본문 검색·이동 제어.
export const createKeywordNavigationController = (
  options: KeywordNavigationOptions,
) => {
  const registry = new Map<string, KeywordMeasure>();

  const openers = new Set<(keywords: readonly string[]) => void>();
  let scrollY = 0;
  let cursorId: string | null = null;
  let sequence = 0;
  let manualScroll = false;
  let targets: KeywordTarget[] = [];
  let hasMeasured = false;

  // 대기 중 이동 무효화.
  const cancel = () => {
    sequence++;
  };

  // 현재 위치의 이동 가능 방향 반영.
  const updateAvailability = () => {
    if (!hasMeasured) {
      options.setAvailability({
        canPrevious: scrollY > 2,
        canNext: options.getKeywords().length > 0,
      });

      return;
    }

    const current = targets.findIndex((target) => target.id === cursorId);

    if (current >= 0) {
      options.setAvailability({
        canPrevious: current > 0,
        canNext: current < targets.length - 1,
      });

      return;
    }

    options.setAvailability({
      canPrevious: targets.some((target) => target.y < scrollY - 2),
      canNext: targets.some((target) => target.y >= scrollY - 2),
    });
  };

  // 현재 등록된 본문 좌표 갱신.
  const refreshTargets = async (request: number): Promise<boolean> => {
    const measured = await measureKeywordTargets({
      getMeasures: () => [...registry.values()],
      keywords: options.getKeywords(),
      nextFrame: options.nextFrame,
      isCancelled: () => request !== sequence,
    });

    if (request !== sequence) {
      return false;
    }

    const viewportY = await options.getViewportY();

    if (request !== sequence) {
      return false;
    }

    hasMeasured = true;
    targets = measured
      .map((target) => ({
        ...target,
        y: target.y - viewportY + scrollY - KEYWORD_SCROLL_TOP_INSET,
      }))
      .sort((a, b) => a.y - b.y);

    return true;
  };

  // 전체 키워드 인덱스로 이전·다음 이동.
  const navigate = async (direction: 'previous' | 'next', keyword?: string) => {
    const request = ++sequence;
    manualScroll = false;
    openers.forEach((open) => open(options.getKeywords()));

    if (!(await refreshTargets(request))) {
      return;
    }

    const index = findKeywordTargetIndex(
      targets,
      scrollY,
      cursorId,
      direction,
      keyword,
    );
    const target = targets[index];

    if (!target) {
      updateAvailability();

      return;
    }

    target.reveal?.();
    cursorId = target.id;
    updateAvailability();
    scrollY = Math.max(0, target.y);
    options.scrollTo(scrollY);
  };

  return {
    cancel,
    reset: () => {
      cancel();
      cursorId = null;
      targets = [];
      hasMeasured = false;
      scrollY = 0;
      manualScroll = false;
      options.setAvailability({ canPrevious: false, canNext: true });
    },
    register: (id: string, measure: KeywordMeasure) => {
      registry.set(id, measure);

      return () => {
        if (registry.get(id) === measure) {
          registry.delete(id);
        }
      };
    },
    registerOpener: (open: (keywords: readonly string[]) => void) => {
      openers.add(open);

      return () => {
        openers.delete(open);
      };
    },
    onScrollBeginDrag: () => {
      manualScroll = true;
      cancel();
    },
    onScroll: (y: number) => {
      scrollY = y;

      if (!manualScroll) {
        return;
      }

      cursorId = null;
      updateAvailability();
    },
    // 누른 항목을 이동 없이 현재 인덱스로 선택.
    select: async (targetId: string) => {
      const request = ++sequence;
      manualScroll = false;
      cursorId = targetId;
      openers.forEach((open) => open(options.getKeywords()));

      if (!(await refreshTargets(request))) {
        return;
      }

      updateAvailability();
    },
    jump: (keyword: string) => navigate('next', keyword),
    previous: () => navigate('previous'),
    next: () => navigate('next'),
  };
};
