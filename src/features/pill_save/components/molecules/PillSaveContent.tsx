import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { IPillSaveContentProps } from '@features/pill_save/types/pill_save_type';
import { styles } from '@features/pill_save/styles/molecules/PillSaveContent';
import { PillImage } from '@features/pill_save/components/atoms/PillImage';
import { PillInfo } from '@features/pill_save/components/molecules/PillInfo';
import { SelectionRadioButton } from '@features/pill_save/components/atoms/SelectionRadioButton';
import { Bell } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';

// 저장된 알약 개별 아이템 카드 컴포넌트
const PillSaveContent = ({
  saveData,
  onPressDetail,
  onLongPress,
  isEditing,
  isSelected,
  hasReminder,
  onPressReminder,
}: IPillSaveContentProps) => {
  return (
    <TouchableOpacity
      style={styles.pillSaveContentWrapper}
      onPress={onPressDetail}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      <PillImage uri={saveData.ITEM_IMAGE} />

      {isEditing ? (
        <SelectionRadioButton isSelected={isSelected} style={styles.checkbox} />
      ) : hasReminder ? (
        <TouchableOpacity
          style={styles.reminderBadge}
          onPress={onPressReminder}
          activeOpacity={0.7}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Bell size={fontPx(14)} color={COLOR.secondary} />
        </TouchableOpacity>
      ) : null}

      <PillInfo pill={saveData} />
    </TouchableOpacity>
  );
};

export default memo(PillSaveContent);
