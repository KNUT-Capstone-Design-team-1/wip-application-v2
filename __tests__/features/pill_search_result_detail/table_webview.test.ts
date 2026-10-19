import { runInNewContext } from 'node:vm';
import { buildTableKeywordScript } from '../../../src/features/pill_search_result_detail/utils/table_keyword_script';
import { buildTableWebViewHtml } from '../../../src/features/pill_search_result_detail/utils/table_webview_html';
import { parseTableWebViewMessage } from '../../../src/features/pill_search_result_detail/utils/table_webview_message';
import { createTableLoadState } from '../../../src/features/pill_search_result_detail/utils/table_load_state';

// 브라우저 스크립트에서 실제 검색어 복원.
const readScriptKeywords = (keywords: string[]): string[] =>
  runInNewContext(buildTableKeywordScript(keywords) + '\nkeywords', {
    window: { addEventListener: () => {} },
  });

test('특수문자 검색어를 손상 없이 스크립트에 전달한다', () => {
  const keywords = [
    '어지러움',
    '</script>',
    '$&',
    '"quoted"',
    'A+B',
    '\\u003c',
  ];
  expect(readScriptKeywords(keywords)).toEqual(keywords);
  expect(buildTableKeywordScript(keywords)).not.toContain('</script>');
});
test('표·플랫폼 글꼴·검색 스크립트를 조합한다', () => {
  const html = buildTableWebViewHtml(
    '<tr><td>어지러움</td></tr>',
    ['어지러움'],
    'android',
  );
  expect(html).toContain('<table><tr>');
  expect(html).toContain('file:///android_res/font/pretendard_regular.ttf');
  expect(html).toContain('function highlightKeywords()');
  expect(buildTableWebViewHtml('<table></table>', [], 'web')).not.toContain(
    '@font-face',
  );
});
test('표 좌표 메시지의 잘못된 항목을 제외한다', () => {
  const match = { keyword: '어지러움', x: 4, y: 12, index: 0 };
  expect(
    parseTableWebViewMessage(
      JSON.stringify({ matches: [match, null, { keyword: '잘못된 항목' }] }),
    ),
  ).toEqual({ type: 'matches', matches: [match] });
  expect(parseTableWebViewMessage('{broken')).toEqual({
    type: 'matches',
    matches: [],
  });
  expect(parseTableWebViewMessage('120')).toEqual({
    type: 'height',
    height: 130,
  });
  expect(parseTableWebViewMessage('invalid')).toEqual({ type: 'invalid' });
});
test('표 준비 완료 시 대기를 해제하고 타이머를 정리한다', async () => {
  jest.useFakeTimers();

  try {
    const state = createTableLoadState();
    const pending = state.wait();
    state.complete();
    await pending;
    expect(jest.getTimerCount()).toBe(0);
    await state.wait();
    expect(jest.getTimerCount()).toBe(0);
  } finally {
    jest.useRealTimers();
  }
});
test('표 준비 시간 초과와 화면 해제도 대기를 종료한다', async () => {
  jest.useFakeTimers();

  try {
    const state = createTableLoadState();
    const pending = state.wait();
    jest.advanceTimersByTime(2000);
    await pending;
    const next = state.wait();
    state.release();
    await next;
    expect(jest.getTimerCount()).toBe(0);
  } finally {
    jest.useRealTimers();
  }
});

test('표의 키워드 선택·해제 메시지를 구분하고 잘못된 인덱스를 거부한다', () => {
  const message = { type: 'keywordPress', keyword: '졸음', index: 2 };
  expect(parseTableWebViewMessage(JSON.stringify(message))).toEqual(message);
  expect(parseTableWebViewMessage('{"type":"dismiss"}')).toEqual({
    type: 'dismiss',
  });

  for (const index of [-1, 1.2, '2', null]) {
    expect(
      parseTableWebViewMessage(JSON.stringify({ ...message, index })),
    ).toEqual({ type: 'invalid' });
  }
});

test('표에서 반복된 키워드를 누르면 해당 항목 인덱스를 전달한다', () => {
  const postMessage = jest.fn();
  const source = buildTableKeywordScript(['졸음']);
  const mark = { dataset: { keyword: '졸음', keywordIndex: '3' } };
  runInNewContext(
    source + '\nhandleKeywordPress({ target: { closest: () => mark } });',
    {
      window: {
        addEventListener: () => {},
        ReactNativeWebView: { postMessage },
      },
      mark,
    },
  );
  expect(JSON.parse(postMessage.mock.calls[0][0])).toEqual({
    type: 'keywordPress',
    keyword: '졸음',
    index: 3,
  });
});
