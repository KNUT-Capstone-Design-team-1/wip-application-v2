// App.jsx
import { font, os } from '@/style/font';
import { StyleSheet, Text, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

const styles = StyleSheet.create({
  noteTextWrapper: {
    maxWidth: '90%',
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#000000d2',
    borderRadius: 18,
  },
  errorTextWrapper: {
    maxWidth: '90%',
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#c51111e8',
    borderRadius: 18,
  },
  noteText: {
    color: '#ffffff',
    fontSize: font(14),
    fontFamily: os.font(500, 500),
    includeFontPadding: false,
    paddingBottom: 0,
    textAlign: 'center',
  },
  errorText: {
    color: '#ffffff',
    fontSize: font(14),
    fontFamily: os.font(500, 500),
    includeFontPadding: false,
    paddingBottom: 0,
    textAlign: 'center',
  }
})

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),
  errorToast: ({ text1, props }: any) => (
    <Shadow startColor='#7d7d7d12' distance={10} offset={[0, 2]}>
      <View style={styles.errorTextWrapper}>
        <Text style={styles.errorText}>{text1}</Text>
      </View>
    </Shadow>
  ),
  noteToast: ({ text1, props }: any) => (
    <Shadow startColor='#7d7d7d12' distance={10} offset={[0, 2]}>
      <View style={styles.noteTextWrapper}>
        <Text style={styles.noteText}>{text1}</Text>
      </View>
    </Shadow>
  )
};