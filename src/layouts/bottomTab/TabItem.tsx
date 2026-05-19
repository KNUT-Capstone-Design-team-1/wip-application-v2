import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { TabItemProps } from './types';
import { GRADIENT_COLORS, ACTIVE_COLOR } from './constants';

export const TabItem = React.memo(
  ({ icon, label, isActive, onPress }: TabItemProps) => {
    // 활성화 상태인 경우에만 파란색 그라데이션 적용, 비활성화는 회색
    const gradientColors = isActive
      ? GRADIENT_COLORS
      : (['#F0F0F0', '#E0E0E0'] as const);

    return (
      <TouchableOpacity
        style={styles.tabItem}
        onPress={onPress}
        accessible={true}
        accessibilityLabel={`${label} 탭`}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradientContainer}
        >
          {icon}
        </LinearGradient>
        <Text
          style={[
            styles.label,
            isActive && { color: ACTIVE_COLOR, fontWeight: '700' },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  },
);

TabItem.displayName = 'TabItem';
