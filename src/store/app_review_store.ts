// store/useReviewStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { useAppTrackStore } from './app_track_store';

const REVIEW_CONFIG = {
  MIN_TOTAL_ACTIONS: 5,
  COOLDOWN_MS: 30 * 24 * 60 * 60 * 1000,
};

interface ReviewState {
  lastPromptDate: number;
  // 팝업을 띄웠을 당시의 누적 액션 수를 기억하는 상태 추가
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
      lastPromptedActionCount: 0, // 초기값 0
      hasAgreedToReview: false,
      hasDeclinedReview: false,

      requestReviewIfEligible: async () => {
        const {
          lastPromptDate,
          lastPromptedActionCount,
          hasAgreedToReview,
          hasDeclinedReview,
        } = get();

        if (hasAgreedToReview || hasDeclinedReview) return;

        const now = Date.now();
        const isCooldownPassed =
          now - lastPromptDate > REVIEW_CONFIG.COOLDOWN_MS;

        if (!isCooldownPassed && lastPromptDate !== 0) return;

        // 트래킹 스토어에서 영구 누적된 데이터를 그대로 가져옴
        const trackingState = useAppTrackStore.getState().reviewActionCounts;
        const currentTotalActions = Object.values(trackingState).reduce(
          (total, count) => total + count,
          0,
        );

        // [핵심 변경점] 현재 누적값에서 마지막 팝업 당시의 누적값을 뺌 (Delta 계산)
        const actionsSinceLastPrompt =
          currentTotalActions - lastPromptedActionCount;

        // 뺀 값이 기준치(5회)를 넘겼는지 확인
        if (actionsSinceLastPrompt < REVIEW_CONFIG.MIN_TOTAL_ACTIONS) return;

        if (await StoreReview.hasAction()) {
          try {
            await StoreReview.requestReview();

            // 트래킹 리셋 없이, 리뷰 스토어에 "현재 누적값"을 새롭게 기록
            set({
              lastPromptDate: now,
              lastPromptedActionCount: currentTotalActions, // 5 -> 10 -> 15로 갱신됨
            });
          } catch (error) {
            console.error('[StoreReview] Failed to show OS prompt:', error);
          }
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
