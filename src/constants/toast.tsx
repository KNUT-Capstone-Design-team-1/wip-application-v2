import { font, os } from '@/style/font';
import { StyleSheet, Text, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { BaseToast } from 'react-native-toast-message';

const styles = StyleSheet.create({
  errorText: {
    color: '#ffffff',
    fontFamily: os.font(500, 500),
    fontSize: font(14),
    includeFontPadding: false,
    paddingBottom: 0,
    textAlign: 'center',
  },
  errorTextWrapper: {
    backgroundColor: '#c51111e8',
    borderRadius: 18,
    maxWidth: '90%',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  noteText: {
    color: '#ffffff',
    fontFamily: os.font(500, 500),
    fontSize: font(14),
    includeFontPadding: false,
    paddingBottom: 0,
    textAlign: 'center',
  },
  noteTextWrapper: {
    backgroundColor: '#000000d2',
    borderRadius: 18,
    maxWidth: '90%',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
});

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 15, fontWeight: '400' }}
    />
  ),
  errorToast: ({ text1, props }: any) => (
    <Shadow startColor="#7d7d7d12" distance={10} offset={[0, 2]}>
      <View style={styles.errorTextWrapper}>
        <Text style={styles.errorText}>{text1}</Text>
      </View>
    </Shadow>
  ),
  noteToast: ({ text1, props }: any) => (
    <Shadow startColor="#7d7d7d12" distance={10} offset={[0, 2]}>
      <View style={styles.noteTextWrapper}>
        <Text style={styles.noteText}>{text1}</Text>
      </View>
    </Shadow>
  ),
};
