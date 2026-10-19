import { createKeywordNavigationStore } from '../../../src/features/pill_search_result_detail/store/keyword_navigation_store';

test('상세 화면별 검색 상태를 독립적으로 유지한다', () => {
  const first = createKeywordNavigationStore();
  const second = createKeywordNavigationStore();
  first.getState().setKeywords(['어지러움']);
  first.getState().setAvailability({ canPrevious: true, canNext: false });
  expect(second.getState().keywords).toEqual([]);
  expect(second.getState().canPrevious).toBe(false);
  expect(second.getState().canNext).toBe(true);
});

test('탐색 방향 변경으로 본문 문구와 액션 참조를 바꾸지 않는다', () => {
  const store = createKeywordNavigationStore();
  store.getState().setKeywords(['어지러움']);
  const before = store.getState();
  store.getState().setAvailability({ canPrevious: true, canNext: false });
  const after = store.getState();
  expect(after.keywords).toBe(before.keywords);
  expect(after.setKeywords).toBe(before.setKeywords);
  expect(after.setAvailability).toBe(before.setAvailability);
});
