import RNFS from 'react-native-fs';

/** 이미지파일을 base64형태로 변경 */
export const convertImgToBase64 = async (imagePath: any) => {
  try {
    const imageUri = getImgPath(imagePath);
    const imageData = await RNFS.readFile(imageUri, 'base64');

    return imageData;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

/** 이미지파일의 전체 경로 추출 */
export const getImgPath = (img: any) => {
  let result: string = '';
  if (img.uri) result = img.uri
  if (img.path) result = img.path

  if (!result.includes('file://')) {
    result = 'file://' + result;
  }

  console.log('#############', result);

  return result;
}