import { PixelRatio, Platform } from 'react-native';

/** 기기에 따라 유동적으로 폰트 변환 */
export const font = (size: number) => {
  /*
  - 230720: `pixel(size)` 말고, size를 fontScale로 나눈다.
  - 폰트사이즈 참고 아티클: https://muhammadrafeh.medium.com/make-responsive-react-native-text-for-any-device-f8301b006694
  */
  return size / PixelRatio.getFontScale();
};

/** OS에 따라 반환값 구분
 * 첫번째 인자 : IOS,
 * 두번쪠 인자 : Android
 * 
 * os.default : 그대로 반환,
 * 
 * os.font : fontWeight 반환
*/
export const os = {
  default: (a: any, b: any) => {
    return (Platform.OS === 'ios' ? a : b) ?? ''
  },
  font: (a: number, b: number) => {
    const revertFontWeight = (weight: number) => {
      switch (weight) {
        case 300:
          return 'NotoSansKR-Light'
        case 400:
          return 'NotoSansKR-Regular'
        case 500:
          return 'NotoSansKR-Medium'
        case 600:
          return 'NotoSansKR-SemiBold'
        case 700:
          return 'NotoSansKR-Bold'
        case 800:
          return 'NotoSansKR-ExtraBold'
        case 900:
          return 'NotoSansKR-Black'
        default:
          return 'NotoSansKR-Medium'
      }
    }
    return (Platform.OS === 'ios' ? revertFontWeight(a) : revertFontWeight(b)) ?? 'NotoSansKR-Medium'
  }
};