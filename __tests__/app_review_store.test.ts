import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { useReviewStore } from '../src/store/app_review_store';
import { useAppTrackStore } from '../src/store/app_track_store';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);
jest.mock('expo-store-review', () => ({
  hasAction: jest.fn(),
  requestReview: jest.fn(),
}));

const initialReviewState = {
  lastPromptDate: 0,
  lastPromptedActionCount: 0,
  hasAgreedToReview: false,
  hasDeclinedReview: false,
};

function setSearchCount(count: number) {
  useAppTrackStore.setState({
    coreActionCounts: {
      unified_search: count,
      identification_search: 100,
      image_search: 100,
    },
    reviewActionCounts: { detail_viewed: 100, bookmarked: 100 },
  });
}

beforeEach(async () => {
  await AsyncStorage.clear();
  await useReviewStore.persist.rehydrate();
  await useAppTrackStore.persist.rehydrate();
  useReviewStore.setState(initialReviewState);
  setSearchCount(0);
  jest.mocked(StoreReview.hasAction).mockResolvedValue(true);
  jest.mocked(StoreReview.requestReview).mockResolvedValue(undefined);
});

it('does not request a review before five unified searches, regardless of other actions', async () => {
  setSearchCount(4);
  await useReviewStore.getState().requestReviewIfEligible();
  expect(StoreReview.requestReview).not.toHaveBeenCalled();
});

it('requests once at five searches and never again after further searches', async () => {
  setSearchCount(5);
  await useReviewStore.getState().requestReviewIfEligible();
  setSearchCount(10);
  await useReviewStore.getState().requestReviewIfEligible();
  expect(StoreReview.requestReview).toHaveBeenCalledTimes(1);
});

it('retains the request history after storage is rehydrated on restart or update', async () => {
  setSearchCount(5);
  await useReviewStore.getState().requestReviewIfEligible();
  const saved = await AsyncStorage.getItem('app-review-storage');
  useReviewStore.setState(initialReviewState);
  await AsyncStorage.setItem('app-review-storage', saved!);
  await useReviewStore.persist.rehydrate();
  await useReviewStore.getState().requestReviewIfEligible();
  expect(StoreReview.requestReview).toHaveBeenCalledTimes(1);
});

it.each([
  { lastPromptDate: 1 },
  { lastPromptedActionCount: 5 },
  { hasAgreedToReview: true },
  { hasDeclinedReview: true },
])(
  'honors existing review history from previous app versions: %j',
  async (history) => {
    await AsyncStorage.setItem(
      'app-review-storage',
      JSON.stringify({
        state: { ...initialReviewState, ...history },
        version: 0,
      }),
    );
    await useReviewStore.persist.rehydrate();
    setSearchCount(20);
    await useReviewStore.getState().requestReviewIfEligible();
    expect(StoreReview.requestReview).not.toHaveBeenCalled();
  },
);

it('coalesces simultaneous review requests', async () => {
  setSearchCount(5);
  await Promise.all([
    useReviewStore.getState().requestReviewIfEligible(),
    useReviewStore.getState().requestReviewIfEligible(),
  ]);
  expect(StoreReview.requestReview).toHaveBeenCalledTimes(1);
});

it('allows a later attempt if the platform cannot request reviews yet', async () => {
  setSearchCount(5);
  jest.mocked(StoreReview.hasAction).mockResolvedValueOnce(false);
  await useReviewStore.getState().requestReviewIfEligible();
  expect(useReviewStore.getState().lastPromptDate).toBe(0);
  await useReviewStore.getState().requestReviewIfEligible();
  expect(StoreReview.requestReview).toHaveBeenCalledTimes(1);
});

it('allows retry after a failed native request', async () => {
  setSearchCount(5);
  const consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  try {
    jest
      .mocked(StoreReview.requestReview)
      .mockRejectedValueOnce(new Error('native failure'));
    await useReviewStore.getState().requestReviewIfEligible();
    expect(useReviewStore.getState().lastPromptDate).toBe(0);
    await useReviewStore.getState().requestReviewIfEligible();
    expect(StoreReview.requestReview).toHaveBeenCalledTimes(2);
  } finally {
    consoleError.mockRestore();
  }
});
