import { Alert, Linking } from 'react-native';
import { Camera } from 'react-native-vision-camera';

// const platformPermissionsCamera =
//   Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

// const platformPermissionsMicroPhone =
//   Platform.OS === "ios"
//     ? PERMISSIONS.IOS.MICROPHONE
//     : PERMISSIONS.ANDROID.RECORD_AUDIO;

/** 권한 설정 이동 핸들러 */
const handleOpenSettings = () => {
  Linking.openSettings();
};

/** 취소 핸들러 */
const handleCancelButton = () => {};

/** 카메라 권한 요청 */
export const requestCameraPermission = async (
  first: boolean,
  callback?: any,
) => {
  try {
    const cameraPermissionStatus = Camera.getCameraPermissionStatus();
    if (cameraPermissionStatus === 'granted') {
      // 권한 허용
      callback();
    } else if (
      cameraPermissionStatus === 'denied' ||
      cameraPermissionStatus === 'not-determined'
    ) {
      // 권한 거부
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
      // ios only 시스템 자체적으로 권한 거부
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
//   callback?: any,
// ) => {
//   try {
//     const result = await check(platformPermissionsCamera);
//     if (result === RESULTS.GRANTED) {
//       // 권한이 허용되어 있을 때
//       callback();
//     } else if (result === RESULTS.DENIED) {
//       // 권한이 설정되어 있지 않을 때
//       if (first) {
//         request(platformPermissionsCamera).then(() =>
//           requestCameraPermission(false, callback),
//         );
//       }
//     } else if (result === RESULTS.BLOCKED) {
//       // 권한이 거절되어 있을 때
//       first &&
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
//     } else {
//       // 그 외 (UNAVAILABLE, LIMITED)
//       Linking.openSettings();
//     }
//   } catch (err) {
//     Alert.alert('카메라 권한을 확인해주세요.');
//     console.warn(err);
//     await PermissionsAndroid.request(PERMISSIONS.ANDROID.CAMERA);
//   }
// };

/** 마이크 권한 요청 */
// export const requestMicroPhonePermission = async (first: boolean, callback?: any) => {
//   try {
//     const result = await check(platformPermissionsMicroPhone);
//     if (result === RESULTS.GRANTED) {
//       // 권한이 허용되어 있을 때
//       callback();
//     } else if (result === RESULTS.DENIED) {
//       // 권한이 설정되어 있지 않을 때
//       if (first) {
//         request(platformPermissionsMicroPhone).then(() => requestMicroPhonePermission(false));
//       }
//     } else if (result === RESULTS.BLOCKED) {
//       // 권한이 거절되어 있을 때
//       first && Alert.alert(
//         '마이크 권한', "'이게뭐약'에서 마이크 권한이 필요합니다.",
//         [{ text: '설정', onPress: () => handleOpenSettings(), style: "destructive", isPreferred: true },
//         { text: '취소', onPress: () => handleCancelButton() }]
//       )
//     } else {
//       // 그 외 (UNAVAILABLE, LIMITED)
//       Linking.openSettings();
//     }
//   } catch (err) {
//     Alert.alert("마이크 권한을 확인해주세요.");
//     console.warn(err);
//     await PermissionsAndroid.request(PERMISSIONS.ANDROID.RECORD_AUDIO);
//   }
// };
