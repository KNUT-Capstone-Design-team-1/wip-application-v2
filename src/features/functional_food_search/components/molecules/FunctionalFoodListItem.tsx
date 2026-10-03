import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { BaseText } from '@components/common/BaseText';
import SearchListRow from '@features/shared/components/SearchListRow';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { IFunctionalFoodNutrients } from '@services/database/types';

interface IFunctionalFoodListItemProps {
  item: IFunctionalFoodNutrients;
  onPress: (foodCode: string) => void;
}

const FunctionalFoodListItem = ({
  item,
  onPress,
}: IFunctionalFoodListItemProps) => {
  const manufacturer =
    item.manufacturerName && item.manufacturerName !== '해당없음'
      ? item.manufacturerName
      : item.importerName && item.importerName !== '해당없음'
        ? item.importerName
        : '';

  return (
    <SearchListRow
      style={styles.container}
      onPress={() => onPress(item.foodCode)}
      trailing={<ChevronRight size={px(20)} color={COLOR_TEXT.disabled} />}
    >
      <View style={styles.textWrapper}>
        <BaseText
          weight="semiBold"
          size={15}
          numberOfLines={2}
          style={styles.name}
        >
          {item.foodName}
        </BaseText>

        <View style={styles.metaRow}>
          {!!item.foodMediumCategoryName && (
            <View style={styles.categoryTag}>
              <BaseText weight="medium" size={11} style={styles.categoryText}>
                {item.foodMediumCategoryName}
              </BaseText>
            </View>
          )}
          {!!manufacturer && (
            <BaseText
              weight="regular"
              size={12}
              numberOfLines={1}
              style={styles.manufacturer}
            >
              {manufacturer}
            </BaseText>
          )}
        </View>
      </View>
    </SearchListRow>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: px(8),
    paddingVertical: px(14),
    paddingHorizontal: px(16),
    backgroundColor: COLOR_BG.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.separator,
  },
  textWrapper: {
    flex: 1,
    gap: px(6),
  },
  name: {
    color: COLOR_TEXT.title,
    lineHeight: px(20),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(8),
  },
  categoryTag: {
    paddingHorizontal: px(8),
    paddingVertical: px(3),
    borderRadius: px(6),
    backgroundColor: COLOR_BG.base,
  },
  categoryText: {
    color: COLOR_TEXT.subTitle,
  },
  manufacturer: {
    flex: 1,
    color: COLOR_TEXT.sub,
  },
});

export default memo(FunctionalFoodListItem);
