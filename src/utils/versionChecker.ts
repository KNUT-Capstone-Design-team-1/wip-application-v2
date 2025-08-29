import { Alert, Linking, Platform } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import DeviceInfo from 'react-native-device-info';
import { isIos } from '@/utils/checker';
import { apiClient } from '@api/apiClient';

interface IAppVersion {
  appStoreVersion: string;
  playStoreVersion: string;
}

let fetchedVersion = '';

// 버전 업데이트 버튼 클릭 시 이동될 url
const openStore = () => {
  const iosUrl = 'itms-apps://itunes.apple.com/app/id[whatispill]'; // app store url
  const androidUrl = 'market://details?id=com.mbm.whatispill'; // play store url

  Linking.openURL(Platform.OS === 'ios' ? iosUrl : androidUrl).catch((err) =>
    console.error('스토어 열기 실패:', err),
  );

  // 스토어 열렸을 때 앱 강제 종료
  RNExitApp.exitApp();
};

// 애플리케이션의 OS 별 최신 버전 조회
const fetchLatestVersion = async () => {
  const { appStoreVersion, playStoreVersion }: IAppVersion =
    await apiClient.get(
      process.env.EXPO_PUBLIC_GOOGLE_CLOUD_INIT_INFO_URL as string,
    );

  // ios, android 각각 버전 가져오기
  fetchedVersion = isIos ? String(appStoreVersion) : String(playStoreVersion);
  return fetchedVersion;
};

// 시맨틱 버저닝을 기준으로 각 버전 자리에 가중치를 곱한 값 반환
const getVersionNumber = (version: string) => {
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    return 0;
  }

  const [major, minor, patch] = version
    .split('.')
    .map((v) => parseInt(v, 10) || 0);

  return major * 10000000 + minor * 10000 + patch;
};

// 앱 버전 체크하는 함수
export const checkAppVersion = async () => {
  const latestVersion = await fetchLatestVersion();
  const currentVersion = String(DeviceInfo.getVersion());

  try {
    if (getVersionNumber(latestVersion) > getVersionNumber(currentVersion)) {
      Alert.alert(
        '업데이트 안내',
        `앱이 업데이트되었습니다.\n업데이트 후 사용해주세요.\n\n현재 버전: ${currentVersion} \n새로운 버전: ${latestVersion}`,
        [{ text: '업데이트 하러 가기', onPress: openStore }],
      );
    }
  } catch (e) {
    console.error('버전 체크 중 오류:', e);
  }
};
