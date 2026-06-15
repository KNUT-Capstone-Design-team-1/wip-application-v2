import Toast from '@components/common/Toast';
import { COLOR } from '@constants/color';
import { ToastConfigParams } from 'react-native-toast-message';

const toastConfig = {
  success: (props: ToastConfigParams<any>) => {
    return <Toast {...props} backgroundColor={COLOR['normal']} />;
  },
  error: (props: ToastConfigParams<any>) => {
    return <Toast {...props} backgroundColor={COLOR['error']} />;
  },
  default: (props: ToastConfigParams<any>) => {
    return <Toast {...props} />;
  },
};

export default toastConfig;
