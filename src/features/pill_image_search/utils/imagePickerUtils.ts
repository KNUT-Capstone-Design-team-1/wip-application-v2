import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import logger from '@utils/logger';

/**
 * 앨범에서 이미지 선택
 * @param limit 선택 가능한 이미지 개수 (기본값: 1)
 * @returns 선택된 이미지 URI 배열 또는 취소/실패 시 null
 */
export const pickImageFromLibrary = async (
  limit: number = 1,
): Promise<string[] | null> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: limit > 1,
      quality: 1.0,
      selectionLimit: limit,
      orderedSelection: true,
    });

    const hasNoImage = result.canceled || !result.assets?.length;
    if (hasNoImage) {
      return null;
    }

    const selectedImageUri = result.assets.slice(0, limit).map((a) => a.uri);
    return selectedImageUri;
  } catch (e) {
    logger.error(`Failed to pick image from library. ${e}`);
    throw e;
  }
};

/**
 * 파일 탐색기에서 이미지 선택
 * @param limit 선택 가능한 이미지 개수 (기본값: 1)
 * @returns 선택된 이미지 URI 배열 또는 취소/실패 시 null
 */
export const pickImageFromFiles = async (
  limit: number = 1,
): Promise<string[] | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      multiple: limit > 1,
      copyToCacheDirectory: true,
    });

    const hasNoImage = result.canceled || !result.assets?.length;
    if (hasNoImage) {
      return null;
    }

    const selectedImageUri = result.assets.slice(0, limit).map((a) => a.uri);
    return selectedImageUri;
  } catch (e) {
    logger.error(`Failed to pick image from files. ${e}`);
    throw e;
  }
};
