import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TCoreAction = 'unified_search' | 'identification_search' | 'image_search';

type TSubAction = 'save_pill' | 'nearby_pharmacy';

interface IAppTrackStore {
  appLaunchCount: number;
  coreActionCounts: Record<TCoreAction, number>;
  subActionCounts: Record<TSubAction, number>;
  increaseAppLaunchCount: () => void;
  increaseCoreActionCount: (actionType: TCoreAction) => void;
  increaseSubActionCount: (actionType: TSubAction) => void;
  getTotalCoreActionCount: () => number;
  getTotalSubActionCount: () => number;
  getTotalActionCount: () => number;
}

export const useAppTrackStore = create<IAppTrackStore>()(
  persist(
    (set, get) => ({
      coreActionCounts: {
        unified_search: 0,
        identification_search: 0,
        image_search: 0,
      },
      subActionCounts: {
        save_pill: 0,
        nearby_pharmacy: 0,
      },
      appLaunchCount: 0,
      increaseCoreActionCount: (actionType: TCoreAction) =>
        set((state) => ({
          coreActionCounts: {
            ...state.coreActionCounts,
            [actionType]: state.coreActionCounts[actionType] + 1,
          },
        })),
      increaseSubActionCount: (actionType: TSubAction) =>
        set((state) => ({
          subActionCounts: {
            ...state.subActionCounts,
            [actionType]: state.subActionCounts[actionType] + 1,
          },
        })),
      increaseAppLaunchCount: () =>
        set((state) => ({ appLaunchCount: state.appLaunchCount + 1 })),
      getTotalCoreActionCount: () => {
        const state = get();
        const coreActionCounts = state.coreActionCounts;
        return Object.values(coreActionCounts).reduce(
          (acc, count) => acc + count,
          0,
        );
      },
      getTotalSubActionCount: () => {
        const state = get();
        const subActionCounts = state.subActionCounts;
        return Object.values(subActionCounts).reduce(
          (acc, count) => acc + count,
          0,
        );
      },
      getTotalActionCount: () => {
        const coreActions = get().getTotalCoreActionCount();
        const subActions = get().getTotalSubActionCount();
        return coreActions + subActions;
      },
    }),
    {
      name: 'app_track_store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
