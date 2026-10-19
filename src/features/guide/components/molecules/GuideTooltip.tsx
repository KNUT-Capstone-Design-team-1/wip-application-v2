import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '@features/guide/styles/molecules/GuideTooltip';
import type { GuideStep, GuideLabels } from '@features/guide/types/guide_type';
import type { ResolvedTheme } from '@features/guide/constants/guide_defaults';

export interface GuideTooltipProps {
  step: GuideStep;
  index: number;
  total: number;
  theme: ResolvedTheme;
  labels: Required<GuideLabels>;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
}

// 버튼형 말풍선 (이전 / 다음·완료 + 건너뛰기)
export const GuideTooltip: React.FC<GuideTooltipProps> = ({
  step,
  index,
  total,
  theme,
  labels,
  onPrev,
  onNext,
  onSkip,
}) => {
  const isFirst = index === 0;
  const isLast = index >= total - 1;

  return (
    <View>
      <View style={styles.header}>
        <Text style={[styles.indicator, { color: theme.button.primaryColor }]}>
          {index + 1} / {total}
        </Text>
        <Pressable onPress={onSkip} hitSlop={8}>
          <Text style={[styles.skip, { color: theme.button.skipColor }]}>
            {labels.skip}
          </Text>
        </Pressable>
      </View>

      {!!step.title && (
        <Text style={[styles.title, { color: theme.tooltip.titleColor }]}>
          {step.title}
        </Text>
      )}
      <Text
        style={[styles.description, { color: theme.tooltip.descriptionColor }]}
      >
        {step.description}
      </Text>

      <View style={styles.actions}>
        {!isFirst && (
          <Pressable style={styles.prevButton} onPress={onPrev} hitSlop={6}>
            <Text style={[styles.prevText, { color: theme.button.skipColor }]}>
              {labels.prev}
            </Text>
          </Pressable>
        )}
        <Pressable
          style={[
            styles.nextButton,
            { backgroundColor: theme.button.primaryColor },
          ]}
          onPress={onNext}
        >
          <Text style={[styles.nextText, { color: theme.button.textColor }]}>
            {isLast ? labels.done : labels.next}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
