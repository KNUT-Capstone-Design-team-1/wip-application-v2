import { SEARCH_ALL_LABEL } from '@features/pill_identification_search/constants/identification_pagination_constant';

// 라디오/체크박스 필터 배열 토글 비즈니스 로직 함수
export const getToggledArrayValue = (
  currentArray: string[] | null,
  value: string,
): string[] | null => {
  if (value === SEARCH_ALL_LABEL) {
    return null;
  }

  const list = currentArray ?? [];
  const filtered = list.filter((item) => item !== SEARCH_ALL_LABEL);

  const nextList = filtered.includes(value)
    ? filtered.filter((item) => item !== value)
    : [...filtered, value];

  if (nextList.length === 0) {
    return null;
  }

  return nextList;
};
