import { useState } from 'react';
import { SharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { TextInput } from 'react-native';

// Text와 TextInput의 속성 타입과 변경 매커니즘 참고

/**
 * Zoom Level 값을 표시하는 컴포넌트
 *
 * @param zoom - Zoom Level 값
 * @param style - 스타일
 * @returns
 */

export const ZoomLevelChip = ({
  zoom,
  style,
}: {
  zoom: SharedValue<number>;
  style: any;
}) => {
  const [displayValue, setDisplayValue] = useState('1.0');

  useAnimatedReaction(
    () => zoom.value,
    (currentValue, previousValue) => {
      const currentFormatted = currentValue.toFixed(1);
      const prevFormatted = previousValue?.toFixed(1);

      if (currentFormatted !== prevFormatted) {
        scheduleOnRN(setDisplayValue, currentFormatted);
      }
    },
    [zoom],
  );

  return (
    <TextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={displayValue}
      style={style}
    />
  );
};
