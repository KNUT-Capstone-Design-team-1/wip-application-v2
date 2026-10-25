import type {
  KeywordMeasurementOptions,
  KeywordNavigationDirection,
  KeywordAvailabilityOptions,
  KeywordNavigationAvailability,
  KeywordTarget,
} from '../types/keyword_navigation_type';

// 본문·표 레이아웃 준비 후 일괄 측정.
export const measureKeywordTargets = async (
  options: KeywordMeasurementOptions,
) => {
  await options.nextFrame();

  const isCancelled = options.isCancelled();

  if (isCancelled) {
    return [];
  }

  const measures = options.getMeasures();
  const prepareKeywords = options.prepareKeywords ?? options.keywords;

  await Promise.all(measures.map((measure) => measure(prepareKeywords, true)));
  await options.nextFrame();

  const isCancelledAfterPreparation = options.isCancelled();

  if (isCancelledAfterPreparation) {
    return [];
  }

  const groups = await Promise.all(
    options.getMeasures().map((measure) => measure(options.keywords)),
  );

  return groups
    .flat()
    .filter((target) =>
      target.keywords.some((keyword) => options.keywords.includes(keyword)),
    );
};

// 전체 문구에서 방향별 인덱스 선택.
export const findKeywordTargetIndex = (
  targets: KeywordTarget[],
  scrollY: number,
  cursorId: string | null,
  direction: KeywordNavigationDirection,
  keyword?: string,
): number => {
  const isFirst = direction === 'first';

  if (isFirst) {
    return targets.findIndex(
      (target) => !keyword || target.keywords.includes(keyword),
    );
  }

  const hasKeyword = !!keyword;

  if (hasKeyword) {
    const ahead = targets.findIndex(
      (target) => target.keywords.includes(keyword) && target.y >= scrollY - 2,
    );

    return ahead >= 0
      ? ahead
      : targets.findIndex((target) => target.keywords.includes(keyword));
  }

  const current = targets.findIndex((target) => target.id === cursorId);

  const hasCurrentTarget = current >= 0;

  if (hasCurrentTarget) {
    return current + (direction === 'next' ? 1 : -1);
  }

  const ahead = targets.findIndex((target) => target.y >= scrollY - 2);

  const isNext = direction === 'next';

  if (isNext) {
    return ahead;
  }

  return ahead < 0 ? targets.length - 1 : ahead - 1;
};

// 측정 결과와 현재 위치로 표시할 인덱스·이동 가능 방향만 계산한다.
export const getKeywordNavigationAvailability = ({
  targets,
  cursorId,
  scrollY,
  hasMeasured,
  hasKeywords,
}: KeywordAvailabilityOptions): KeywordNavigationAvailability => {
  const current = targets.findIndex((target) => target.id === cursorId);
  const progress = { currentIndex: current + 1, totalCount: targets.length };

  if (!hasMeasured) {
    return { ...progress, canPrevious: scrollY > 2, canNext: hasKeywords };
  }

  const hasCurrentTarget = current >= 0;

  if (hasCurrentTarget) {
    return {
      ...progress,
      canPrevious: current > 0,
      canNext: current < targets.length - 1,
    };
  }

  return {
    ...progress,
    canPrevious: targets.some((target) => target.y < scrollY - 2),
    canNext: targets.some((target) => target.y >= scrollY - 2),
  };
};
