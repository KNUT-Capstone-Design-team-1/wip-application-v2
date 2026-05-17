import { create } from 'zustand';
import { MarkData } from '../types/mark_types';
import { useSearchIdStore } from './search_id_store';

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
  setSelectedMark: (mark: MarkData) => {
    set({
      selectedMarkCode: mark.code,
      selectedMarkTitle: mark.title,
      selectedMarkBase64: mark.base64,
    });

    // search_id_store에도 마크 코드 설정
    useSearchIdStore.getState().setMarkCodeFront(mark.code);
    useSearchIdStore.getState().setMarkCodeBack(mark.code);
  },

  setSelectedMarkTitle: (title: string) => set({ selectedMarkTitle: title }),
  setSelectedMarkBase64: (img: string) => set({ selectedMarkBase64: img }),

  // 전체 마크 정보 리셋
  resetSelectedMark: () => {
    set({
      selectedMarkCode: '',
      selectedMarkBase64: '',
      selectedMarkTitle: '',
    });

    // search_id_store의 마크 코드도 리셋
    useSearchIdStore.getState().setMarkCodeFront('');
    useSearchIdStore.getState().setMarkCodeBack('');
  },

  // 하위 호환성을 위해 유지 (deprecated)
  resetSelectedMarkBase64: () => {
    set({
      selectedMarkCode: '',
      selectedMarkBase64: '',
      selectedMarkTitle: '',
    });

    // search_id_store의 마크 코드도 리셋
    useSearchIdStore.getState().setMarkCodeFront('');
    useSearchIdStore.getState().setMarkCodeBack('');
  },
}));
