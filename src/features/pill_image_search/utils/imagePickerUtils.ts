import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Alert, Linking } from 'react-native';
import logger from '@utils/logger';
import { PillImages } from '../store/pill_image_store';

// 권한이 'limited'일 경우 사용자에게 전체 권한을 권장하는 헬퍼 함수
const handleLimitedPrivilege = (
  accessPrivileges?: string,
): Promise<boolean> | boolean => {
  const isFullyGranted = accessPrivileges !== 'limited';
  if (isFullyGranted) {
    return true;
  }

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
            resolve(false); // 설정 이동 시에는 일단 false 반환
          },
        },
      ],
    );
  });
};

// 앨범(갤러리) 접근 권한을 요청하고 권한 허용 여부를 반환하는 함수
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status, accessPrivileges } =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  const isDenied = status === 'denied';
  if (isDenied) {
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

  const isGranted = status === 'granted';
  if (!isGranted) {
    return false;
  }

  return handleLimitedPrivilege(accessPrivileges);
};

// 1장만 선택/촬영되었을 때 나머지 1장에 대한 추가 선택 여부를 묻거나,
// 2장 상태에서 1장만 변경 시 교체 여부를 묻고 처리하는 헬퍼 함수
const handleSingleImageSelection = (
  firstImage: string,
  currentImages: PillImages | undefined,
  onSuccess: (images: string[]) => void,
  pickSecondImage: () => Promise<string | null>,
) => {
  const currentImageCount =
    (currentImages?.front ? 1 : 0) + (currentImages?.back ? 1 : 0);

  const isInitialSelection = currentImageCount === 0;

  const isReplacing = currentImageCount === 2;

  const needsSecondImagePrompt = isInitialSelection || isReplacing;
  if (!needsSecondImagePrompt) {
    onSuccess([firstImage]);
    return;
  }

  const title = isReplacing
    ? '나머지 한 장도 변경하시겠습니까?'
    : '이미지 추가 선택';

  const message = isReplacing
    ? '앞면 이미지가 변경되었습니다. 나머지 한 장(뒷면 등)도 변경하시겠습니까?'
    : '한 장의 이미지가 선택되었습니다. 나머지 한 장(뒷면 등)을 추가로 선택해주세요.';

  const confirmText = isReplacing ? '변경하기' : '추가 선택';

  const cancelText = isReplacing ? '유지하기' : '취소';

  Alert.alert(title, message, [
    {
      text: confirmText,
      onPress: async () => {
        const secondImage = await pickSecondImage();

        if (!secondImage) {
          onSuccess(
            isReplacing ? [firstImage, currentImages!.back!] : [firstImage],
          );
          return;
        }

        onSuccess([firstImage, secondImage]);
      },
    },
    {
      text: cancelText,
      style: 'cancel',
      onPress: () => {
        onSuccess(
          isReplacing ? [firstImage, currentImages!.back!] : [firstImage],
        );
      },
    },
  ]);
};

// 앨범에서 다중(최대 2장) 이미지를 선택하는 함수
export const pickMultipleImages = async (
  onSuccess: (images: string[]) => void,
  currentImages?: PillImages,
): Promise<void> => {
  const hasPermission = await requestMediaLibraryPermission();

  if (!hasPermission) {
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: 2,
    quality: 0.8,
    orderedSelection: true,
  });

  const isCanceled = result.canceled;
  if (isCanceled) {
    return;
  }

  const { assets } = result;

  const hasEnoughImages = assets.length >= 2;
  if (hasEnoughImages) {
    onSuccess(assets.slice(0, 2).map((a) => a.uri));
    return;
  }

  const isSingleImage = assets.length === 1;
  if (!isSingleImage) {
    return;
  }

  const firstImage = assets[0].uri;

  handleSingleImageSelection(firstImage, currentImages, onSuccess, async () => {
    const secondResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    const hasNoImage = secondResult.canceled || !secondResult.assets?.length;

    if (hasNoImage) {
      return null;
    }

    const selectedImageUri = secondResult.assets[0].uri;
    return selectedImageUri;
  });
};

// 앨범에서 단일(1장) 이미지를 선택하는 함수 (수정/자르기 화면 없음)
export const pickSingleImage = async (
  onSuccess: (imageUri: string) => void,
): Promise<void> => {
  const hasPermission = await requestMediaLibraryPermission();

  if (!hasPermission) {
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 0.8,
  });

  const hasNoImage = result.canceled || !result.assets?.length;
  if (hasNoImage) {
    return;
  }

  const selectedImageUri = result.assets[0].uri;
  onSuccess(selectedImageUri);
};

// 기기의 파일 탐색기에서 다중(최대 2장) 이미지를 선택하는 함수
export const pickMultipleImagesFromFiles = async (
  onSuccess: (images: string[]) => void,
  currentImages?: PillImages,
): Promise<void> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      multiple: true,
      copyToCacheDirectory: true,
    });

    const isCanceled = result.canceled;
    if (isCanceled) {
      return;
    }

    const { assets } = result;

    const hasEnoughImages = assets.length >= 2;
    if (hasEnoughImages) {
      onSuccess(assets.slice(0, 2).map((a) => a.uri));
      return;
    }

    const isSingleImage = assets.length === 1;
    if (!isSingleImage) {
      return;
    }

    const firstImage = assets[0].uri;

    handleSingleImageSelection(
      firstImage,
      currentImages,
      onSuccess,
      async () => {
        const secondResult = await DocumentPicker.getDocumentAsync({
          type: 'image/*',
          multiple: false,
          copyToCacheDirectory: true,
        });

        const hasNoImage =
          secondResult.canceled || !secondResult.assets?.length;
        if (hasNoImage) {
          return null;
        }

        const selectedImageUri = secondResult.assets[0].uri;
        return selectedImageUri;
      },
    );
  } catch (e) {
    logger.error(`Failed to pick multiple images from files. ${e.stack || e}`);
    Alert.alert('오류', '파일을 불러오는 중 오류가 발생했습니다.');
  }
};
