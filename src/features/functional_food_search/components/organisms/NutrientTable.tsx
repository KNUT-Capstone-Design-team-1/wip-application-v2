import { StyleSheet, View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { IFunctionalFoodNutrients } from '@services/database/types';
import { NUTRIENT_FIELDS } from '../../constants/nutrients';

interface INutrientTableProps {
  data: IFunctionalFoodNutrients;
}

// 값이 비어있는지 판별 (0 은 유효한 값으로 유지)
const isEmptyValue = (value: unknown): boolean =>
  value == null || String(value).trim() === '';

const NutrientTable = ({ data }: INutrientTableProps) => {
  const visibleFields = NUTRIENT_FIELDS.filter(
    (field) => !isEmptyValue(data[field.key]),
  );

  if (visibleFields.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <BaseText weight="medium" size={13} style={styles.emptyText}>
          제공된 영양성분 정보가 없습니다.
        </BaseText>
      </View>
    );
  }

  return (
    <View style={styles.table}>
      {visibleFields.map((field, index) => (
        <View
          key={field.key}
          style={[
            styles.row,
            index === visibleFields.length - 1 && styles.rowLast,
          ]}
        >
          <BaseText weight="medium" size={14} style={styles.label}>
            {field.label}
          </BaseText>
          <BaseText weight="semiBold" size={14} style={styles.value}>
            {String(data[field.key])}
            <BaseText weight="regular" size={12} style={styles.unit}>
              {` ${field.unit}`}
            </BaseText>
          </BaseText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    marginHorizontal: px(16),
    borderRadius: px(12),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    backgroundColor: COLOR_BG.surface,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: px(16),
    paddingVertical: px(12),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.separator,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    color: COLOR_TEXT.label,
  },
  value: {
    color: COLOR_TEXT.title,
  },
  unit: {
    color: COLOR_TEXT.sub,
  },
  emptyBox: {
    marginHorizontal: px(16),
    paddingVertical: px(24),
    alignItems: 'center',
    borderRadius: px(12),
    backgroundColor: COLOR_BG.surface,
  },
  emptyText: {
    color: COLOR_TEXT.sub,
  },
});

export default NutrientTable;
