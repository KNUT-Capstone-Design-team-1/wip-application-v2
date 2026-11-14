import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { useAppTrackStore } from './app_track_store';

const REVIEW_CONFIG = {
  MIN_UNIFIED_SEARCHES: 5,
};

let reviewRequestInFlight = false;

interface ReviewState {
  lastPromptDate: number;
  // 기존 버전의 요청 이력도 유지하여 업데이트 후 재요청을 방지한다.
  lastPromptedActionCount: number;
  hasAgreedToReview: boolean;
  hasDeclinedReview: boolean;

  requestReviewIfEligible: () => Promise<void>;
  markReviewAgreed: () => void;
  markReviewDeclined: () => void;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      lastPromptDate: 0,
      lastPromptedActionCount: 0,
      hasAgreedToReview: false,
      hasDeclinedReview: false,

      requestReviewIfEligible: async () => {
        if (reviewRequestInFlight) return;
        reviewRequestInFlight = true;

        try {
          // 저장된 요청 이력을 읽기 전에 판단하면 앱 재시작 시 중복 요청할 수 있다.
          if (!useReviewStore.persist.hasHydrated()) {
            await useReviewStore.persist.rehydrate();
          }
          if (!useAppTrackStore.persist.hasHydrated()) {
            await useAppTrackStore.persist.rehydrate();
          }

          const {
            lastPromptDate,
            lastPromptedActionCount,
            hasAgreedToReview,
            hasDeclinedReview,
          } = get();

          if (
            lastPromptDate > 0 ||
            lastPromptedActionCount > 0 ||
            hasAgreedToReview ||
            hasDeclinedReview
          )
            return;

          const searchCount =
            useAppTrackStore.getState().coreActionCounts.unified_search;
          if (searchCount < REVIEW_CONFIG.MIN_UNIFIED_SEARCHES) return;
          if (!(await StoreReview.hasAction())) return;

          // OS는 별점 제출 여부를 반환하지 않으므로 요청 자체를 1회로 제한한다.
          set({
            lastPromptDate: Date.now(),
            lastPromptedActionCount: searchCount,
          });
          try {
            await StoreReview.requestReview();
          } catch (error) {
            set({ lastPromptDate: 0, lastPromptedActionCount: 0 });
            throw error;
          }
        } catch (error) {
          console.error('[StoreReview] Failed to show OS prompt:', error);
        } finally {
          reviewRequestInFlight = false;
        }
      },

      markReviewAgreed: () => set({ hasAgreedToReview: true }),
      markReviewDeclined: () => set({ hasDeclinedReview: true }),
    }),
    {
      name: 'app-review-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
