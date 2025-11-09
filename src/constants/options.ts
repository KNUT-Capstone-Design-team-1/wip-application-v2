import { CameraType, ImagePickerOptions } from 'expo-image-picker';

export const imgPickerOption: ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1.0,
  shape: 'rectangle',
  cameraType: CameraType.back,
};
