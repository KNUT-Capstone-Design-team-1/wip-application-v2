import { createKeywordNavigationController } from '../../src/features/pill_search_result_detail/utils/keyword_navigation_controller';
import { createKeywordNavigationStore } from '../../src/features/pill_search_result_detail/store/keyword_navigation_store';
import type { KeywordNavigationAvailability } from '../../src/features/pill_search_result_detail/types/keyword_navigation_type';

const createFixture = (count = 3) => {
  const setAvailability = jest.fn<void, [KeywordNavigationAvailability]>();
  const controller = createKeywordNavigationController({
    getKeywords: () => ['keyword'],
    setAvailability,
    nextFrame: async () => {},
    getViewportY: async () => 0,
    scrollTo: jest.fn(),
  });
  controller.register('text', async (_keywords, prepareOnly) =>
    prepareOnly
      ? []
      : Array.from({ length: count }, (_, index) => ({
          id: 'target:' + index,
          keyword: 'keyword',
          keywords: ['keyword'],
          y: 100 + index * 100,
        })),
  );
  const progress = () => setAvailability.mock.calls.at(-1)?.[0];
  return { controller, progress };
};

test('updates the position for next and previous navigation, including the last result', async () => {
  const { controller, progress } = createFixture();
  await controller.next();
  expect(progress()).toMatchObject({ currentIndex: 1, totalCount: 3 });
  await controller.next();
  expect(progress()).toMatchObject({ currentIndex: 2, totalCount: 3 });
  await controller.next();
  expect(progress()).toMatchObject({
    currentIndex: 3,
    totalCount: 3,
    canNext: false,
  });
  await controller.next();
  expect(progress()).toMatchObject({ currentIndex: 3, totalCount: 3 });
  await controller.previous();
  expect(progress()).toMatchObject({ currentIndex: 2, totalCount: 3 });
});

test('tracks a directly selected keyword and clears selection after manual scrolling', async () => {
  const { controller, progress } = createFixture();
  await controller.select('target:1');
  expect(progress()).toMatchObject({ currentIndex: 2, totalCount: 3 });
  controller.onScrollBeginDrag();
  controller.onScroll(50);
  expect(progress()).toMatchObject({ currentIndex: 0, totalCount: 3 });
  controller.reset();
  expect(progress()).toMatchObject({ currentIndex: 0, totalCount: 0 });
});

test('reports zero results without a selected index', async () => {
  const { controller, progress } = createFixture(0);
  await controller.jump('keyword');
  expect(progress()).toMatchObject({
    currentIndex: 0,
    totalCount: 0,
    canPrevious: false,
    canNext: false,
  });
});

test('clears a previous position when search keywords change', () => {
  const store = createKeywordNavigationStore();
  store.getState().setAvailability({
    currentIndex: 2,
    totalCount: 3,
    canPrevious: true,
    canNext: true,
  });
  store.getState().setSearchQuery('new query');
  expect(store.getState()).toMatchObject({ currentIndex: 0, totalCount: 0 });
});
