import { memo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

interface IInfoRowProps {
  label: string;
  value?: string | ReactNode;
  // 긴 라벨(예: '품목제조신고번호')이 값과 붙지 않도록 라벨 폭을 조절 (기본 px(100))
  labelWidth?: number;
}

/**
 * 라벨-값 한 줄을 표시하는 공용 행 컴포넌트
 * 알약 상세·영양제 상세 등 상세 화면 전반에서 재사용한다.
 * value가 비어있으면 렌더하지 않는다.
 */
const InfoRow = ({ label, value, labelWidth }: IInfoRowProps) => {
  if (!value || value === 'null') {
    return null;
  }

  return (
    <View style={styles.infoRow}>
      <BaseText
        weight="semiBold"
        size={14}
        style={[styles.infoLabel, labelWidth != null && { width: labelWidth }]}
      >
        {label}
      </BaseText>
      <BaseText
        weight="medium"
        size={14}
        selectable={true}
        style={styles.infoValue}
      >
        {value}
      </BaseText>
    </View>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    gap: px(8),
    paddingVertical: px(8),
    borderBottomWidth: px(1),
    borderBottomColor: COLOR_LINE.border,
  },
  infoLabel: {
    color: COLOR_TEXT.label,
    width: px(100),
  },
  infoValue: {
    color: COLOR_TEXT.body,
    flex: 1,
  },
});

export default memo(InfoRow);
