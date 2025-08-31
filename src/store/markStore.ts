import { create } from 'zustand';

// 상태와 액션 타입 정의
interface MarkStore {
  selectedMarkBase64: string;
  setSelectedMarkBase64: (img: string) => void;
  resetSelectedMarkBase64: () => void;
}

// 스토어 생성
export const useMarkStore = create<MarkStore>((set) => ({
  selectedMarkBase64: '',
  setSelectedMarkBase64: (img: string) => set({ selectedMarkBase64: img }),
  resetSelectedMarkBase64: () =>
    set({ selectedMarkBase64: '' }),
}));
