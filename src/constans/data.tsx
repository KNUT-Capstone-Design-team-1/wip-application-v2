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

const styles = StyleSheet.create({
  rectangle: {
    height: 24,
    width: 24,
    borderWidth: 1.5,
    borderRadius: 4,
    borderColor: '#cacaca'
  }
})

export const idSelectData: {
  title: string,
  data: {
    name: string,
    icon?: JSX.Element,
  }[]
}[] = [
    {
      title: '알약의 정보를 입력해주세요',
      data: []
    },
    {
      title: '알약의 모양을 선택해주세요',
      data: [
        {
          name: "전체",
          icon: <TotalSvg />,
        },
        {
          name: "원형",
          icon: <CircleSvg />,
        },
        {
          name: "타원형",
          icon: <EllipseSvg />,
        },
        {
          name: "장방형",
          icon: <LongSvg />,
        },
        {
          name: "반원형",
          icon: <HalfSvg />,
        },
        {
          name: "삼각형",
          icon: <TriangleSvg />,
        },
        {
          name: "사각형",
          icon: <RectangleSvg />,
        },
        {
          name: "마름모형",
          icon: <DiamondSvg />,
        },
        {
          name: "오각형",
          icon: <PentagonSvg />,
        },
        {
          name: "육각형",
          icon: <HexagonSvg />,
        },
        {
          name: "팔각형",
          icon: <OctagonSvg />,
        },
        {
          name: "기타",
        },
      ],
    },
    {
      title: '알약의 색상을 선택해주세요',
      data: [
        {
          name: "전체",
          icon: <TotalSvg />
        },
        {
          name: "하양",
          icon: <View style={{ backgroundColor: "#fff", ...styles.rectangle }} />
        },
        {
          name: "노랑",
          icon: <View style={{ backgroundColor: "#fcec60", ...styles.rectangle }} />
        },
        {
          name: "주황",
          icon: <View style={{ backgroundColor: "#f19d38", ...styles.rectangle }} />
        },
        {
          name: "분홍",
          icon: <View style={{ backgroundColor: "#ed6fd0", ...styles.rectangle }} />
        },
        {
          name: "빨강",
          icon: <View style={{ backgroundColor: "#ea3323", ...styles.rectangle }} />
        },
        {
          name: "갈색",
          icon: <View style={{ backgroundColor: "#9f4d2e", ...styles.rectangle }} />
        },
        {
          name: "연두",
          icon: <View style={{ backgroundColor: "#97c15c", ...styles.rectangle }} />
        },
        {
          name: "초록",
          icon: <View style={{ backgroundColor: "#42943e", ...styles.rectangle }} />
        },
        {
          name: "청록",
          icon: <View style={{ backgroundColor: "#377ea5", ...styles.rectangle }} />
        },
        {
          name: "파랑",
          icon: <View style={{ backgroundColor: "#4b68fc", ...styles.rectangle }} />
        },
        {
          name: "남색",
          icon: <View style={{ backgroundColor: "#1627a6", ...styles.rectangle }} />
        },
        {
          name: "자주",
          icon: <View style={{ backgroundColor: "#a92274", ...styles.rectangle }} />
        },
        {
          name: "보라",
          icon: <View style={{ backgroundColor: "#8e1baf", ...styles.rectangle }} />
        },
        {
          name: "회색",
          icon: <View style={{ backgroundColor: "#9e9e9e", ...styles.rectangle }} />
        },
        {
          name: "검정",
          icon: <View style={{ backgroundColor: "#1e1e1e", ...styles.rectangle }} />
        },
        {
          name: "투명",
          icon: <View style={{ backgroundColor: "#e7e7e7", ...styles.rectangle }} />
        }
      ],
    }
  ];
