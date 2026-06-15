import { memo } from 'react';
import { Image } from '@components/common/CustomImage';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  IPillSaveContentProps,
  IPillSaveData,
} from '@features/pill_save/types/pill_save_type';
import { styles } from '@features/pill_save/styles/molecules/PillSaveContent';
import { X } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';

/**
 * 알약 이미지 컴포넌트
 */
const PillImage = ({ uri }: { uri: string }) => (
  <Image source={{ uri }} contentFit="contain" style={styles.pillImage} />
);

/**
 * 삭제 버튼 컴포넌트
 */
const DeleteButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    style={styles.closeButton}
    onPress={onPress}
    activeOpacity={0.6}
  >
    <X size={fontPx(14)} color={COLOR['white']} strokeWidth={4} />
  </TouchableOpacity>
);

/**
 * 알약 정보 컴포넌트
 */
const PillInfo = ({ pill }: { pill: IPillSaveData }) => (
  <View style={styles.pillInfoWrapper}>
    <Text style={styles.pillName} numberOfLines={2}>
      {pill.ITEM_NAME}
    </Text>
    <Text style={styles.pillClassName} numberOfLines={1}>
      {pill.CLASS_NAME}
    </Text>
    <View style={styles.pillInfoPrintWrapper}>
      <Text style={styles.pillPrintText} numberOfLines={1}>
        {pill.PRINT_FRONT || '없음'}
      </Text>
      <View style={styles.pillInfoSeparator} />
      <Text style={styles.pillPrintText} numberOfLines={1}>
        {pill.PRINT_BACK || '없음'}
      </Text>
    </View>
    <View style={styles.pillInfoEntpWrapper}>
      <Text style={styles.pillEntpName} numberOfLines={1}>
        {pill.ENTP_NAME}
      </Text>
    </View>
  </View>
);

/**
 * 저장된 알약 개별 아이템 카드 컴포넌트
 */
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
