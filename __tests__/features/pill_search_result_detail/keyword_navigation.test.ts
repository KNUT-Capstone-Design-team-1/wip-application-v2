import { createKeywordNavigationController } from '../../../src/features/pill_search_result_detail/utils/keyword_navigation_controller';

// 네이티브 하단 스크롤 제한을 포함한 본문 구성.
function setup() {
  let offset = 0;
  const setAvailability = jest.fn();
  const scrollTo = jest.fn((y: number) => {
    offset = Math.min(y, 250);
    controller.onScroll(offset);
  });
  const controller = createKeywordNavigationController({
    getKeywords: () => ['졸음', '어지러움'],
    setAvailability,
    scrollTo,
    getViewportY: async () => 50,
    nextFrame: async () => {},
  });
  controller.register('body', async (_keywords, prepareOnly) =>
    prepareOnly
      ? []
      : [
          { id: 'a', keyword: '어지러움', y: 174 - offset },
          { id: 'b', keyword: '졸음', y: 174 - offset },
          { id: 'c', keyword: '어지러움', y: 374 - offset },
          { id: 'excluded', keyword: '성분전용', y: 200 - offset },
        ],
  );

  return {
    controller,
    scrollTo,
    setAvailability,
    setOffset: (y: number) => {
      offset = y;
      controller.onScroll(y);
    },
  };
}

test('모든 키워드를 같은 줄까지 본문 순서로 방문하고 마지막에서 멈춘다', async () => {
  const { controller, scrollTo, setAvailability } = setup();

  for (let i = 0; i < 4; i++) {
    await controller.next();
  }

  expect(scrollTo.mock.calls.map(([y]) => y)).toEqual([100, 100, 300]);
  expect(setAvailability).toHaveBeenLastCalledWith({
    canPrevious: true,
    canNext: false,
  });
});

test('이전 화살표는 같은 줄의 다른 문구도 방문하고 첫 항목에서 멈춘다', async () => {
  const { controller, scrollTo, setAvailability } = setup();
  await controller.jump('졸음');
  await controller.next();
  await controller.previous();
  await controller.previous();
  await controller.previous();
  expect(scrollTo.mock.calls.map(([y]) => y)).toEqual([100, 300, 100, 100]);
  expect(setAvailability).toHaveBeenLastCalledWith({
    canPrevious: false,
    canNext: true,
  });
});

test('동일 키워드 재선택은 다음 결과로 전진하지 않는다', async () => {
  const { controller, scrollTo } = setup();
  await controller.jump('어지러움');
  await controller.jump('어지러움');
  expect(scrollTo.mock.calls.map(([y]) => y)).toEqual([100, 100]);
});

test('수동 위 스크롤은 현재 화면 위치로 인덱스를 되돌린다', async () => {
  const { controller, scrollTo, setOffset, setAvailability } = setup();
  await controller.next();
  await controller.next();
  await controller.next();
  controller.onScrollBeginDrag();
  setOffset(20);
  await controller.next();
  expect(scrollTo).toHaveBeenLastCalledWith(100);
  expect(setAvailability).toHaveBeenLastCalledWith({
    canPrevious: false,
    canNext: true,
  });
});

test('검색 전 수동 스크롤도 화살표를 사용할 수 있고 이전은 현재 위쪽부터 찾는다', async () => {
  const { controller, scrollTo, setOffset, setAvailability } = setup();
  controller.onScrollBeginDrag();
  setOffset(200);
  expect(setAvailability).toHaveBeenLastCalledWith({
    canPrevious: true,
    canNext: true,
  });
  await controller.previous();
  expect(scrollTo).toHaveBeenLastCalledWith(100);
  await controller.next();
  expect(scrollTo).toHaveBeenLastCalledWith(300);
});

test('접힌 본문에서 새로 등록된 표도 준비 후 전체 키워드로 한 번 측정한다', async () => {
  const { controller } = setup();
  const order: string[] = [];
  controller.registerOpener(() => {
    order.push('open');
    controller.register('table', async (keywords, prepareOnly) => {
      expect(keywords).toEqual(['졸음', '어지러움']);
      order.push(prepareOnly ? 'ready' : 'measure');

      return [];
    });
  });
  await controller.next();
  expect(order).toEqual(['open', 'ready', 'measure']);
});

test('검색 취소 후 대기 중이던 이동은 실행하지 않는다', async () => {
  const { controller, scrollTo } = setup();
  const pending = controller.next();
  controller.cancel();
  await pending;
  expect(scrollTo).not.toHaveBeenCalled();
});

test('본문 결과가 없으면 양쪽 화살표를 비활성화한다', async () => {
  const setAvailability = jest.fn();
  const scrollTo = jest.fn();
  const controller = createKeywordNavigationController({
    getKeywords: () => ['졸음'],
    setAvailability,
    scrollTo,
    getViewportY: async () => 0,
    nextFrame: async () => {},
  });
  await controller.next();
  expect(scrollTo).not.toHaveBeenCalled();
  expect(setAvailability).toHaveBeenLastCalledWith({
    canPrevious: false,
    canNext: false,
  });
});

test('강조 항목을 누르면 스크롤 없이 정확한 항목에서 다음·이전을 이어간다', async () => {
  const { controller, scrollTo, setAvailability } = setup();
  await controller.select('b');
  expect(scrollTo).not.toHaveBeenCalled();
  expect(setAvailability).toHaveBeenLastCalledWith({
    canPrevious: true,
    canNext: true,
  });
  await controller.next();
  expect(scrollTo).toHaveBeenLastCalledWith(300);
  await controller.previous();
  await controller.previous();
  expect(scrollTo.mock.calls.map(([y]) => y)).toEqual([300, 100, 100]);
});

test('마지막 강조 항목을 선택하면 다음 버튼을 비활성화한다', async () => {
  const { controller, scrollTo, setAvailability } = setup();
  await controller.select('c');
  expect(scrollTo).not.toHaveBeenCalled();
  expect(setAvailability).toHaveBeenLastCalledWith({
    canPrevious: true,
    canNext: false,
  });
});
