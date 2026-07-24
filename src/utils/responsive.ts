import { Dimensions } from 'react-native';

const BASE_WIDTH = 350;
const MAX_WIDTH = 450;

const { width: windowWidth } = Dimensions.get('window');
const boundedWidth = Math.min(windowWidth, MAX_WIDTH);
const scaleRatio = boundedWidth / BASE_WIDTH;

/**
 * 레이아웃 수치(너비, 높이, 여백 등) 반응형 변환
 * 기기 너비 초과 시 최대 너비를 기준으로 계산해 과도한 팽창 방지
 * @param size 원래 디자인 상의 크기 (기준 너비 기기)
 * @returns 반응형으로 계산된 크기
 */
export const px = (size: number, min?: number, max?: number): number => {
  const scaledValue = size * scaleRatio;
  if (min && scaledValue < min) return min;
  if (max && scaledValue > max) return max;
  return scaledValue;
};

/**
 * 폰트 및 아이콘 크기 반응형 변환
 * 스케일 비율을 factor만큼만 적용해 팽창 완화
 * @param size 원래 디자인 상의 폰트 크기
 * @param factor 스케일 적용 비율 (기본값 설정)
 * @returns 반응형으로 계산된 폰트 크기
 */
export const fontPx = (
  size: number,
  factor: number = 1,
  min?: number,
  max?: number,
): number => {
  const scaledValue = size + (px(size) - size) * factor;
  if (min && scaledValue < min) return min;
  if (max && scaledValue > max) return max;
  return scaledValue;
};
