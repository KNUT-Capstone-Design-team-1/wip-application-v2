import { createKeywordNavigationController } from '../../../src/features/pill_search_result_detail/utils/keyword_navigation_controller';

function setup() {
  let offset = 0;
  const setStatus = jest.fn();
  const scrollTo = jest.fn((y: number) => {
    offset = Math.min(y, 250);
    controller.onScroll(offset);
  });
  const controller = createKeywordNavigationController({
    setActiveKeyword: jest.fn(),
    setStatus,
    scrollTo,
    getViewportY: async () => 50,
    nextFrame: async () => {},
  });
  controller.register('body', async (_keyword, prepareOnly) =>
    prepareOnly
      ? []
      : [
          { id: 'a', keyword: '어지러움', y: 174 - offset },
          { id: 'b', keyword: '어지러움', y: 174 - offset },
          { id: 'c', keyword: '어지러움', y: 374 - offset },
        ],
  );

  return {
    controller,
    scrollTo,
    setStatus,
    setOffset: (y: number) => {
      offset = y;
      controller.onScroll(y);
    },
  };
}

test('같은 줄도 순서대로 이동하고 화면 하단에서 스크롤이 제한되어도 순환하지 않는다', async () => {
  const { controller, scrollTo, setStatus } = setup();

  for (let i = 0; i < 4; i++) {
    await controller.jump('어지러움');
  }

  expect(scrollTo.mock.calls.map(([y]) => y)).toEqual([100, 100, 300]);
  expect(setStatus).toHaveBeenLastCalledWith('마지막 일치 항목입니다');
});
test('수동 위 스크롤은 현재 화면 위치로 인덱스를 되돌린다', async () => {
  const { controller, scrollTo, setOffset, setStatus } = setup();

  for (let i = 0; i < 3; i++) {
    await controller.jump('어지러움');
  }

  controller.onScrollBeginDrag();
  setOffset(20);
  await controller.jump('어지러움');
  expect(scrollTo).toHaveBeenLastCalledWith(100);
  expect(setStatus).toHaveBeenLastCalledWith('1/3');
});
test('접힌 본문을 열고 표 준비를 기다린 뒤 좌표를 측정한다', async () => {
  const { controller } = setup();
  const order: string[] = [];
  controller.registerOpener(() => {
    order.push('open');
  });
  controller.register('table', async (_keyword, prepareOnly) => {
    order.push(prepareOnly ? 'ready' : 'measure');

    return [];
  });
  await controller.jump('어지러움');
  expect(order).toEqual(['open', 'ready', 'measure']);
});
test('검색 취소 후 대기 중이던 이동은 실행하지 않는다', async () => {
  const { controller, scrollTo } = setup();
  const pending = controller.jump('어지러움');
  controller.clear();
  await pending;
  expect(scrollTo).not.toHaveBeenCalled();
});
