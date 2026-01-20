import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/**
 * 앨범 접근 권한 요청
 */
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert('권한 필요', '앨범 접근 권한이 필요합니다.');
    return false;
  }

  return true;
};

/**
 * 앨범에서 2장의 이미지 선택
 */
export const pickMultipleImages = async (
  onSuccess: (images: string[]) => void
): Promise<void> => {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: 2,
    quality: 0.8,
  });

  if (result.canceled) return;

  const { assets } = result;

  if (assets.length === 2) {
    // 2장 선택 성공
    const images = assets.map(asset => asset.uri);
    onSuccess(images);
  } else if (assets.length === 1) {
    // 1장만 선택한 경우 경고 후 재선택
    Alert.alert(
      '이미지 선택',
      '알약의 앞면과 뒷면, 총 2장의 이미지를 선택해주세요.',
      [
        {
          text: '다시 선택',
          onPress: () => pickMultipleImages(onSuccess),
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
    );
  }
};

/**
 * 앨범에서 단일 이미지 선택
 */
export const pickSingleImage = async (
  onSuccess: (imageUri: string) => void
): Promise<void> => {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    onSuccess(result.assets[0].uri);
  }
};
