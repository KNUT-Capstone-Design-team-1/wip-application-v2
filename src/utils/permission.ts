import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";

const platformPermissionsCamera =
  Platform.OS === "ios"
    ? PERMISSIONS.IOS.CAMERA
    : PERMISSIONS.ANDROID.CAMERA;

// const platformPermissionsMicroPhone =
//   Platform.OS === "ios"
//     ? PERMISSIONS.IOS.MICROPHONE
//     : PERMISSIONS.ANDROID.RECORD_AUDIO;

/** 권한 설정 이동 핸들러 */
const handleOpenSettings = () => {
  Linking.openSettings();
}

/** 취소 핸들러 */
const handleCancelButton = () => { }

/** 카메라 권한 요청 */
export const requestCameraPermission = async (first: boolean, callback?: any) => {
  try {
    const result = await check(platformPermissionsCamera);
    if (result === RESULTS.GRANTED) {
      // 권한이 허용되어 있을 때
      callback();
    } else if (result === RESULTS.DENIED) {
      // 권한이 설정되어 있지 않을 때
      if (first) {
        request(platformPermissionsCamera).then(() => requestCameraPermission(false, callback));
      }
    } else if (result === RESULTS.BLOCKED) {
      // 권한이 거절되어 있을 때
      first && Alert.alert(
        '카메라 권한', "'이게뭐약'에서 알약을 촬영하여 검색하기 위해 카메라 권한이 필요합니다.",
        [{ text: '설정', onPress: () => handleOpenSettings(), style: "destructive", isPreferred: true },
        { text: '취소', onPress: () => handleCancelButton() }]
      )
    } else {
      // 그 외 (UNAVAILABLE, LIMITED)
      Linking.openSettings();
    }
  } catch (err) {
    Alert.alert("카메라 권한을 확인해주세요.");
    console.warn(err);
    await PermissionsAndroid.request(PERMISSIONS.ANDROID.CAMERA);
  }
};

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