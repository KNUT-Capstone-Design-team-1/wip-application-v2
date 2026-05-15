import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Alert, Linking } from 'react-native';

/**
 * 앨범 접근 권한 요청
 */
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status, accessPrivileges } =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status === 'denied') {
    Alert.alert(
      '권한 필요',
      '앨범 접근 권한이 거부되었습니다. 모든 사진을 선택하려면 설정에서 권한을 허용해주세요.',
      [
        { text: '취소', style: 'cancel' },
        { text: '설정으로 이동', onPress: () => Linking.openSettings() },
      ],
    );
    return false;
  }

  // iOS 14+ 또는 Android 14+에서 '일부 사진 선택(Limited)'인 경우
  if (accessPrivileges === 'limited') {
    return new Promise((resolve) => {
      Alert.alert(
        '전체 사진 접근 권한 권장',
        '현재 일부 사진에만 접근이 허용되어 있습니다. 모든 앨범의 사진을 자유롭게 선택하시려면 "모든 사진 허용"으로 변경하는 것을 권장합니다.',
        [
          {
            text: '현재 상태 유지',
            style: 'cancel',
            onPress: () => resolve(true),
          },
          {
            text: '설정으로 이동',
            onPress: () => {
              Linking.openSettings();
              resolve(false); // 설정 이동 시에는 일단 false 반환 (사용자가 돌아와서 다시 시도하게 함)
            },
          },
        ],
      );
    });
  }

  return status === 'granted';
};

/**
 * 앨범에서 2장의 이미지 선택
 */
export const pickMultipleImages = async (
  onSuccess: (images: string[]) => void,
): Promise<void> => {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: 2,
    quality: 0.8,
    orderedSelection: true,
  });

  if (result.canceled) return;

  const { assets } = result;

  if (assets.length >= 2) {
    // 2장 이상 선택 시 앞의 2장 사용
    const images = assets.slice(0, 2).map((asset) => asset.uri);
    onSuccess(images);
  } else if (assets.length === 1) {
    // 1장만 선택한 경우 추가 선택 제안
    const firstImage = assets[0].uri;
    Alert.alert(
      '이미지 추가 선택',
      '한 장의 이미지가 선택되었습니다. 나머지 한 장(뒷면 등)을 추가로 선택해주세요.',
      [
        {
          text: '추가 선택',
          onPress: async () => {
            const secondResult = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!secondResult.canceled && secondResult.assets[0]) {
              onSuccess([firstImage, secondResult.assets[0].uri]);
            }
          },
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
  onSuccess: (imageUri: string) => void,
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

/**
 * 파일(다운로드 등)에서 2장의 이미지 선택
 */
export const pickMultipleImagesFromFiles = async (
  onSuccess: (images: string[]) => void,
): Promise<void> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const { assets } = result;

    if (assets.length >= 2) {
      // 2장 이상 선택 시 앞의 2장 사용
      const images = assets.slice(0, 2).map((asset) => asset.uri);
      onSuccess(images);
    } else if (assets.length === 1) {
      // 1장만 선택한 경우 추가 선택 제안
      const firstImage = assets[0].uri;
      Alert.alert(
        '이미지 추가 선택',
        '한 장의 이미지가 선택되었습니다. 나머지 한 장(뒷면 등)을 추가로 선택해주세요.',
        [
          {
            text: '추가 선택',
            onPress: async () => {
              const secondResult = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
                multiple: false,
                copyToCacheDirectory: true,
              });
              if (!secondResult.canceled && secondResult.assets[0]) {
                onSuccess([firstImage, secondResult.assets[0].uri]);
              }
            },
          },
          {
            text: '취소',
            style: 'cancel',
          },
        ],
      );
    }
  } catch (error) {
    console.error('파일 선택 오류:', error);
    Alert.alert('오류', '파일을 불러오는 중 오류가 발생했습니다.');
  }
};
