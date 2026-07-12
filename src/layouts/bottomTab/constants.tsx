import React from 'react';
import HomeSvg from '@assets/images/home.svg';
import NearbyPharmacySvg from '@assets/images/pharmacy.svg';
import StorageSvg from '@assets/images/storage.svg';
import { Settings } from 'lucide-react-native';
import { TabConfig } from './types';
import { fontPx, px } from '@utils/responsive';

export const ICON_SIZE = fontPx(22);
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
    size: ICON_SIZE,
  },
  {
    key: 'setting',
    label: '설정',
    icon: (isActive: boolean) => (
      <Settings
        size={ICON_SIZE + 4}
        color={isActive ? '#000' : '#fff'}
        strokeWidth={px(2)}
      />
    ),
    path: '/setting',
    isCenter: false,
    size: ICON_SIZE + 4,
  },
  {
    key: 'nearby-pharmacy',
    label: '주변약국',
    icon: (isActive: boolean) => (
      <NearbyPharmacySvg
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={isActive ? '#000' : '#fff'}
      />
    ),
    path: '/nearby-pharmacy',
    isCenter: false,
    size: ICON_SIZE,
  },
  {
    key: 'pill-save',
    label: '보관함',
    icon: (isActive: boolean) => (
      <StorageSvg
        width={ICON_SIZE}
        height={ICON_SIZE}
        fill={isActive ? '#000' : '#fff'}
      />
    ),
    path: '/pill-save',
    isCenter: false,
    size: ICON_SIZE,
  },
];
