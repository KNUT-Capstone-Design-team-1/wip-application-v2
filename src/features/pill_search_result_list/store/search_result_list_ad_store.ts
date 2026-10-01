import { create } from 'zustand';

export interface ISearchResultListAdStore {
  visibleAdSlotIds: Set<string>;
  setVisibleAdSlotIds: (
    updater: Set<string> | ((prev: Set<string>) => Set<string>),
  ) => void;
  resetAdSlots: () => void;
}

/**
 * 검색 결과 리스트 내 광고 슬롯 노출(Visibility) 전용 독립 Zustand 스토어
 * - FlashList 본체의 extraData 오염을 방지하고
 * - 각 SearchResultAdItem이 자신의 adId에 대해서만 독립 구독하여 리렌더링을 격리함
 */
export const useSearchResultListAdStore = create<ISearchResultListAdStore>(
  (set) => ({
    visibleAdSlotIds: new Set<string>(),

    setVisibleAdSlotIds: (updater) =>
      set((state) => {
        const nextSet =
          typeof updater === 'function'
            ? updater(state.visibleAdSlotIds)
            : updater;

        // 크기와 요소가 동일하면 상태 업데이트 방지 (불필요한 리렌더링 차단)
        if (state.visibleAdSlotIds.size === nextSet.size) {
          let isSame = true;
          for (const id of nextSet) {
            if (!state.visibleAdSlotIds.has(id)) {
              isSame = false;
              break;
            }
          }
          if (isSame) {
            return state;
          }
        }

        return { visibleAdSlotIds: nextSet };
      }),

    resetAdSlots: () => set({ visibleAdSlotIds: new Set<string>() }),
  }),
);
