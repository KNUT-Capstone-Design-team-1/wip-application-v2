import React, { memo } from 'react';
import { View } from 'react-native';
import { COLOR_PRIMARY } from '@constants/color';
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
          background={'#fff'}
          color={COLOR_PRIMARY[100]}
        />
        <Button width="48%" label="검색하기" pressHandler={onSearch} />
      </View>
    );
  },
);

IdentificationSearchActions.displayName = 'IdentificationSearchActions';

export default IdentificationSearchActions;
