import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { IPillSaveContentProps } from '@features/pill_save/types/pill_save_type';
import { styles } from '@features/pill_save/styles/molecules/PillSaveContent';

import { PillImage } from '@features/pill_save/components/atoms/PillImage';
import { DeleteButton } from '@features/pill_save/components/atoms/DeleteButton';
import { PillInfo } from '@features/pill_save/components/molecules/PillInfo';

// 저장된 알약 개별 아이템 카드 컴포넌트
const PillSaveContent = ({
  saveData,
  onPressDetail,
  onPressDelete,
}: IPillSaveContentProps) => {
  return (
    <TouchableOpacity
      style={styles.pillSaveContentWrapper}
      onPress={onPressDetail}
      activeOpacity={0.9}
    >
      <PillImage uri={saveData.ITEM_IMAGE} />

      <DeleteButton onPress={onPressDelete} />

      <PillInfo pill={saveData} />
    </TouchableOpacity>
  );
};

export default memo(PillSaveContent);
