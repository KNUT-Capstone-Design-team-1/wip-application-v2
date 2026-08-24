import { create } from 'zustand';

import { StyleProp, ViewStyle, TextStyle } from 'react-native';

interface IModalOptions {
  // 텍스트 및 콘텐츠
  title?: string;
  message?: string | React.ReactNode;

  // 버튼 설정
  cancelText?: string;
  confirmText?: string;
  confirmStyle?: 'default' | 'destructive';
  hideCancel?: boolean;

  // 콜백 함수
  onCancel?: () => void;
  onConfirm?: () => void;
  onBackdropPress?: () => void; // 배경(오버레이) 터치 시 실행될 콜백

  // 커스텀 스타일 속성 (개별 컴포넌트 커스텀용)
  overlayStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
  cancelButtonStyle?: StyleProp<ViewStyle>;
  cancelButtonTextStyle?: StyleProp<TextStyle>;
  confirmButtonStyle?: StyleProp<ViewStyle>;
  confirmButtonTextStyle?: StyleProp<TextStyle>;
}

interface ICommonModalState {
  isVisible: boolean;
  options: IModalOptions;
  showModal: (options: IModalOptions) => void;
  hideModal: () => void;
}

// 앱 전역 모달의 기본 옵션값
const defaultOptions: IModalOptions = {
  title: '안내',
  message: '',
  cancelText: '취소',
  confirmText: '확인',
  confirmStyle: 'default',
  hideCancel: false,
};

// 공통 모달의 전역 상태를 관리하는 Zustand 스토어
export const useCommonModalStore = create<ICommonModalState>((set) => ({
  isVisible: false,
  options: defaultOptions,

  // 모달을 화면에 표시 (기본 옵션에 새로운 옵션을 덮어씌움)
  showModal: (options) =>
    set({
      isVisible: true,
      options: { ...defaultOptions, ...options },
    }),

  // 모달을 숨기고 콜백 함수들(onCancel, onConfirm)만 메모리에서 제거
  hideModal: () =>
    set((state) => ({
      isVisible: false,
      options: { ...state.options, onCancel: undefined, onConfirm: undefined },
    })),
}));
