import { DeviceFilter } from 'react-native-vision-camera';
import { CameraType, ImagePickerOptions } from 'expo-image-picker';

export const imgPickerOption: ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1.0,
  shape: 'rectangle',
  cameraType: CameraType.back,
};

/**
 * 촬영시 사용할 카메라 렌즈 옵션
 * 기본 광각 렌즈 사용
 */
export const cameraDeviceOption: DeviceFilter = {
  physicalDevices: ['wide-angle-camera'],
};
