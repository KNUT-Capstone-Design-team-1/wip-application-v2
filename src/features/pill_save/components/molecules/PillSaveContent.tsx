import { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { IPillSaveContentProps } from '@features/pill_save/types/pill_save_type';
import CloseIcon from '@assets/icons/close.svg';
import { styles } from '@features/pill_save/styles/molecules/PillSaveContent';

/**
 * 알약 이미지 컴포넌트
 */
const PillImage = ({ uri }: { uri: string }) => (
  <Image source={{ uri }} resizeMode="contain" style={styles.pillImage} />
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
    <CloseIcon width={10} height={10} />
  </TouchableOpacity>
);

/**
 * 알약 정보 컴포넌트
 */
const PillInfo = ({
  name,
  company,
  chart,
}: {
  name: string;
  company: string;
  chart: string;
}) => (
  <View style={styles.pillInfoWrapper}>
    <Text style={styles.pillName} numberOfLines={2}>
      {name}
    </Text>
    <Text style={styles.pillCompany} numberOfLines={1}>
      {company}
    </Text>
    <Text style={styles.pillChart} numberOfLines={2}>
      {chart}
    </Text>
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

      <PillInfo
        name={saveData.ITEM_NAME}
        company={saveData.ENTP_NAME}
        chart={saveData.CHART}
      />
    </TouchableOpacity>
  );
};

export default memo(PillSaveContent);
