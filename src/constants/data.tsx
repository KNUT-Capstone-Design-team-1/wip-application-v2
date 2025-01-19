import TotalSvg from '@assets/svgs/shape/total.svg';
import CircleSvg from '@assets/svgs/shape/circle.svg';
import EllipseSvg from '@assets/svgs/shape/ellipse.svg';
import LongSvg from '@assets/svgs/shape/long.svg';
import HalfSvg from '@assets/svgs/shape/half.svg';
import TriangleSvg from '@assets/svgs/shape/triangle.svg';
import RectangleSvg from '@assets/svgs/shape/rectangle.svg';
import DiamondSvg from '@assets/svgs/shape/diamond.svg';
import PentagonSvg from '@assets/svgs/shape/pentagon.svg';
import HexagonSvg from '@assets/svgs/shape/hexagon.svg';
import OctagonSvg from '@assets/svgs/shape/octagon.svg';

import { View, StyleSheet } from 'react-native';

type TItemData = {
  name: string,
  icon?: JSX.Element,
  category: string,
  key: string,
  default?: boolean
}

type TSectionData = {
  title: string,
  data: TItemData[],
}

const styles = StyleSheet.create({
  rectangle: {
    height: 24,
    width: 24,
    borderWidth: 1.5,
    borderRadius: 4,
    borderColor: '#cacaca'
  }
})

export type {
  TItemData
}

export const idSelectData: TSectionData[] = [
  {
    title: '알약의 정보를 입력해주세요',
    data: [],
  },
  {
    title: '알약의 모양을 선택해주세요',
    data: [
      {
        name: "전체",
        icon: <TotalSvg />,
        category: 'shape',
        key: '0',
        default: true
      },
      {
        name: "원형",
        icon: <CircleSvg />,
        category: 'shape',
        key: '1',
      },
      {
        name: "타원형",
        icon: <EllipseSvg />,
        category: 'shape',
        key: '2',
      },
      {
        name: "장방형",
        icon: <LongSvg />,
        category: 'shape',
        key: '3',
      },
      {
        name: "반원형",
        icon: <HalfSvg />,
        category: 'shape',
        key: '4',
      },
      {
        name: "삼각형",
        icon: <TriangleSvg />,
        category: 'shape',
        key: '5',
      },
      {
        name: "사각형",
        icon: <RectangleSvg />,
        category: 'shape',
        key: '6',
      },
      {
        name: "마름모형",
        icon: <DiamondSvg />,
        category: 'shape',
        key: '7',
      },
      {
        name: "오각형",
        icon: <PentagonSvg />,
        category: 'shape',
        key: '8',
      },
      {
        name: "육각형",
        icon: <HexagonSvg />,
        category: 'shape',
        key: '9',
      },
      {
        name: "팔각형",
        icon: <OctagonSvg />,
        category: 'shape',
        key: '10',
      },
      {
        name: "기타",
        category: 'shape',
        key: '11',
      },
    ],
  },
  {
    title: '알약의 색상을 선택해주세요',
    data: [
      {
        name: "전체",
        icon: <TotalSvg />,
        category: 'color',
        key: '0',
        default: true
      },
      {
        name: "하양",
        icon: <View style={{ backgroundColor: "#fff", ...styles.rectangle }} />,
        category: 'color',
        key: '1',
      },
      {
        name: "노랑",
        icon: <View style={{ backgroundColor: "#fcec60", ...styles.rectangle }} />,
        category: 'color',
        key: '2',
      },
      {
        name: "주황",
        icon: <View style={{ backgroundColor: "#f19d38", ...styles.rectangle }} />,
        category: 'color',
        key: '3',
      },
      {
        name: "분홍",
        icon: <View style={{ backgroundColor: "#ed6fd0", ...styles.rectangle }} />,
        category: 'color',
        key: '4',
      },
      {
        name: "빨강",
        icon: <View style={{ backgroundColor: "#ea3323", ...styles.rectangle }} />,
        category: 'color',
        key: '5',
      },
      {
        name: "갈색",
        icon: <View style={{ backgroundColor: "#9f4d2e", ...styles.rectangle }} />,
        category: 'color',
        key: '6',
      },
      {
        name: "연두",
        icon: <View style={{ backgroundColor: "#97c15c", ...styles.rectangle }} />,
        category: 'color',
        key: '7',
      },
      {
        name: "초록",
        icon: <View style={{ backgroundColor: "#42943e", ...styles.rectangle }} />,
        category: 'color',
        key: '8',
      },
      {
        name: "청록",
        icon: <View style={{ backgroundColor: "#377ea5", ...styles.rectangle }} />,
        category: 'color',
        key: '9',
      },
      {
        name: "파랑",
        icon: <View style={{ backgroundColor: "#4b68fc", ...styles.rectangle }} />,
        category: 'color',
        key: '10',
      },
      {
        name: "남색",
        icon: <View style={{ backgroundColor: "#1627a6", ...styles.rectangle }} />,
        category: 'color',
        key: '11',
      },
      {
        name: "자주",
        icon: <View style={{ backgroundColor: "#a92274", ...styles.rectangle }} />,
        category: 'color',
        key: '12',
      },
      {
        name: "보라",
        icon: <View style={{ backgroundColor: "#8e1baf", ...styles.rectangle }} />,
        category: 'color',
        key: '13',
      },
      {
        name: "회색",
        icon: <View style={{ backgroundColor: "#9e9e9e", ...styles.rectangle }} />,
        category: 'color',
        key: '14',
      },
      {
        name: "검정",
        icon: <View style={{ backgroundColor: "#1e1e1e", ...styles.rectangle }} />,
        category: 'color',
        key: '15',
      },
      {
        name: "투명",
        icon: <View style={{ backgroundColor: "#e7e7e7", ...styles.rectangle }} />,
        category: 'color',
        key: '16',
      }
    ],
  }
];
