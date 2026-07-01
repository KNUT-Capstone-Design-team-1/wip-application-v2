import { create } from 'zustand';

export interface PillImages {
  front: string | null;
  back: string | null;
}

interface PillImageState {
  // 이미지 URI
  pillImages: PillImages;
  // UI 상태 (촬영 완료 여부)
  hasImage: boolean;
  // 검색 중 상태
  isSearching: boolean;

  // 이미지 선택
  setFrontImage: (uri: string) => void;
  setBackImage: (uri: string) => void;
  setPillImages: (images: PillImages) => void;

  // UI 상태 변경
  setHasImage: (hasImage: boolean) => void;
  setIsSearching: (isSearching: boolean) => void;

  // 이미지 삭제
  removeFrontImage: () => void;
  removeBackImage: () => void;

  // 전체 초기화
  resetPillImages: () => void;
}

export const usePillImageStore = create<PillImageState>((set) => ({
  pillImages: {
    front: null,
    back: null,
  },
  hasImage: false,
  isSearching: false,

  setFrontImage: (uri: string) =>
    set((state) => ({
      pillImages: { ...state.pillImages, front: uri },
    })),

  setBackImage: (uri: string) =>
    set((state) => ({
      pillImages: { ...state.pillImages, back: uri },
      hasImage: true, // 뒷면까지 선택되면 자동으로 완료 상태
    })),

  setPillImages: (images: PillImages) =>
    set({
      pillImages: images,
      hasImage: !!(images.front && images.back),
    }),

  setHasImage: (hasImage: boolean) => set({ hasImage }),

  setIsSearching: (isSearching: boolean) => set({ isSearching }),

  removeFrontImage: () =>
    set((state) => ({
      pillImages: { ...state.pillImages, front: null },
      hasImage: false,
    })),

  removeBackImage: () =>
    set((state) => ({
      pillImages: { ...state.pillImages, back: null },
      hasImage: false,
    })),

  resetPillImages: () =>
    set({
      pillImages: { front: null, back: null },
      hasImage: false,
      isSearching: false,
    }),
}));
