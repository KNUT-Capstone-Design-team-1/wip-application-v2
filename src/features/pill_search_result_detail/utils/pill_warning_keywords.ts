import type { IPillDetail } from '../types/pill_detail_type';

// 분류별 표시 문구 병합.
export const collectPillWarningKeywords = (
  data: IPillDetail | null,
): string[] =>
  [
    ...new Set([
      ...(data?.drivingWarningKeywords || []),
      ...(data?.narcoticIngredients || []),
      ...(data?.cannabisIngredients || []),
      ...(data?.psychotropicIngredients || []),
      ...(data?.prohibitedIngredients || []),
    ]),
  ].filter(Boolean);
