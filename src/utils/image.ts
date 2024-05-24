import ImageEditor from '@react-native-community/image-editor';
import { Image } from 'react-native';
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

/** 이미지파일을 base64형태로 변경 */
export const convertImgUriToBase64 = async (imageUri: any) => {
  try {
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
    if (!result.includes('data:image/')) {
      result = 'file://' + result;
    }
  }

  return result;
}

/** 이미지파일 가운데 per 만큼 크롭 */
export const getCropImage = async (img: any, per: number) => {
  const uri = getImgPath(img);
  try {
    // 이미지 크기를 얻기 위해 Image.getSize를 사용
    const { width, height }: any = await new Promise((resolve, reject) => {
      Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
    });

    // 크롭할 너비와 오프셋 계산
    const cropWidth = width * per;
    const cropHeight = height * per;
    const offsetX = (width - cropWidth) / 2;
    const offsetY = (height - cropHeight) / 2;

    const cropData: any = {
      offset: { x: offsetX, y: offsetY },
      size: { width: cropWidth, height: cropHeight },
      displaySize: { width: 640, height: 640 },
      resizeMode: 'cover',
    };

    // 이미지를 크롭
    const cropedImg = await ImageEditor.cropImage(uri, cropData);
    const result = !!img.uri ? { ...img, uri: cropedImg.uri } : { ...img, path: cropedImg.path }
    return result;
  } catch (error) {
    console.error('Error cropping image:', error);
  }
};

export const getResizeImgUri = async (uri: string) => {
  const { width, height }: any = await new Promise((resolve, reject) => {
    Image.getSize('file://' + uri, (width, height) => resolve({ width, height }), reject);
  });
  const cropData: any = {
    offset: { x: 0, y: 0 },
    size: { width: width, height: height },
    displaySize: { width: 1280, height: 640 },
    resizeMode: 'cover',
  };

  const cropedImg = await ImageEditor.cropImage('file://' + uri, cropData);

  return cropedImg.uri;
}