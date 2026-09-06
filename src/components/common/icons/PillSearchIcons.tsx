import React from 'react';
import { SvgProps } from 'react-native-svg';
import RawPillImageFrontIcon from '@assets/icons/pill-image-search-front-icon.svg';
import RawPillImageBackIcon from '@assets/icons/pill-image-search-back-icon.svg';
import { fontPx } from '@utils/responsive';

export interface IIconProps extends Omit<SvgProps, 'color'> {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const PillImageFrontIcon: React.FC<IIconProps> = ({
  size = fontPx(20),
  color,
  strokeWidth,
  width,
  height,
  ...props
}) => {
  return (
    <RawPillImageFrontIcon
      width={width ?? size}
      height={height ?? size}
      color={color}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
};

export const PillImageBackIcon: React.FC<IIconProps> = ({
  size = fontPx(20),
  color,
  strokeWidth,
  width,
  height,
  ...props
}) => {
  return (
    <RawPillImageBackIcon
      width={width ?? size}
      height={height ?? size}
      color={color}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
};
