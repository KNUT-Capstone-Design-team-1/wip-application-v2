import React from 'react';
import HomeSvg from '@assets/images/home.svg';
import SettingSvg from '@assets/images/setting.svg';
import PillImageSearchSvg from '@assets/images/pill-image-search.svg';
import PillIdentificationSearchSvg from '@assets/images/pillIdentification-search.svg';
import { TabConfig } from './types';

export const ICON_SIZE = 22;
export const CENTER_ICON_SIZE = 22;
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
    key: 'setting',
    label: '설정',
    icon: (isActive: boolean) => (
      <SettingSvg
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={isActive ? '#000' : '#fff'}
      />
    ),
    path: '/setting',
    isCenter: false,
  },
];
