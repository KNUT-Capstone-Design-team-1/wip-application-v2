import React, { memo } from 'react';
import { View } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import Button from '@features/pill_identification_search/components/atoms/Button';
import { styles } from '@features/pill_identification_search/styles/organisms/PillIdentificationSearchModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { px } from '@utils/responsive';

interface IIdentificationSearchActionsProps {
  onReset: () => void;
  onSearch: () => Promise<void>;
}

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
