import { ImageLibraryOptions } from "react-native-image-picker";
import { DeviceFilter } from "react-native-vision-camera";

export const imgPickerOption: ImageLibraryOptions = {
  mediaType: "photo",
  selectionLimit: 1,
  maxHeight: 640,
  maxWidth: 640,
}

export const cameraDeviceOption: DeviceFilter = {
  physicalDevices: [
    'ultra-wide-angle-camera',
    'wide-angle-camera',
    'telephoto-camera'
  ],
}