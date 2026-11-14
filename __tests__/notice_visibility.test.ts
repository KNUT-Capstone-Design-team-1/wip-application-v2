import AsyncStorage from '@react-native-async-storage/async-storage';
import { noticeRepository } from '../src/features/notice/data/repositories/notice_repository';
import { noticeService } from '../src/features/notice/services/notice_service';
import { useNoticeStore } from '../src/features/notice/store/notice_store';
import { useNotices } from '../src/features/notice/hooks/use_notice';
import { useBottomSheet } from '../src/features/notice/hooks/use_bottom_sheet';
import type { INoticeData } from '../src/features/notice/types/notice_type';

// Exercise loading and visibility against the real store without mounting native UI.
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: (callback: unknown) => callback,
  useMemo: (factory: () => unknown) => factory(),
}));
jest.mock('zustand/react/shallow', () => ({
  useShallow: (selector: unknown) => selector,
}));
jest.mock('../src/features/notice/store/notice_store', () => {
  const actual = jest.requireActual(
    '../src/features/notice/store/notice_store',
  );
  return {
    useNoticeStore: Object.assign(
      (selector: (state: unknown) => unknown) =>
        selector(actual.useNoticeStore.getState()),
      actual.useNoticeStore,
    ),
  };
});
jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));
jest.mock('@utils/logger', () => ({
  __esModule: true,
  default: { error: jest.fn() },
}));
jest.mock('../src/features/notice/data/repositories/notice_repository', () => ({
  noticeRepository: {
    fetchRemoteNotices: jest.fn(),
    getCachedNotices: jest.fn(),
    saveCachedNotices: jest.fn(),
  },
}));

const notice = (idx: number, mustRead: number | boolean): INoticeData => ({
  idx,
  title: `공지 ${idx}`,
  contents: '내용',
  createDate: '2026-11-14',
  updateDate: '2026-11-14',
  mustRead: mustRead as number,
});

beforeEach(async () => {
  await AsyncStorage.clear();
  useNoticeStore.setState({
    noticeData: [],
    mainBottomSheetData: [],
    isVisibleBottomSheet: false,
    isNeverShowAgain: false,
  });
  jest.mocked(noticeRepository.getCachedNotices).mockResolvedValue(null);
  jest.mocked(noticeRepository.fetchRemoteNotices).mockResolvedValue([]);
});

it('accepts boolean and numeric must-read flags and sorts them first', () => {
  const sorted = noticeService.sortNotices([
    notice(3, false),
    notice(1, true),
    notice(2, 1),
    notice(4, 0),
  ]);
  expect(
    noticeService.filterMustReadNotices(sorted).map((item) => item.idx),
  ).toEqual([2, 1]);
  expect(sorted.map((item) => item.mustRead)).toEqual([1, 1, 0, 0]);
});

it.each([{ cached: [] }, { cached: [notice(1, 0)] }])(
  'updates the bottom sheet from the server even with stale cache %j',
  async ({ cached }) => {
    jest.mocked(noticeRepository.getCachedNotices).mockResolvedValue(cached);
    jest
      .mocked(noticeRepository.fetchRemoteNotices)
      .mockResolvedValue([notice(2, true)]);
    await useNotices().getNoticeBottomSheet();
    expect(useNoticeStore.getState().mainBottomSheetData).toEqual([
      notice(2, 1),
    ]);
    await useBottomSheet().checkShouldShow();
    expect(useNoticeStore.getState().isVisibleBottomSheet).toBe(true);
  },
);

it('keeps cached must-read notices when refreshing fails', async () => {
  jest
    .mocked(noticeRepository.getCachedNotices)
    .mockResolvedValue([notice(1, 1)]);
  jest
    .mocked(noticeRepository.fetchRemoteNotices)
    .mockRejectedValueOnce(new Error('offline'));
  await useNotices().getNoticeBottomSheet();
  expect(useNoticeStore.getState().mainBottomSheetData).toEqual([notice(1, 1)]);
  expect(noticeRepository.saveCachedNotices).not.toHaveBeenCalled();
});

it('honors today-only dismissal while still refreshing the data', async () => {
  await AsyncStorage.setItem(
    'bottomSheetHiddenUntil',
    String(Date.now() + 60000),
  );
  jest
    .mocked(noticeRepository.fetchRemoteNotices)
    .mockResolvedValue([notice(2, 1)]);
  await useNotices().getNoticeBottomSheet();
  await useBottomSheet().checkShouldShow();
  expect(useNoticeStore.getState().isVisibleBottomSheet).toBe(false);
  expect(useNoticeStore.getState().isNeverShowAgain).toBe(true);
});

it('shows notices again after the stored dismissal expires, even if memory still says hidden', async () => {
  useNoticeStore.setState({ isNeverShowAgain: true });
  await AsyncStorage.setItem('bottomSheetHiddenUntil', String(Date.now() - 1));
  jest
    .mocked(noticeRepository.fetchRemoteNotices)
    .mockResolvedValue([notice(2, 1)]);
  await useNotices().getNoticeBottomSheet();
  await useBottomSheet().checkShouldShow();
  expect(useNoticeStore.getState().isVisibleBottomSheet).toBe(true);
  expect(useNoticeStore.getState().isNeverShowAgain).toBe(false);
  expect(await AsyncStorage.getItem('bottomSheetHiddenUntil')).toBeNull();
});
