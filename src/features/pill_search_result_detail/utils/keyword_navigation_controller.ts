import { TableLoadError } from './table_load_state';
import { KEYWORD_SCROLL_TOP_INSET } from '../constants/pill_detail';
import type {
  KeywordNavigationOptions,
  KeywordNavigationDirection,
  KeywordMeasure,
  KeywordTarget,
} from '../types/keyword_navigation_type';
import {
  findKeywordTargetIndex,
  getKeywordNavigationAvailability,
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
    const availability = getKeywordNavigationAvailability({
      targets,
      cursorId,
      scrollY,
      hasMeasured,
      hasKeywords: options.getKeywords().length > 0,
    });

    options.setAvailability(availability);
  };

  // 현재 등록된 본문 좌표 갱신.
  const refreshTargets = async (
    request: number,
    keyword?: string,
  ): Promise<boolean> => {
    const measured = await measureKeywordTargets({
      getMeasures: () => [...registry.values()],
      keywords: options.getKeywords(),
      prepareKeywords: keyword ? [keyword] : undefined,
      nextFrame: options.nextFrame,
      isCancelled: () => request !== sequence,
    });

    const isStaleRequest = request !== sequence;

    if (isStaleRequest) {
      return false;
    }

    const viewportY = await options.getViewportY();

    const isStaleAfterViewport = request !== sequence;

    if (isStaleAfterViewport) {
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

  // 준비 실패는 이동 실행과 분리하여 현재 요청에만 안내한다.
  const prepareNavigation = async (
    request: number,
    keyword?: string,
  ): Promise<boolean> => {
    try {
      return await refreshTargets(request, keyword);
    } catch (error) {
      const isStaleRequest = request !== sequence;

      if (isStaleRequest) {
        return false;
      }

      const isUnexpectedError = !(error instanceof TableLoadError);

      if (isUnexpectedError) {
        throw error;
      }

      const shouldReportFailure = error.reason !== 'cancelled';

      if (shouldReportFailure) {
        options.onSearchUnavailable(error.reason);
      }

      return false;
    }
  };

  // 전체 키워드 인덱스로 이전·다음 이동.
  const navigate = async (
    direction: KeywordNavigationDirection,
    keyword?: string,
  ) => {
    const request = ++sequence;
    manualScroll = false;
    openers.forEach((open) => open(options.getKeywords()));

    const isPrepared = await prepareNavigation(request, keyword);

    const canNavigate = isPrepared && request === sequence;

    if (!canNavigate) {
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

    const hasNoTarget = !target;

    if (hasNoTarget) {
      updateAvailability();

      return targets.length;
    }

    target.reveal?.();
    cursorId = target.id;
    updateAvailability();
    scrollY = Math.max(0, target.y);
    options.scrollTo(scrollY);

    return targets.length;
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
      options.setAvailability({
        currentIndex: 0,
        totalCount: 0,
        canPrevious: false,
        canNext: true,
      });
    },
    register: (id: string, measure: KeywordMeasure) => {
      registry.set(id, measure);

      return () => {
        const ownsRegistration = registry.get(id) === measure;

        if (ownsRegistration) {
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
    jump: (keyword: string, fromStart = false) =>
      navigate(fromStart ? 'first' : 'next', keyword),
    previous: () => navigate('previous'),
    next: () => navigate('next'),
  };
};
