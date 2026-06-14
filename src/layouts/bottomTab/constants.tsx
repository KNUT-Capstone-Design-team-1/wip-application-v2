import React from 'react';
import HomeSvg from '@assets/images/home.svg';
import PillImageSearchSvg from '@assets/images/pill-image-search.svg';
import PillIdentificationSearchSvg from '@assets/images/pillIdentification-search.svg';
import NearbyPharmacySvg from '@assets/images/pharmacy.svg';
import StorageSvg from '@assets/images/storage.svg';
import { TabConfig } from './types';
import { fontPx } from '@utils/responsive';

export const ICON_SIZE = fontPx(22);
export const CENTER_ICON_SIZE = fontPx(22);
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
        fill={isActive ? '#000' : '#fff'}
      />
    ),
    path: '/',
    isCenter: false,
  },
  {
    key: 'pill-identification-search',
    label: '식별검색',
    icon: (isActive: boolean) => (
      <PillIdentificationSearchSvg
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={isActive ? '#000' : '#fff'}
      />
    ),
    path: '/pill-identification-search',
    isCenter: false,
  },
  {
    key: 'pill-search',
    label: '이미지검색',
    icon: (isActive: boolean) => (
      <PillImageSearchSvg
        width={CENTER_ICON_SIZE}
        height={CENTER_ICON_SIZE}
        fill={isActive ? '#000' : '#fff'}
      />
    ),
    path: '/pill-image-search',
    isCenter: false,
  },
  {
    key: 'nearby-pharmacy',
    label: '주변약국',
    icon: (isActive: boolean) => (
      <NearbyPharmacySvg
        width={CENTER_ICON_SIZE}
        height={CENTER_ICON_SIZE}
        fill={isActive ? '#000' : '#fff'}
      />
    ),
    path: '/nearby-pharmacy',
    isCenter: false,
  },
  {
    key: 'pill-save',
    label: '보관함',
    icon: (isActive: boolean) => (
      <StorageSvg
        width={CENTER_ICON_SIZE}
        height={CENTER_ICON_SIZE}
        fill={isActive ? '#000' : '#fff'}
      />
    ),
    path: '/pill-save',
    isCenter: false,
  },
];
