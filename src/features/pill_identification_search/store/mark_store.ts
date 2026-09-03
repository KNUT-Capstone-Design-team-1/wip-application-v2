import { create } from 'zustand';
import { MarkData } from '../types/identification_mark_type';
import { useSearchIdStore } from './search_id_store';

// 마크 스토어 인터페이스
export interface IMarkStore {
  selectedMarkCode: string;
  selectedMarkBase64: string;
  selectedMarkTitle: string;
  setSelectedMark: (mark: MarkData) => void;
  setSelectedMarkTitle: (title: string) => void;
  setSelectedMarkBase64: (img: string) => void;
  resetSelectedMark: () => void;
  resetSelectedMarkBase64: () => void;
}

// 식별 마크 선택 상태 관리 Zustand 스토어 (Presentation State)
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

    // search_id_store에도 마크 코드 동기화 설정
    useSearchIdStore.getState().setMarkCodeFront(mark.code);
    useSearchIdStore.getState().setMarkCodeBack(mark.code);
  },

  // 마크 타이틀 설정
  setSelectedMarkTitle: (title: string) =>
    set({
      selectedMarkTitle: title,
    }),

  // 마크 이미지 설정
  setSelectedMarkBase64: (img: string) =>
    set({
      selectedMarkBase64: img,
    }),

  // 전체 마크 정보 초기화
  resetSelectedMark: () => {
    set({
      selectedMarkCode: '',
      selectedMarkBase64: '',
      selectedMarkTitle: '',
    });

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

    useSearchIdStore.getState().setMarkCodeFront('');
    useSearchIdStore.getState().setMarkCodeBack('');
  },
}));
