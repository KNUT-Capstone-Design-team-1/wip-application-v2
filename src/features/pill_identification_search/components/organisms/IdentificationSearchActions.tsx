import React, { memo } from 'react';
import { View } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import Button from '@features/pill_identification_search/components/atoms/Button';
import { styles } from '../../styles/organisms/IdentificationSearchActions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { px } from '@utils/responsive';
import { IIdentificationSearchActionsProps } from '@features/pill_identification_search/types';

// 식별 검색 초기화 및 검색 실행 버튼 액션 바 컴포넌트 (Organism)
const IdentificationSearchActions = memo(
  ({ onReset, onSearch }: IIdentificationSearchActionsProps) => {
    const insets = useSafeAreaInsets();

    return (
      <View
        style={[styles.bottomButtons, { paddingBottom: insets.bottom + px(8) }]}
      >
        <Button
          width="48%"
          label="초기화"
          pressHandler={onReset}
          background={COLOR_BG['surface']}
          color={COLOR['primary']}
        />
        <Button
          width="48%"
          label="검색하기"
          color={COLOR_TEXT['white']}
          pressHandler={onSearch}
        />
      </View>
    );
  },
);

IdentificationSearchActions.displayName = 'IdentificationSearchActions';

export default IdentificationSearchActions;
