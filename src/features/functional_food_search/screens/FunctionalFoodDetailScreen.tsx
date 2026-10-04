import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { BaseText } from '@components/common/BaseText';
import NotItem from '@components/common/NotItem';
import InfoRow from '@features/shared/components/InfoRow';
import { GlobalNativeAd } from '@features/ads/components/GlobalNativeAd';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';
import { useFunctionalFoodDetail } from '../hooks/use_functional_food_detail';
import { NUTRIENT_FIELDS, PRODUCT_INFO_FIELDS } from '../constants/nutrients';

// 표시할 가치가 없는 값(빈 값, '해당없음')인지 판별
const isMeaningless = (value: unknown): boolean => {
  const text = value == null ? '' : String(value).trim();
  return text === '' || text === '해당없음';
};

const FunctionalFoodDetailScreen = () => {
  const { foodCode } = useLocalSearchParams<{ foodCode: string }>();
  const { data, isLoading } = useFunctionalFoodDetail(foodCode);

  const { setTitle, resetTitle } = useHeaderTitleStore();

  // 포커스 시 헤더 타이틀을 제품명으로 설정 (알약/공지 상세와 동일한 공용 헤더 방식)
  useFocusEffect(
    useCallback(() => {
      if (data?.foodName) {
        setTitle(data.foodName);
      }

      return () => {
        resetTitle();
      };
    }, [data?.foodName, setTitle, resetTitle]),
  );

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
  const nutrientRows = NUTRIENT_FIELDS.filter(
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
          <BaseText weight="bold" size={16} style={styles.sectionTitle}>
            제품 정보
          </BaseText>
          <View style={styles.rows}>
            {infoRows.map((field) => (
              <InfoRow
                key={field.key}
                label={field.label}
                value={String(data[field.key])}
                labelWidth={px(128)}
              />
            ))}
          </View>
        </>
      )}

      {/* Native Ad 표시 위치 (제품 정보 ↔ 영양성분 사이) */}
      <GlobalNativeAd banner={true} />

      {/* 영양성분 */}
      <BaseText weight="bold" size={16} style={styles.sectionTitle}>
        영양성분
      </BaseText>
      {nutrientRows.length > 0 ? (
        <View style={styles.rows}>
          {nutrientRows.map((field) => (
            <InfoRow
              key={field.key}
              label={field.label}
              value={`${data[field.key]} ${field.unit}`}
            />
          ))}
        </View>
      ) : (
        <BaseText weight="medium" size={13} style={styles.emptyText}>
          제공된 영양성분 정보가 없습니다.
        </BaseText>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG.surface,
  },
  content: {
    paddingBottom: px(40),
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_BG.surface,
  },
  header: {
    paddingHorizontal: px(16),
    paddingTop: px(20),
    paddingBottom: px(8),
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
    marginTop: px(16),
    marginBottom: px(4),
  },
  rows: {
    paddingHorizontal: px(16),
  },
  emptyText: {
    marginHorizontal: px(16),
    marginTop: px(8),
    color: COLOR_TEXT.sub,
  },
});

export default FunctionalFoodDetailScreen;
