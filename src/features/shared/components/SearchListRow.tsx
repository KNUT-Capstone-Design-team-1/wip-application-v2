import { memo, ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface ISearchListRowProps {
  onPress: () => void;
  // 좌측 슬롯 (예: 썸네일). 없으면 생략 — 이미지가 없는 리스트도 동일 셸 사용 가능
  leading?: ReactNode;
  // 우측 슬롯 (예: chevron)
  trailing?: ReactNode;
  // 콘텐츠 (각 feature가 자체 레이아웃/flex를 소유)
  children: ReactNode;
  // 래퍼 스타일 오버라이드 (패딩/간격/정렬/세퍼레이터 등 feature별 지정)
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
}

/**
 * 검색 결과 리스트의 공용 행 셸
 * [leading] [children] [trailing] 을 가로로 배치하고 전체를 누를 수 있게 한다.
 * 썸네일/콘텐츠/우측요소는 슬롯으로 주입 → 알약(이미지 있음)·영양제(이미지 없음) 모두 재사용.
 */
const SearchListRow = ({
  onPress,
  leading,
  trailing,
  children,
  style,
  activeOpacity = 0.7,
}: ISearchListRowProps) => {
  return (
    <TouchableOpacity
      style={[styles.row, style]}
      onPress={onPress}
      activeOpacity={activeOpacity}
    >
      {leading}
      {children}
      {trailing}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
  },
});

export default memo(SearchListRow);
