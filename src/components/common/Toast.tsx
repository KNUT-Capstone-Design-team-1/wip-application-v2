import { View } from 'react-native';
import { styles } from './styles/Toast';
import { ToastConfigParams } from 'react-native-toast-message';
import { BaseText } from './BaseText';

const Toast = ({
  text1,
  backgroundColor,
}: ToastConfigParams<any> & { backgroundColor?: string }) => {
  return (
    <View style={styles.toastContainer}>
      <View
        style={[
          styles.toastContent,
          { backgroundColor: backgroundColor ?? 'rgba(0, 0, 0, 0.8)' },
        ]}
      >
        <BaseText weight={'medium'} size={14} style={styles.toastText}>
          {text1}
        </BaseText>
      </View>
    </View>
  );
};

export default Toast;
