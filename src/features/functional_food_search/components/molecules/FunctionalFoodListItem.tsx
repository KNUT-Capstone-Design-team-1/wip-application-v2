import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { BaseText } from '@components/common/BaseText';
import SearchListRow from '@features/shared/components/SearchListRow';
import { COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { IHealthFunctionalFoodRawMaterial } from '@services/database/types';

interface IFunctionalFoodListItemProps {
  item: IHealthFunctionalFoodRawMaterial;
  onPress: (PRDLST_REPORT_NO: string) => void;
}

const FunctionalFoodListItem = ({
  item,
  onPress,
}: IFunctionalFoodListItemProps) => {
  const manufacturer = item.BSSH_NM;

  return (
    <View style={styles.container}>
      <SearchListRow
        style={styles.itemWrapper}
        onPress={() => onPress(item.PRDLST_REPORT_NO)}
        activeOpacity={0.5}
        trailing={<ChevronRight size={px(20)} color={COLOR_TEXT.disabled} />}
      >
        <View style={styles.textWrapper}>
          <BaseText
            weight="semiBold"
            size={15}
            numberOfLines={1}
            style={styles.name}
          >
            {item.PRDLST_NM}
          </BaseText>

          <View style={styles.metaRow}>
            {!!item.PRDT_SHAP_CD_NM && (
              <BaseText
                weight="medium"
                size={12}
                numberOfLines={1}
                style={styles.category}
              >
                {item.PRDT_SHAP_CD_NM}
              </BaseText>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: px(20),
  },
  itemWrapper: {
    alignItems: 'center',
    gap: px(8),
    paddingVertical: px(14),
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
  // 제품형태와 제조사를 함께 표시한다.
  category: {
    color: COLOR_TEXT.subTitle,
  },
  manufacturer: {
    flex: 1,
    color: COLOR_TEXT.sub,
  },
});

export default memo(FunctionalFoodListItem);
