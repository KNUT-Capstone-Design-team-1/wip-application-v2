import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import logger from '@utils/logger';
import { PillImages } from '../store/pill_image_store';

/**
 * 단일 이미지 선택/촬영 시 추가 선택 여부를 묻거나, 다중 이미지 상태에서 일부 변경 시 교체 여부 처리
 * @param firstImage 선택된 첫 번째 이미지 URI
 * @param currentImages 현재 스토어에 저장된 이미지 상태
 * @param onSuccess 성공 시 호출될 콜백 (최종 이미지 배열 전달)
 * @param pickSecondImage 다음 이미지를 가져오는 비동기 함수
 */
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

  const title = isReplacing ? '추가 변경 안내' : '추가 선택 안내';

  const message = isReplacing
    ? '앞면 이미지가 변경되었습니다.\n나머지 한 장도 변경하시겠습니까?'
    : '한 장의 이미지가 선택되었습니다.\n나머지 한 장도 추가로 선택해 주세요.';

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

/**
 * 앨범에서 추가 이미지 선택
 * @returns 선택된 이미지 URI 또는 실패 시 null
 */
const pickSecondImageFromLibrary = async (): Promise<string | null> => {
  try {
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
  } catch (e) {
    logger.error(`Failed to pick second image from library. ${e}`);
    Alert.alert('오류', '두 번째 이미지를 불러오는데 실패했습니다.');
    return null;
  }
};

/**
 * 파일 탐색기에서 추가 이미지 선택
 * @returns 선택된 이미지 URI 또는 실패 시 null
 */
const pickSecondImageFromFiles = async (): Promise<string | null> => {
  try {
    const secondResult = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      multiple: false,
      copyToCacheDirectory: true,
    });

    const hasNoImage = secondResult.canceled || !secondResult.assets?.length;
    if (hasNoImage) {
      return null;
    }

    const selectedImageUri = secondResult.assets[0].uri;
    return selectedImageUri;
  } catch (e) {
    logger.error(`Failed to pick second image from files. ${e}`);
    Alert.alert('오류', '두 번째 파일을 불러오는데 실패했습니다.');
    return null;
  }
};

/**
 * 앨범에서 다중 이미지 선택
 * @param onSuccess 성공 시 호출될 콜백 (최종 이미지 배열 전달)
 * @param currentImages 현재 스토어에 저장된 이미지 상태 (옵션)
 */
export const pickMultipleImages = async (
  onSuccess: (images: string[]) => void,
  currentImages?: PillImages,
): Promise<void> => {
  try {
    // 이미 1장이 등록되어 있다면 추가로 1장만 선택하도록 제한
    const currentImageCount =
      (currentImages?.front ? 1 : 0) + (currentImages?.back ? 1 : 0);

    const limit = currentImageCount === 1 ? 1 : 2;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: limit > 1,
      selectionLimit: limit,
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

    handleSingleImageSelection(
      firstImage,
      currentImages,
      onSuccess,
      pickSecondImageFromLibrary,
    );
  } catch (e) {
    logger.error(`Failed to pick multiple images from library. ${e}`);
    Alert.alert('오류', '앨범을 여는 데 실패했습니다.');
  }
};

/**
 * 앨범에서 단일 이미지 선택 (수정/자르기 화면 없음)
 * @param onSuccess 성공 시 호출될 콜백 (선택된 이미지 URI 전달)
 */
export const pickSingleImage = async (
  onSuccess: (imageUri: string) => void,
): Promise<void> => {
  try {
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
  } catch (e) {
    logger.error(`Failed to pick single image from library. ${e}`);
    Alert.alert('오류', '앨범을 여는 데 실패했습니다.');
  }
};

/**
 * 기기의 파일 탐색기에서 다중 이미지 선택
 * @param onSuccess 성공 시 호출될 콜백 (최종 이미지 배열 전달)
 * @param currentImages 현재 스토어에 저장된 이미지 상태 (옵션)
 */
export const pickMultipleImagesFromFiles = async (
  onSuccess: (images: string[]) => void,
  currentImages?: PillImages,
): Promise<void> => {
  try {
    // 이미 1장이 등록되어 있다면 추가로 1장만 선택하도록 다중 선택 비활성화
    const currentImageCount =
      (currentImages?.front ? 1 : 0) + (currentImages?.back ? 1 : 0);

    const limit = currentImageCount === 1 ? false : true;

    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      multiple: limit,
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
      pickSecondImageFromFiles,
    );
  } catch (e) {
    logger.error(`Failed to pick multiple images from files. ${e.stack || e}`);
    Alert.alert('오류', '파일 탐색기를 실행하는데 실패했습니다.');
  }
};
