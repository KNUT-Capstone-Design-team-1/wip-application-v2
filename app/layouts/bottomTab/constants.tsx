import React from 'react';
import HomeSvg from '@assets/images/home.svg';
import PillIdentificationSearchSvg from '@assets/images/pillIdentification-search.svg';
import PillImageSearchSvg from '@assets/images/pill-image-search.svg';
import PharmacySvg from '@/assets/images/pharmacy.svg';
import StorageSvg from '@/assets/images/storage.svg';
import { COLOR } from '@/app/constants/color';
import { TabConfig } from './types';

export const ICON_SIZE = 24;
export const CENTER_ICON_SIZE = 32;
export const GRADIENT_COLORS = ['#137DFF', '#32D2FF'] as const;
export const ACTIVE_COLOR = '#32D2FF';

export const TAB_CONFIGS: TabConfig[] = [
  {
    key: 'home',
    label: '홈',
    icon: (isActive: boolean) => (
      <HomeSvg
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={isActive ? 'url(#iconGradient)' : COLOR.white}
      />
    ),
    path: '/',
    isCenter: false,
  },
  {
    key: 'pillIdentificationSearch',
    label: '식별검색',
    icon: (isActive: boolean) => (
      <PillIdentificationSearchSvg
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={isActive ? 'url(#iconGradient)' : COLOR.white}
      />
    ),
    path: '/pillIdentificationSearch',
    isCenter: false,
  },
  {
    key: 'pillImageSearch',
    label: '이미지검색',
    icon: (isActive: boolean) => (
      <PillImageSearchSvg width={CENTER_ICON_SIZE} height={CENTER_ICON_SIZE} fill={COLOR.white} />
    ),
    path: '/pillImageSearch',
    isCenter: true,
  },
  {
    key: 'pharmacy',
    label: '약국',
    icon: (isActive: boolean) => (
      <PharmacySvg
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={isActive ? 'url(#iconGradient)' : COLOR.white}
      />
    ),
    path: '/pharmacy',
    isCenter: false,
  },
  {
    key: 'storage',
    label: '보관함',
    icon: (isActive: boolean) => (
      <StorageSvg
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={isActive ? 'url(#iconGradient)' : COLOR.white}
      />
    ),
    path: '/storage',
    isCenter: false,
  },
];
