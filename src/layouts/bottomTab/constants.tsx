import React from 'react';
import HomeSvg from '@assets/images/home.svg';
import StorageSvg from '@assets/images/storage.svg';
import SettingSvg from '@assets/images/setting.svg';
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
        fill={isActive ? '#000000' : '#C1D1D5'}
      />
    ),
    path: '/',
    isCenter: false,
  },
  {
    key: 'storage',
    label: '보관함',
    icon: (isActive: boolean) => (
      <StorageSvg
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={isActive ? '#000000' : '#C1D1D5'}
      />
    ),
    path: '/pill-save',
    isCenter: false,
  },
  {
    key: 'setting',
    label: '설정',
    icon: (isActive: boolean) => (
      <SettingSvg
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={isActive ? '#000000' : '#C1D1D5'}
      />
    ),
    path: '/setting',
    isCenter: false,
  },
];
