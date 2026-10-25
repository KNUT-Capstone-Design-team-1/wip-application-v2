import { createKeywordNavigationStore } from '../../src/features/pill_search_result_detail/store/keyword_navigation_store';

test('a keyword request opens page search and allows repeated requests for the same keyword', () => {
  const store = createKeywordNavigationStore();
  store.getState().requestSearch('졸음');
  const firstRequest = store.getState().searchRequest;
  expect(store.getState()).toMatchObject({
    isSearchOpen: true,
    searchRequest: { query: '졸음' },
  });

  store.getState().requestSearch('졸음');
  expect(store.getState().searchRequest).not.toBe(firstRequest);
  store.getState().requestSearch('운전');
  expect(store.getState().searchRequest).toEqual({ query: '운전' });
});

test('closing page search clears keyword requests so reopening does not repeat the old search', () => {
  const store = createKeywordNavigationStore();
  store.getState().requestSearch('졸음');
  store.getState().setSearchOpen(false);
  store.getState().setSearchOpen(true);
  expect(store.getState().searchRequest).toBeNull();
});

test('clearing the search removes keywords and disables navigation instead of restoring warning keywords', () => {
  const store = createKeywordNavigationStore();
  store.getState().setSearchQuery('타펜타톨');
  expect(store.getState().keywords).toEqual(['타펜타톨']);
  store.getState().setAvailability({
    currentIndex: 1,
    totalCount: 2,
    canPrevious: false,
    canNext: true,
  });

  store.getState().setSearchQuery('');
  expect(store.getState()).toMatchObject({
    keywords: [],
    searchQuery: '',
    currentIndex: 0,
    totalCount: 0,
    canPrevious: false,
    canNext: false,
  });
});
