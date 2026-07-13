import { Dimensions } from 'react-native';

const BASE_WIDTH = 350;
const MAX_WIDTH = 450;

const { width: windowWidth } = Dimensions.get('window');
const boundedWidth = Math.min(windowWidth, MAX_WIDTH);
const scaleRatio = boundedWidth / BASE_WIDTH;

/**
 * 레이아웃 수치(너비, 높이, 여백 등)를 반응형으로 변환합니다.
 * 기기 너비가 450px을 초과할 경우 450px을 기준으로 계산하여 과도한 팽창을 방지합니다.
 * @param size 원래 디자인 상의 크기 (기준: 350px 기기)
 * @returns 반응형으로 계산된 크기
 */
export const px = (size: number): number => {
  return size * scaleRatio;
};

/**
 * 폰트 및 아이콘 크기를 반응형으로 변환합니다.
 * 스케일 비율을 factor만큼만 적용하여 팽창을 완화합니다.
 * @param size 원래 디자인 상의 폰트 크기
 * @param factor 스케일 적용 비율 (기본값: 1)
 * @returns 반응형으로 계산된 폰트 크기
 */
export const fontPx = (size: number, factor: number = 1): number => {
  return size + (px(size) - size) * factor;
};
