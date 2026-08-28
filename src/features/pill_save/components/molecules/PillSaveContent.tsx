import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IPillSaveContentProps } from '@features/pill_save/types/pill_save_type';
import { styles } from '@features/pill_save/styles/molecules/PillSaveContent';
import { PillImage } from '@features/pill_save/components/atoms/PillImage';
import { PillInfo } from '@features/pill_save/components/molecules/PillInfo';
import { CheckCircle2, Circle } from 'lucide-react-native';
import { COLOR } from '@constants/color';

// 저장된 알약 개별 아이템 카드 컴포넌트
const PillSaveContent = ({
  saveData,
  onPressDetail,
  onLongPress,
  isEditing,
  isSelected,
}: IPillSaveContentProps) => {
  return (
    <TouchableOpacity
      style={styles.pillSaveContentWrapper}
      onPress={onPressDetail}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      <PillImage uri={saveData.ITEM_IMAGE} />

      {isEditing && (
        <View style={{ position: 'absolute', top: 8, right: 8 }}>
          {isSelected ? (
            <CheckCircle2 color="#FFF" fill={COLOR.primary} size={24} />
          ) : (
            <Circle color="#C4C4C4" fill="#FFF" size={24} />
          )}
        </View>
      )}

      <PillInfo pill={saveData} />
    </TouchableOpacity>
  );
};

export default memo(PillSaveContent);
