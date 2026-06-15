import { Text, View } from 'react-native';
import { styles } from './styles/Toast';
import { ToastConfigParams } from 'react-native-toast-message';

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
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    </View>
  );
};

export default Toast;
