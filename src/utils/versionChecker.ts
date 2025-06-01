// utils/versionChecker.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { Alert } from 'react-native';
import { Linking, Platform } from 'react-native';

// AsyncStorage 앱 버전 저장한 데이터의 key 값
const VERSION_KEY = 'app_version';

const parseVersion = (version: string) => {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
};

// 버전 변경 감지 기준
const isVersionChanged = (saved: any, current: any) => {
  return (
    saved.major !== current.major ||
    saved.minor !== current.minor ||
    saved.patch !== current.patch
  );
};

// 버전 업데이트 버튼 클릭 시 이동될 url
const openStore = () => {
  // app store url
  const iosUrl = 'itms-apps://itunes.apple.com/app/id[whatispill]';
  // play store url
  const androidUrl = 'market://details?id=com.mbm.whatispill';

  Linking.openURL(Platform.OS === 'ios' ? iosUrl : androidUrl).catch((err) =>
    console.error('스토어 열기 실패:', err)
  );
};

// 앱 버전 체크하는 함수
export const checkAppVersion = async () => {
  try {
    // ex: "1.2.3"
    const currentVersion = DeviceInfo.getVersion();
    // AsyncStorage에서 저장한 앱 버전 가져오기
    const savedVersion = await AsyncStorage.getItem(VERSION_KEY);

    if (!savedVersion) {
      await AsyncStorage.setItem(VERSION_KEY, currentVersion);
      return;
    }

    const saved = parseVersion(savedVersion);
    const current = parseVersion(currentVersion);

    // 버전 확인
    if (isVersionChanged(saved, current)) {
      Alert.alert(
        '업데이트 안내',
        `앱이 업데이트되었습니다.\n\n이전 버전: ${savedVersion}\n현재 버전: ${currentVersion}`,
        [
          {
            text: '닫기',
            style: 'cancel',
          },
          {
            text: '업데이트 하러 가기',
            onPress: openStore,
          },
        ]
      );

      await AsyncStorage.setItem(VERSION_KEY, currentVersion);
    }
  } catch (e) {
    console.error('버전 체크 중 오류:', e);
  }
};
