import * as Clipboard from 'expo-clipboard';
import { Linking } from 'react-native';

// Expo/React Native 기반 기기 I/O 데이터 소스 구현체
export const deviceExpoDataSource = {
  // 클립보드에 문자열 복사
  async copyToClipboard(text: string): Promise<void> {
    await Clipboard.setStringAsync(text);
  },
  // 외부 URL/스킴 열기 (전화 다이얼러 등)
  async openUrl(url: string): Promise<void> {
    await Linking.openURL(url);
  },
};
