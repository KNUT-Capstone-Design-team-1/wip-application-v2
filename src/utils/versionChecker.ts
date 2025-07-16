interface IAppVersion {
  appStoreVersion: string;
  playStoreVersion: string;
}

// utils/versionChecker.ts
import { Alert } from 'react-native';
import { Linking, Platform } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import { isIos } from '@/utils/checker.ts';
import { apiClient } from '@api/apiClient.ts';

let fetchedVersion = '';

// 버전 업데이트 버튼 클릭 시 이동될 url
const openStore = () => {
  // app store url
  const iosUrl = 'itms-apps://itunes.apple.com/app/id[whatispill]';
  // play store url
  const androidUrl = 'market://details?id=com.mbm.whatispill';

  Linking.openURL(Platform.OS === 'ios' ? iosUrl : androidUrl).catch((err) =>
    console.error('스토어 열기 실패:', err),
  );

  // 스토어 열렸을 때 앱 강제 종료
  RNExitApp.exitApp();
};

const fetchLatestVersion = async () => {
  const { appStoreVersion, playStoreVersion }: IAppVersion =
    await apiClient.get(Config.GOOGLE_CLOUD_INIT_INFO_URL as string);

  // ios, android 각각 버전 가져오기
  fetchedVersion = isIos ? String(appStoreVersion) : String(playStoreVersion);
  return fetchedVersion;
};

// 앱 버전 체크하는 함수
export const checkAppVersion = async () => {
  const latestVersionNumber = await fetchLatestVersion();
  const currentVersionNumber = String(DeviceInfo.getVersion());

  try {
    if (latestVersionNumber > currentVersionNumber) {
      Alert.alert(
        '업데이트 안내',
        `앱이 업데이트되었습니다.\n업데이트 후 사용해주세요.\n\n현재 버전: ${currentVersionNumber} \n새로운 버전: ${latestVersionNumber}`,
        [{ text: '업데이트 하러 가기', onPress: openStore }],
      );
    }
  } catch (e) {
    console.error('버전 체크 중 오류:', e);
  }
};
