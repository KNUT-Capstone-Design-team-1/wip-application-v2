import { DeviceFilter } from 'react-native-vision-camera';
import { ImagePickerOptions } from 'expo-image-picker';

export const imgPickerOption: ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1.0,
  shape: 'rectangle',
};

export const cameraDeviceOption: DeviceFilter = {
  physicalDevices: [
    'ultra-wide-angle-camera',
    'wide-angle-camera',
    'telephoto-camera',
  ],
};
