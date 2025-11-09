import { Alert, Linking } from 'react-native';
import {
  getCameraPermissionsAsync,
  requestCameraPermissionsAsync,
} from 'expo-image-picker';
import { PermissionStatus } from 'expo-modules-core';

/** 권한 설정 이동 핸들러 */
const handleOpenSettings = () => {
  Linking.openSettings();
};

/** 취소 핸들러 */
const handleCancelButton = () => {};

/** 카메라 권한 요청 */
export const requestCameraPermission = async (
  first: boolean,
  callback: () => void,
) => {
  try {
    const result = await getCameraPermissionsAsync();
    if (result.status === PermissionStatus.GRANTED) {
      callback();
    } else if (
      result.status === PermissionStatus.DENIED ||
      result.status === PermissionStatus.UNDETERMINED
    ) {
      if (first) {
        requestCameraPermissionsAsync().then(() =>
          requestCameraPermission(false, callback),
        );
      } else {
        Alert.alert(
          '카메라 권한',
          "'이게뭐약'에서 알약을 촬영하여 검색하기 위해 카메라 권한이 필요합니다.",
          [
            {
              text: '설정',
              onPress: () => handleOpenSettings(),
              style: 'destructive',
              isPreferred: true,
            },
            { text: '취소', onPress: () => handleCancelButton() },
          ],
        );
      }
    }
  } catch (err) {
    Alert.alert('카메라 권한을 확인해주세요.');
    console.warn(err);
  }
};
