import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { RotateCw } from 'lucide-react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IResearchHereButtonProps {
  loading: boolean;
  onPress: () => void;
}

/**
 * 지도 중심이 마지막 검색 지점에서 크게 벗어났을 때 표시되는
 * "현재 지도에서 검색" 버튼.
 */
const ResearchHereButton = ({ loading, onPress }: IResearchHereButtonProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        {
          position: 'absolute',
          top: insets.top + px(16),
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          gap: px(6),
          backgroundColor: COLOR['white'],
          paddingVertical: px(8),
          paddingHorizontal: px(14),
          borderRadius: px(20),
          elevation: 4,
          shadowColor: COLOR['shadow'],
          shadowOffset: { width: 0, height: px(2) },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          opacity: pressed || loading ? 0.6 : 1,
          zIndex: 990,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLOR['primary']} />
      ) : (
        <RotateCw size={px(16)} color={COLOR['primary']} strokeWidth={2.5} />
      )}
      <BaseText weight="medium" size={13} style={{ color: COLOR['primary'] }}>
        현재 지도에서 검색
      </BaseText>
    </Pressable>
  );
};

export default ResearchHereButton;
