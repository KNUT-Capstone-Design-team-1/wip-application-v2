import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { styles } from '@features/guide/styles/molecules/GuideSlides';
import type { GuideStep, GuideLabels } from '@features/guide/types/guide_type';
import type { ResolvedTheme } from '@features/guide/constants/guide_defaults';

export interface GuideSlidesProps {
  steps: GuideStep[];
  index: number;
  width: number;
  theme: ResolvedTheme;
  labels: Required<GuideLabels>;
  onIndexChange: (i: number) => void;
  onSkip: () => void;
  onDone: () => void;
}

// 슬라이드형 말풍선 (가로 스와이프 + 점 인디케이터)
export const GuideSlides: React.FC<GuideSlidesProps> = ({
  steps,
  index,
  width,
  theme,
  labels,
  onIndexChange,
  onSkip,
  onDone,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const isLast = index >= steps.length - 1;

  // 외부 index(스텝) 변화에 맞춰 스크롤 위치 동기화
  useEffect(() => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  }, [index, width]);

  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (width <= 0) return;
      const page = Math.round(e.nativeEvent.contentOffset.x / width);
      if (page !== index) onIndexChange(page);
    },
    [width, index, onIndexChange],
  );

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
      >
        {steps.map((step) => (
          <View key={step.id} style={{ width }}>
            {!!step.title && (
              <Text style={[styles.title, { color: theme.tooltip.titleColor }]}>
                {step.title}
              </Text>
            )}
            <Text
              style={[
                styles.description,
                { color: theme.tooltip.descriptionColor },
              ]}
            >
              {step.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {steps.map((s, i) => (
            <View
              key={s.id}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === index ? theme.dotActiveColor : theme.dotColor,
                },
              ]}
            />
          ))}
        </View>

        {isLast ? (
          <Pressable
            style={[
              styles.doneButton,
              { backgroundColor: theme.button.primaryColor },
            ]}
            onPress={onDone}
          >
            <Text style={[styles.doneText, { color: theme.button.textColor }]}>
              {labels.done}
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={onSkip} hitSlop={8}>
            <Text style={[styles.skip, { color: theme.button.skipColor }]}>
              {labels.skip}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
