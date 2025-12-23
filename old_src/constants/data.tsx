import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

type TItemData = {
  name: string;
  icon?: React.JSX.Element;
  color?: string;
  category: string;
  key: string;
  default?: boolean;
};

type TSectionData = {
  title: string;
  subTitle?: string[];
  data: TItemData[];
  type?: string;
  label?: string;
  placeholder?: string[];
};

export type { TItemData };

const styles = StyleSheet.create({
  icon: {
    width: 24,
    aspectRatio: 1,
    backgroundColor: 'transparent',
  },
});

const iconAssets = {
  total: (
    <Image
      source={require('@assets/images/shape/total.png')}
      style={styles.icon}
      contentFit="contain"
    />
  ),
  circle: (
    <Image
      source={require('@assets/images/shape/circle.png')}
      style={styles.icon}
      contentFit="contain"
    />
  ),
  ellipse: (
    <Image
      source={require('@assets/images/shape/ellipse.png')}
      style={[styles.icon, { width: 36 }]}
      contentFit="contain"
    />
  ),
  long: (
    <Image
      source={require('@assets/images/shape/long.png')}
      style={[styles.icon, { width: 36 }]}
      contentFit="contain"
    />
  ),
  half: (
    <Image
      source={require('@assets/images/shape/half.png')}
      style={[styles.icon, { width: 36 }]}
      contentFit="contain"
    />
  ),
  triangle: (
    <Image
      source={require('@assets/images/shape/triangle.png')}
      style={[styles.icon, { width: 28 }]}
      contentFit="contain"
    />
  ),
  rectangle: (
    <Image
      source={require('@assets/images/shape/rectangle.png')}
      style={styles.icon}
      contentFit="contain"
    />
  ),
  diamond: (
    <Image
      source={require('@assets/images/shape/diamond.png')}
      style={[styles.icon, { width: 28 }]}
      contentFit="contain"
    />
  ),
  pentagon: (
    <Image
      source={require('@assets/images/shape/pentagon.png')}
      style={[styles.icon, { width: 24 }]}
      contentFit="contain"
    />
  ),
  hexagon: (
    <Image
      source={require('@assets/images/shape/hexagon.png')}
      style={[styles.icon, { width: 28 }]}
      contentFit="contain"
    />
  ),
  octagon: (
    <Image
      source={require('@assets/images/shape/octagon.png')}
      style={[styles.icon, { width: 24 }]}
      contentFit="contain"
    />
  ),
  etc: (
    <Image
      source={require('@assets/images/shape/total.png')}
      style={styles.icon}
      contentFit="contain"
    />
  ),
  capsult: {
    capsult: (
      <Image
        source={require('@assets/images/capsult/capsult.png')}
        style={[styles.icon, { width: 50 }]}
        contentFit="contain"
      />
    ),
    softCapsult: (
      <Image
        source={require('@assets/images/capsult/softCapsult.png')}
        style={[styles.icon, { width: 50 }]}
        contentFit="contain"
      />
    ),
    hardCapsult: (
      <Image
        source={require('@assets/images/capsult/hardCapsult.png')}
        style={[styles.icon, { width: 50 }]}
        contentFit="contain"
      />
    ),
  },
  dividing: {
    cross: (
      <Image
        source={require('@assets/images/shape/cross.png')}
        style={styles.icon}
        contentFit="contain"
      />
    ),
    straight: (
      <Image
        source={require('@assets/images/shape/straight.png')}
        style={styles.icon}
        contentFit="contain"
      />
    ),
  },
};

export const idSelectData: TSectionData[] = [
  {
    title: '문자',
    data: [],
    type: 'char',
    label: '앞면 또는 뒷면 식별 문자 (선택)',
    placeholder: ['앞면 문자', '뒷면 문자'],
  },
  {
    title: '정보',
    data: [],
    type: 'info',
    label: '제품명 또는 제조사명',
    placeholder: ['제품명', '제조사명'],
  },
  {
    title: '제형',
    data: [
      {
        name: '전체',
        icon: iconAssets.total,
        category: 'formCode',
        key: '0',
        default: true,
      },
      {
        name: '정제',
        icon: iconAssets.capsult.capsult,
        category: 'formCode',
        color: '#fafafa',
        key: '1',
      },
      {
        name: '연질캡슐',
        icon: iconAssets.capsult.softCapsult,
        category: 'formCode',
        color: '#fafafa',
        key: '2',
      },
      {
        name: '경질캡슐',
        icon: iconAssets.capsult.hardCapsult,
        category: 'formCode',
        color: '#fafafa',
        key: '3',
      },
      { name: '기타', icon: iconAssets.etc, category: 'formCode', key: '4' },
    ],
  },
  {
    title: '분할선',
    subTitle: ['앞면', '뒷면'],
    data: [
      {
        name: '전체',
        icon: iconAssets.total,
        category: 'dividing',
        key: '0',
        default: true,
      },
      { name: '없음', icon: iconAssets.circle, category: 'dividing', key: '1' },
      {
        name: '+ 형',
        icon: iconAssets.dividing.cross,
        category: 'dividing',
        key: '2',
      },
      {
        name: '- 형',
        icon: iconAssets.dividing.straight,
        category: 'dividing',
        key: '3',
      },
    ],
  },
  {
    title: '모양',
    data: [
      {
        name: '전체',
        icon: iconAssets.total,
        category: 'shape',
        key: '0',
        default: true,
      },
      { name: '원형', icon: iconAssets.circle, category: 'shape', key: '1' },
      { name: '타원형', icon: iconAssets.ellipse, category: 'shape', key: '2' },
      { name: '장방형', icon: iconAssets.long, category: 'shape', key: '3' },
      { name: '반원형', icon: iconAssets.half, category: 'shape', key: '4' },
      {
        name: '삼각형',
        icon: iconAssets.triangle,
        category: 'shape',
        key: '5',
      },
      {
        name: '사각형',
        icon: iconAssets.rectangle,
        category: 'shape',
        key: '6',
      },
      {
        name: '마름모형',
        icon: iconAssets.diamond,
        category: 'shape',
        key: '7',
      },
      {
        name: '오각형',
        icon: iconAssets.pentagon,
        category: 'shape',
        key: '8',
      },
      { name: '육각형', icon: iconAssets.hexagon, category: 'shape', key: '9' },
      {
        name: '팔각형',
        icon: iconAssets.octagon,
        category: 'shape',
        key: '10',
      },
      { name: '기타', icon: iconAssets.etc, category: 'shape', key: '11' },
    ],
  },
  {
    title: '색상',
    subTitle: ['색상1', '색상2'],
    data: [
      {
        name: '전체',
        icon: iconAssets.total,
        category: 'color',
        key: '0',
        default: true,
      },
      { name: '하양', color: '#fff', category: 'color', key: '1' },
      { name: '노랑', color: '#fcec60', category: 'color', key: '2' },
      { name: '주황', color: '#f19d38', category: 'color', key: '3' },
      { name: '분홍', color: '#ed6fd0', category: 'color', key: '4' },
      { name: '빨강', color: '#ea3323', category: 'color', key: '5' },
      { name: '갈색', color: '#9f4d2e', category: 'color', key: '6' },
      { name: '연두', color: '#97c15c', category: 'color', key: '7' },
      { name: '초록', color: '#42943e', category: 'color', key: '8' },
      { name: '청록', color: '#377ea5', category: 'color', key: '9' },
      { name: '파랑', color: '#4b68fc', category: 'color', key: '10' },
      { name: '남색', color: '#1627a6', category: 'color', key: '11' },
      { name: '자주', color: '#a92274', category: 'color', key: '12' },
      { name: '보라', color: '#8e1baf', category: 'color', key: '13' },
      { name: '회색', color: '#9e9e9e', category: 'color', key: '14' },
      { name: '검정', color: '#1e1e1e', category: 'color', key: '15' },
      { name: '투명', color: '#e7e7e7', category: 'color', key: '16' },
    ],
  },
  { title: '', data: [], type: 'mark' },
];
