import type {
  KeywordMeasurementOptions,
  KeywordTarget,
} from '../types/keyword_navigation_type';

// 본문·표 레이아웃 준비 후 일괄 측정.
export const measureKeywordTargets = async (
  options: KeywordMeasurementOptions,
) => {
  await options.nextFrame();

  if (options.isCancelled()) {
    return [];
  }

  const measures = options.getMeasures();
  await Promise.all(measures.map((measure) => measure(options.keywords, true)));
  await options.nextFrame();

  if (options.isCancelled()) {
    return [];
  }

  const groups = await Promise.all(
    options.getMeasures().map((measure) => measure(options.keywords)),
  );

  return groups
    .flat()
    .filter(
      (target) =>
        target.kind === 'section' ||
        target.keywords.some((keyword) => options.keywords.includes(keyword)),
    );
};

// 전체 문구에서 방향별 인덱스 선택.
export const findKeywordTargetIndex = (
  targets: KeywordTarget[],
  scrollY: number,
  cursorId: string | null,
  direction: 'previous' | 'next',
  keyword?: string,
): number => {
  if (keyword) {
    const ahead = targets.findIndex(
      (target) =>
        target.kind !== 'section' &&
        target.keywords.includes(keyword) &&
        target.y >= scrollY - 2,
    );

    return ahead >= 0
      ? ahead
      : targets.findIndex(
          (target) =>
            target.kind !== 'section' && target.keywords.includes(keyword),
        );
  }

  const current = targets.findIndex((target) => target.id === cursorId);

  if (current >= 0) {
    return current + (direction === 'next' ? 1 : -1);
  }

  const ahead = targets.findIndex((target) => target.y >= scrollY - 2);

  if (direction === 'next') {
    return ahead;
  }

  return ahead < 0 ? targets.length - 1 : ahead - 1;
};
