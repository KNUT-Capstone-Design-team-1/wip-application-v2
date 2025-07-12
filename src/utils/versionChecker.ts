// utils/versionChecker.ts
import { Alert } from 'react-native';
import { Linking, Platform } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import { getToken } from "@api/client/auth.ts";
import axios from "axios";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import { isIos } from "@/utils/checker.ts";

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

const versionToNumber = (version: string) => {
  const parts = version.split('.').map(Number);
  const [major = 0, minor = 0, patch = 0] = parts;

  return major * 10000 + minor * 100 + patch;
};

const fetchLatestVersion = async () => {
  const token = getToken();
  const response = await axios.get(
    Config.GOOGLE_CLOUD_INIT_INFO_URL as string,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  // ios, android 각각 버전 가져오기
  return isIos
    ? String(response.data.appStoreVersion)
    : String(response.data.playStoreVersion);
};

// 앱 버전 체크하는 함수
export const checkAppVersion = async () => {
  // ios 일 땐 return 시켜주기 ios 배포되면 주석 해제
  if (isIos) return;

  const latestVersion = versionToNumber(await fetchLatestVersion());
  const currentVersion = versionToNumber(String(DeviceInfo.getVersion()));

  try {
    if (latestVersion !== currentVersion) {
      Alert.alert(
        '업데이트 안내',
        `앱이 업데이트되었습니다.\n업데이트 후 사용해주세요. 새로운 버전: ${latestVersion}`,
        [{ text: '업데이트 하러 가기', onPress: openStore }],
      );
    }
  } catch (e) {
    console.error('버전 체크 중 오류:', e);
  }
};
