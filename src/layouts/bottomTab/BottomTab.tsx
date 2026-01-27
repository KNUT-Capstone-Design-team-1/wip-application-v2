import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import { TabItem } from './TabItem';
import { styles } from './styles';
import { TAB_CONFIGS, GRADIENT_COLORS } from './constants';
import { useBottomTab } from './hooks/useBottomTab';
import PillIdentificationSearchModal from '../../features/pill_identification_search/components/organisms/PillIdentificationSearchModal';

/**
 * BottomTab 컴포넌트
 *
 * 앱 하단에 표시되는 네비게이션 탭바
 * - 5개의 탭: 홈, 식별검색, 이미지검색(중앙), 약국, 보관함
 * - 중앙 탭(이미지검색)은 큰 원형 그라데이션 디자인
 * - 활성 탭은 아이콘/텍스트 색상 변경
 */
const BottomTab = () => {
  const { insets, handleTabPress, isTabActive } = useBottomTab();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 탭 클릭 핸들러 (식별 검색은 Modal로 처리)
  const handleCustomTabPress = (path: string) => {
    if (
      path === '/pillIdentificationSearch' ||
      path === '/pill-identification-search'
    ) {
      setIsModalVisible(true);
    } else {
      handleTabPress(path);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* SVG 그라데이션 정의 - 아이콘에서 참조 */}
      <Svg height={0} width={0}>
        <Defs>
          <SvgLinearGradient
            id="iconGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={GRADIENT_COLORS[0]} />
            <Stop offset="100%" stopColor={GRADIENT_COLORS[1]} />
          </SvgLinearGradient>
        </Defs>
      </Svg>

      {/* 탭 아이템 렌더링 */}
      {TAB_CONFIGS.map((tab) => (
        <TabItem
          key={tab.key}
          icon={tab.icon(isTabActive(tab.path))}
          label={tab.label}
          isActive={isTabActive(tab.path)}
          isCenter={tab.isCenter}
          onPress={() => handleCustomTabPress(tab.path)}
        />
      ))}

      {/* 식별 검색 Modal */}
      <PillIdentificationSearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

export default BottomTab;
