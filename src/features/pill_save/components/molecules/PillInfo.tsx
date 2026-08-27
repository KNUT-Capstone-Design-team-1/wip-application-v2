import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import { styles } from '@features/pill_save/styles/molecules/PillInfo';

// 알약 보관함 리스트 아이템의 상세 텍스트(이름, 분류, 식별문자 등) 컴포넌트
export const PillInfo = ({ pill }: { pill: IPillSaveData }) => (
  <View style={styles.pillInfoWrapper}>
    <BaseText size={12} weight="bold" style={styles.pillName} numberOfLines={2}>
      {pill.ITEM_NAME}
    </BaseText>
    <BaseText
      size={10}
      weight="semiBold"
      style={styles.pillClassName}
      numberOfLines={1}
    >
      {pill.CLASS_NAME}
    </BaseText>
    <View style={styles.pillInfoPrintWrapper}>
      <BaseText
        size={10}
        weight="semiBold"
        style={styles.pillPrintText}
        numberOfLines={1}
      >
        {pill.PRINT_FRONT || '없음'}
      </BaseText>
      <View style={styles.pillInfoSeparator} />
      <BaseText
        size={10}
        weight="semiBold"
        style={styles.pillPrintText}
        numberOfLines={1}
      >
        {pill.PRINT_BACK || '없음'}
      </BaseText>
    </View>
    <View style={styles.pillInfoEntpWrapper}>
      <BaseText
        size={10}
        weight="semiBold"
        style={styles.pillEntpName}
        numberOfLines={1}
      >
        {pill.ENTP_NAME}
      </BaseText>
    </View>
  </View>
);
