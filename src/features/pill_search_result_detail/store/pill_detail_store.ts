import type {
  PillDetailState,
  PillDetailRoute,
} from '../types/pill_detail_type';
import { createStore } from 'zustand/vanilla';

// 상세 화면별 데이터·단순 Setter 생성.
export const createPillDetailStore = (route: PillDetailRoute) =>
  createStore<PillDetailState>((set) => ({
    ...route,
    pillData: null,
    loading: true,
    detailLoading: true,
    classificationLoading: true,
    savedFolderIds: [],
    isFolderModalVisible: false,
    hasSaved: false,
    setPillData: (pillData) => set({ pillData }),
    setLoading: (loading) => set({ loading }),
    setDetailLoading: (detailLoading) => set({ detailLoading }),
    setClassificationLoading: (classificationLoading) =>
      set({ classificationLoading }),
    setSavedFolderIds: (savedFolderIds) => set({ savedFolderIds }),
    setFolderModalVisible: (isFolderModalVisible) =>
      set({ isFolderModalVisible }),
    setHasSaved: (hasSaved) => set({ hasSaved }),
  }));
