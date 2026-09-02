import { create } from 'zustand';

type ImageLoadComplete = {
  front: boolean;
  back: boolean;
};
export interface PillImages {
  front: string | null;
  back: string | null;
}

interface PillImageState {
  // 이미지 URI
  pillImages: PillImages;
  // 검색 중 상태
  isSearching: boolean;
  // 이미지 로드 방향
  direction: 'front' | 'back';
  // 이미지 로드 여부
  isImageLoadComplete: ImageLoadComplete;

  // 이미지 선택
  setFrontImage: (uri: string) => void;
  setBackImage: (uri: string) => void;
  setPillImages: (images: PillImages) => void;

  // UI 상태 변경
  setIsSearching: (isSearching: boolean) => void;
  // 이미지 로드 방향 선택
  setDirection: (direction: 'front' | 'back') => void;
  // 이미지 로드 완료
  setFrontImageOnLoad: (load: boolean) => void;
  setBackImageOnLoad: (load: boolean) => void;

  // 이미지 삭제
  removeFrontImage: () => void;
  removeBackImage: () => void;

  // 전체 초기화
  resetPillImages: () => void;
}

/**
 * 알약 이미지 검색 상태 관리를 위한 Dumb Store
 * - 비즈니스 로직을 포함하지 않으며 순수 state 및 setter만 관리합니다.
 * - 컴포넌트/서비스 층에서 필요한 상태를 직접 selector로 구독하여 사용합니다.
 */
export const usePillImageStore = create<PillImageState>((set) => ({
  pillImages: {
    front: null,
    back: null,
  },
  isSearching: false,
  direction: 'front',
  isImageLoadComplete: {
    front: false,
    back: false,
  },

  setFrontImage: (uri: string) =>
    set((state) => ({
      pillImages: { ...state.pillImages, front: uri },
    })),

  setBackImage: (uri: string) =>
    set((state) => ({
      pillImages: { ...state.pillImages, back: uri },
    })),

  setPillImages: (images: PillImages) =>
    set({
      pillImages: images,
    }),

  setIsSearching: (isSearching: boolean) => set({ isSearching }),

  setDirection: (direction: 'front' | 'back') => set({ direction }),

  setFrontImageOnLoad: (load: boolean) =>
    set((state) => ({
      isImageLoadComplete: { ...state.isImageLoadComplete, front: load },
    })),

  setBackImageOnLoad: (load: boolean) =>
    set((state) => ({
      isImageLoadComplete: { ...state.isImageLoadComplete, back: load },
    })),

  removeFrontImage: () =>
    set((state) => ({
      pillImages: { ...state.pillImages, front: null },
      isImageLoadComplete: { ...state.isImageLoadComplete, front: false },
    })),

  removeBackImage: () =>
    set((state) => ({
      pillImages: { ...state.pillImages, back: null },
      isImageLoadComplete: { ...state.isImageLoadComplete, back: false },
    })),

  resetPillImages: () =>
    set({
      pillImages: { front: null, back: null },
      isSearching: false,
      direction: 'front',
      isImageLoadComplete: { front: false, back: false },
    }),
}));
