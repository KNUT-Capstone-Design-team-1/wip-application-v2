import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { TabItemProps } from './types';
import { GRADIENT_COLORS, ACTIVE_COLOR } from './constants';

export const TabItem = React.memo(
  ({ icon, label, isActive, onPress, isCenter }: TabItemProps) => {
    // 중앙 탭 (이미지검색) - 큰 원형 그라데이션 배경
    if (isCenter) {
      return (
        <TouchableOpacity
          style={styles.centerTabItem}
          onPress={onPress}
          accessible={true}
          accessibilityLabel={`${label} 탭`}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
        >
          <LinearGradient
            colors={GRADIENT_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.centerIconContainer}
          >
            {icon}
          </LinearGradient>
          <Text style={[styles.label, isActive && { color: ACTIVE_COLOR }]}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    }

    // 일반 탭
    return (
      <TouchableOpacity
        style={styles.tabItem}
        onPress={onPress}
        accessible={true}
        accessibilityLabel={`${label} 탭`}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
      >
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={[styles.label, isActive && { color: ACTIVE_COLOR, fontWeight: '600' }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  },
);

TabItem.displayName = 'TabItem';
