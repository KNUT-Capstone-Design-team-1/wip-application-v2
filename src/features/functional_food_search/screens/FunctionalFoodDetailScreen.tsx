import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { BaseText } from '@components/common/BaseText';
import NotItem from '@components/common/NotItem';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { useFunctionalFoodDetail } from '../hooks/use_functional_food_detail';
import { PRODUCT_INFO_FIELDS } from '../constants/nutrients';
import NutrientTable from '../components/organisms/NutrientTable';

// 표시할 가치가 없는 값(빈 값, '해당없음')인지 판별
const isMeaningless = (value: unknown): boolean => {
  const text = value == null ? '' : String(value).trim();
  return text === '' || text === '해당없음';
};

const FunctionalFoodDetailScreen = () => {
  const { foodCode } = useLocalSearchParams<{ foodCode: string }>();
  const { data, isLoading } = useFunctionalFoodDetail(foodCode);

  if (isLoading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color={COLOR.primary} />
      </View>
    );
  }

  if (!data) {
    return (
      <NotItem
        mainText="정보를 찾을 수 없어요"
        subText="잠시 후 다시 시도해 주세요"
        marginTop={String(px(80))}
      />
    );
  }

  const infoRows = PRODUCT_INFO_FIELDS.filter(
    (field) => !isMeaningless(data[field.key]),
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 제품명 헤더 */}
      <View style={styles.header}>
        <BaseText weight="bold" size={20} style={styles.title}>
          {data.foodName}
        </BaseText>
        {!isMeaningless(data.nutrientServingSize) && (
          <BaseText weight="medium" size={13} style={styles.serving}>
            영양성분 기준: {data.nutrientServingSize}
          </BaseText>
        )}
      </View>

      {/* 제품 정보 */}
      {infoRows.length > 0 && (
        <>
          <BaseText weight="bold" size={15} style={styles.sectionTitle}>
            제품 정보
          </BaseText>
          <View style={styles.infoBox}>
            {infoRows.map((field, index) => (
              <View
                key={field.key}
                style={[
                  styles.infoRow,
                  index === infoRows.length - 1 && styles.rowLast,
                ]}
              >
                <BaseText weight="medium" size={13} style={styles.infoLabel}>
                  {field.label}
                </BaseText>
                <BaseText weight="medium" size={13} style={styles.infoValue}>
                  {String(data[field.key])}
                </BaseText>
              </View>
            ))}
          </View>
        </>
      )}

      {/* 영양성분 */}
      <BaseText weight="bold" size={15} style={styles.sectionTitle}>
        영양성분
      </BaseText>
      <NutrientTable data={data} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG.base,
  },
  content: {
    paddingBottom: px(40),
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_BG.base,
  },
  header: {
    paddingHorizontal: px(16),
    paddingTop: px(20),
    paddingBottom: px(16),
    gap: px(8),
  },
  title: {
    color: COLOR_TEXT.title,
    lineHeight: px(28),
  },
  serving: {
    color: COLOR_TEXT.sub,
  },
  sectionTitle: {
    color: COLOR_TEXT.title,
    marginHorizontal: px(16),
    marginTop: px(12),
    marginBottom: px(10),
  },
  infoBox: {
    marginHorizontal: px(16),
    borderRadius: px(12),
    borderWidth: 1,
    borderColor: COLOR_LINE.border,
    backgroundColor: COLOR_BG.surface,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: px(16),
    paddingVertical: px(11),
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LINE.separator,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    width: px(120),
    color: COLOR_TEXT.sub,
  },
  infoValue: {
    flex: 1,
    color: COLOR_TEXT.body,
  },
});

export default FunctionalFoodDetailScreen;
