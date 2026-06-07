import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { px } from '@utils/responsive';
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
        {isActive ? (
          <MaskedView
            style={{ width: px(22), height: px(22) }}
            maskElement={
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {icon}
              </View>
            }
          >
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1 }}
            />
          </MaskedView>
        ) : (
          <>{icon}</>
        )}
        <Text style={[styles.label, isActive && { color: ACTIVE_COLOR }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  },
);

TabItem.displayName = 'TabItem';
