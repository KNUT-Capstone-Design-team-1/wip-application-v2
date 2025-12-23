import { Alert, Linking } from 'react-native';
import { Camera } from 'react-native-vision-camera';
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
    const cameraPermissionStatus = Camera.getCameraPermissionStatus();
    if (cameraPermissionStatus === PermissionStatus.GRANTED) {
      callback();
    } else if (
      cameraPermissionStatus === PermissionStatus.DENIED ||
      cameraPermissionStatus === 'not-determined'
    ) {
      if (first) {
        Camera.requestCameraPermission().then(() =>
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
    } else if (cameraPermissionStatus === 'restricted') {
      // ios only 시스템 자체적 권한 거부
      Alert.alert(
        '카메라 권한',
        '현재 해당 환경에서 권한 설정이 불가능합니다',
        [
          {
            text: '확인',
            style: 'destructive',
            isPreferred: true,
          },
        ],
      );
    }
  } catch (err) {
    Alert.alert('카메라 권한을 확인해주세요.');
    console.warn(err);
  }
};
// export const requestCameraPermission = async (
//   first: boolean,
//   callback: () => void,
// ) => {
//   try {
//     const result = await getCameraPermissionsAsync();
//     if (result.status === PermissionStatus.GRANTED) {
//       callback();
//     } else if (
//       result.status === PermissionStatus.DENIED ||
//       result.status === PermissionStatus.UNDETERMINED
//     ) {
//       if (first) {
//         requestCameraPermissionsAsync().then(() =>
//           requestCameraPermission(false, callback),
//         );
//       } else {
//         Alert.alert(
//           '카메라 권한',
//           "'이게뭐약'에서 알약을 촬영하여 검색하기 위해 카메라 권한이 필요합니다.",
//           [
//             {
//               text: '설정',
//               onPress: () => handleOpenSettings(),
//               style: 'destructive',
//               isPreferred: true,
//             },
//             { text: '취소', onPress: () => handleCancelButton() },
//           ],
//         );
//       }
//     }
//   } catch (err) {
//     Alert.alert('카메라 권한을 확인해주세요.');
//     console.warn(err);
//   }
// };
