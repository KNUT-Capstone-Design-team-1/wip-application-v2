import React, { memo } from 'react';
import { View } from 'react-native';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import Button from '@features/pill_identification_search/components/atoms/Button';
import { styles } from '@features/pill_identification_search/styles/organisms/PillIdentificationSearchModal';

interface IIdentificationSearchActionsProps {
  onReset: () => void;
  onSearch: () => Promise<void>;
}

const IdentificationSearchActions = memo(
  ({ onReset, onSearch }: IIdentificationSearchActionsProps) => {
    return (
      <View style={styles.bottomButtons}>
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
