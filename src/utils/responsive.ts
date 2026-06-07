import { scale, moderateScale } from 'react-native-size-matters';

/**
 * 레이아웃 수치(너비, 높이, 여백 등)를 반응형으로 변환합니다.
 * 내부적으로 react-native-size-matters의 scale을 사용합니다.
 * @param size 원래 디자인 상의 크기 (기준: 360x780 기기)
 * @returns 반응형으로 계산된 크기
 */
export const px = (size: number): number => {
  return scale(size);
};

/**
 * 폰트 및 아이콘 크기를 반응형으로 변환합니다.
 * 내부적으로 react-native-size-matters의 moderateScale을 사용합니다.
 * 태블릿 등에서 UI가 과도하게 커지는 것을 방지합니다.
 * @param size 원래 디자인 상의 폰트 크기
 * @param factor 스케일 적용 비율 (기본값: 0.5)
 * @returns 반응형으로 계산된 폰트 크기
 */
export const fontPx = (size: number, factor: number = 0.5): number => {
  return moderateScale(size, factor);
};
