import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useGuideTarget } from '@features/guide/hooks/use_guide_target';
import type { GuideChildren } from '@features/guide/types/guide_type';

export interface GuideTargetProps {
  /** `GuideStep.id` 와 **정확히 일치** 해야 매칭. 중복 등록 시 마지막이 이김 */
  id: string;
  children: GuideChildren;
  /** 래퍼 View 에 적용. 자식의 레이아웃 슬롯을 보존해야 할 때 지정(예: `width: '48%'`) */
  style?: StyleProp<ViewStyle>;
}

/**
 * 자식을 측정 가능한 View 로 감싸 투어 타겟으로 등록하는 래퍼.
 *
 * - `collapsable={false}` — Android 에서 자식만 있고 View 가 비면 네이티브 레이어가
 *   병합돼 `measureInWindow` 가 0 을 돌려주므로 반드시 유지.
 * - 자식 측정은 ref 등록 → 투어 활성 스텝 바뀔 때 `useGuideMeasure` 가 조회.
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
