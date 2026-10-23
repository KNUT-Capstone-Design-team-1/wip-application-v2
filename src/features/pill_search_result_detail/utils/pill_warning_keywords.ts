import type { WarningKeywordTarget } from '../types/special_classification_type';
import type { IPillDetail } from '../types/pill_detail_type';

// 강조·인덱스에는 표시 이름이 아닌 실제로 일치한 입력 문자열을 사용한다.
export const collectPillWarningKeywords = (
  data: IPillDetail | null,
): string[] =>
  [
    ...new Set([
      ...(data?.drivingWarningKeywords || []),
      ...(data?.classificationMatches || []).map((match) => match.matchedText),
    ]),
  ].filter(Boolean);

// 경고 영역의 표시 이름을 누르면 실제 입력에서 찾을 수 있는 이름으로 이동한다.
export const getWarningKeywordTarget = (
  displayName: string,
  matches?: readonly WarningKeywordTarget[],
): string =>
  matches?.find((match) => match.displayName === displayName)?.matchedText ||
  displayName;
