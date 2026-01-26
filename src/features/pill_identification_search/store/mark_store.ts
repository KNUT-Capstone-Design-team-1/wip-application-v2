import { create } from 'zustand';
import { MarkData } from '../types/mark_types';

interface IMarkStore {
  selectedMarkCode: string;
  selectedMarkBase64: string;
  selectedMarkTitle: string;
  setSelectedMark: (mark: MarkData) => void;
  setSelectedMarkTitle: (title: string) => void;
  setSelectedMarkBase64: (img: string) => void;
  resetSelectedMark: () => void;
  // 하위 호환성을 위해 유지
  resetSelectedMarkBase64: () => void;
}

export const useMarkStore = create<IMarkStore>((set) => ({
  selectedMarkCode: '',
  selectedMarkBase64: '',
  selectedMarkTitle: '',

  // 마크 전체 정보 설정
  setSelectedMark: (mark: MarkData) =>
    set({
      selectedMarkCode: mark.code,
      selectedMarkTitle: mark.title,
      selectedMarkBase64: mark.base64,
    }),

  setSelectedMarkTitle: (title: string) => set({ selectedMarkTitle: title }),
  setSelectedMarkBase64: (img: string) => set({ selectedMarkBase64: img }),

  // 전체 마크 정보 리셋
  resetSelectedMark: () =>
    set({
      selectedMarkCode: '',
      selectedMarkBase64: '',
      selectedMarkTitle: '',
    }),

  // 하위 호환성을 위해 유지 (deprecated)
  resetSelectedMarkBase64: () =>
    set({
      selectedMarkCode: '',
      selectedMarkBase64: '',
      selectedMarkTitle: '',
    }),
}));
