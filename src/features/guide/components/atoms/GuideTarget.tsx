import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useGuideTarget } from '@features/guide/hooks/use_guide_target';
import type { GuideChildren } from '@features/guide/types/guide_type';

export interface GuideTargetProps {
  id: string;
  children: GuideChildren;
  style?: StyleProp<ViewStyle>;
}

/**
 * 자식을 측정 가능한 View 로 감싸 투어 타겟으로 등록하는 래퍼.
 * collapsable={false} 로 Android 에서도 measureInWindow 가 동작하도록 보장한다.
 */
export const GuideTarget: React.FC<GuideTargetProps> = ({
  id,
  children,
  style,
}) => {
  const ref = useGuideTarget(id);
  return (
    <View ref={ref} collapsable={false} style={style}>
      {children}
    </View>
  );
};
