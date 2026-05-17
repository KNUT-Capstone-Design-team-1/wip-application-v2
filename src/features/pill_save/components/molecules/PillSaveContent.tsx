import { View, Text, Image, TouchableOpacity } from 'react-native';
import { IPillSaveContentProps } from '@features/pill_save/types/pill_save_type';
import CloseIcon from '@assets/icons/close.svg';
import { styles } from '../../styles/molecules/PillSaveContent';

const PillSaveContent = ({
  saveData,
  onPressDetail,
  onPressDelete,
}: IPillSaveContentProps) => {
  return (
    <View style={styles.pillSaveContentWrapper}>
      <Image
        source={{ uri: saveData.ITEM_IMAGE }}
        resizeMode="contain"
        style={styles.pillImage}
      />
      <TouchableOpacity style={styles.closeButton} onPress={onPressDelete}>
        <CloseIcon width={10} height={10} />
      </TouchableOpacity>
      <View style={styles.pillInfoWrapper}>
        <Text style={styles.pillName} numberOfLines={2}>
          {saveData.ITEM_NAME}
        </Text>
        <Text style={styles.pillCompany} numberOfLines={1}>
          {saveData.ENTP_NAME}
        </Text>
        <Text style={styles.pillChart} numberOfLines={2}>
          {saveData.CHART}
        </Text>
      </View>
      <TouchableOpacity style={styles.detailButton} onPress={onPressDetail}>
        <Text style={styles.detailButtonText}>자세히 보기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PillSaveContent;
