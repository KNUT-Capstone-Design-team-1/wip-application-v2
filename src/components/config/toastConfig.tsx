import React from 'react';
import Toast from '@components/common/Toast';
import { ToastConfigParams } from 'react-native-toast-message';

// 앱 전역 토스트 메시지 스타일 설정 (전체 회색/다크 톤으로 통일)
const toastConfig = {
  success: (props: ToastConfigParams<any>) => {
    return <Toast {...props} />;
  },
  error: (props: ToastConfigParams<any>) => {
    return <Toast {...props} />;
  },
  info: (props: ToastConfigParams<any>) => {
    return <Toast {...props} />;
  },
  default: (props: ToastConfigParams<any>) => {
    return <Toast {...props} />;
  },
};

export default toastConfig;
