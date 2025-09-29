import { Options } from 'react-native-image-crop-picker';
import { DeviceFilter } from 'react-native-vision-camera';

export const imgPickerOption: Options = {
  mediaType: 'photo',
  cropping: true,
  height: 640,
  width: 640,
  cropperToolbarTitle: '',
  // For Android
  cropperActiveWidgetColor: '#7472EB',
  cropperStatusBarLight: false,
  cropperToolbarColor: '#000000',
  cropperToolbarWidgetColor: '#7472EB',
  // For iOS
  cropperChooseText: '선택',
  cropperCancelText: '취소',
};

export const cameraDeviceOption: DeviceFilter = {
  physicalDevices: [
    'ultra-wide-angle-camera',
    'wide-angle-camera',
    'telephoto-camera',
  ],
};
