import axios from 'axios';
import { getToken } from '../src/services/apis/cloud_flare/token';
import { requestUnifiedSearch } from '../src/services/apis/cloud_flare/wip_unified_search';

jest.mock('axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
  isAxiosError: (error: { isAxiosError?: boolean }) =>
    error?.isAxiosError === true,
}));
jest.mock('../src/services/apis/cloud_flare/token', () => ({
  getToken: jest.fn(),
}));

const fallback = '통합 검색에 실패했습니다.\n나중에 다시 시도해 주세요.';

beforeEach(() => {
  jest.mocked(getToken).mockResolvedValue('test-token');
});

it.each([
  [{ message: '검색 서버 오류' }, '검색 서버 오류'],
  [{ error: '검색 처리 실패' }, '검색 처리 실패'],
  [{ message: { detail: 'internal error' } }, fallback],
  [{ message: '', error: '검색 처리 실패' }, '검색 처리 실패'],
  [{ errors: ['internal error'] }, fallback],
  ['검색에 실패했습니다', '검색에 실패했습니다'],
  [undefined, fallback],
  [null, fallback],
  ['', fallback],
])(
  'returns a renderable message for error response %j',
  async (data, message) => {
    jest.mocked(axios.get).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 500, data },
    });
    await expect(requestUnifiedSearch(['메타'])).resolves.toEqual({
      success: false,
      message,
    });
  },
);

it('returns a failure when token generation fails', async () => {
  jest.mocked(getToken).mockRejectedValueOnce(new Error('token failure'));
  await expect(requestUnifiedSearch(['메타'])).resolves.toEqual({
    success: false,
    message: fallback,
  });
});

it('handles non-HTTP failures without exposing the stack', async () => {
  jest.mocked(axios.get).mockRejectedValueOnce(new Error('request failure'));
  await expect(requestUnifiedSearch(['독감'])).resolves.toEqual({
    success: false,
    message: fallback,
  });
});

it('preserves successful results and encodes the keyword and cursor', async () => {
  const data = { results: ['123'], nextCursor: 'next', hasMore: true };
  jest.mocked(axios.get).mockResolvedValueOnce({ data });
  await expect(requestUnifiedSearch(['독감'], 100, 'a+b')).resolves.toEqual({
    success: true,
    data,
    message: '',
  });
  expect(axios.get).toHaveBeenCalledWith(
    expect.stringContaining(
      'keyword=%EB%8F%85%EA%B0%90&limit=100&v=2&cursor=a%2Bb',
    ),
    expect.objectContaining({
      headers: expect.objectContaining({ 'x-auth-token': 'test-token' }),
    }),
  );
});
