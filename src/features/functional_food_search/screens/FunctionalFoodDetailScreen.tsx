import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { BaseText } from '@components/common/BaseText';
import NotItem from '@components/common/NotItem';
import InfoRow from '@features/shared/components/InfoRow';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { screenPadding } from '@constants/size';
import { fontPx, px } from '@utils/responsive';
import { useHeaderTitleStore } from '@layouts/header/store/header_title_store';
import type { IHealthFunctionalFoodRawMaterial } from '@services/database/types';
import { useFunctionalFoodDetail } from '../hooks/use_functional_food_detail';

const isMeaningless = (value: unknown) =>
  value == null || !String(value).trim() || value === '해당없음';
const PRODUCT_FIELDS: {
  key: keyof IHealthFunctionalFoodRawMaterial;
  label: string;
}[] = [
  { key: 'BSSH_NM', label: '제조사' },
  { key: 'PRDLST_REPORT_NO', label: '품목제조신고번호' },
  { key: 'PRMS_DT', label: '보고일자' },
  { key: 'POG_DAYCNT', label: '소비기한' },
  { key: 'PRDT_SHAP_CD_NM', label: '제품형태' },
  { key: 'DISPOS', label: '성상' },
  { key: 'SHAP', label: '형태' },
  { key: 'LAST_UPDT_DTM', label: '자료 수정일' },
];
const DETAIL_FIELDS: {
  key: keyof IHealthFunctionalFoodRawMaterial;
  label: string;
}[] = [
  { key: 'NTK_MTHD', label: '섭취량·섭취방법' },
  { key: 'IFTKN_ATNT_MATR_CN', label: '섭취 시 주의사항' },
  { key: 'PRIMARY_FNCLTY', label: '기능성 내용' },
  { key: 'RAWMTRL_NM', label: '원재료' },
  { key: 'CSTDY_MTHD', label: '보관방법' },
  { key: 'STDR_STND', label: '기준 및 규격' },
];

const FunctionalFoodDetailScreen = () => {
  const { reportNumber } = useLocalSearchParams<{ reportNumber: string }>();
  const { data, classifications, isLoading } =
    useFunctionalFoodDetail(reportNumber);
  const { setTitle, resetTitle } = useHeaderTitleStore();
  useFocusEffect(
    useCallback(() => {
      if (data?.PRDLST_NM) setTitle(data.PRDLST_NM);
      return resetTitle;
    }, [data?.PRDLST_NM, setTitle, resetTitle]),
  );

  if (isLoading)
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color={COLOR.primary} />
      </View>
    );
  if (!data)
    return (
      <NotItem
        mainText="정보를 찾을 수 없어요"
        subText="잠시 후 다시 시도해 주세요"
        marginTop={String(px(80))}
      />
    );
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.section, styles.productSection]}>
        <BaseText weight="bold" size={20} style={styles.sectionTitle}>
          제품 정보
        </BaseText>
        <View style={styles.rows}>
          {PRODUCT_FIELDS.filter(({ key }) => !isMeaningless(data[key])).map(
            ({ key, label }) => (
              <InfoRow
                key={key}
                label={label}
                value={String(data[key])}
                labelWidth={px(128)}
                size={16}
              />
            ),
          )}
        </View>
      </View>
      {DETAIL_FIELDS.filter(({ key }) => !isMeaningless(data[key])).map(
        ({ key, label }) => (
          <View key={key} style={styles.section}>
            <BaseText weight="bold" size={20} style={styles.sectionTitle}>
              {label}
            </BaseText>
            <BaseText size={16} style={styles.paragraph}>
              {String(data[key])}
            </BaseText>
          </View>
        ),
      )}
      {classifications.length > 0 && (
        <View style={styles.section}>
          <BaseText weight="bold" size={20} style={styles.sectionTitle}>
            원재료별 기능성 기준
          </BaseText>
          <BaseText size={14} style={[styles.paragraph, styles.description]}>
            식품안전나라 품목분류 기준입니다. 이 제품의 섭취량과 섭취방법은 위
            제품 정보를 확인하세요.
          </BaseText>
          {classifications.map((item, index) => (
            <View
              key={item.id}
              style={[styles.rows, index > 0 && styles.classificationSpacing]}
            >
              <BaseText
                weight="bold"
                size={17}
                style={styles.classificationTitle}
              >
                {item.PRDCT_NM}
              </BaseText>
              {!isMeaningless(item.SKLL_IX_IRDNT_RAWMTRL) && (
                <InfoRow
                  labelWidth={px(128)}
                  size={16}
                  label="기준 성분"
                  value={item.SKLL_IX_IRDNT_RAWMTRL}
                />
              )}
              {!isMeaningless(item.PRIMARY_FNCLTY) && (
                <InfoRow
                  labelWidth={px(128)}
                  size={16}
                  label="기능성"
                  value={item.PRIMARY_FNCLTY}
                />
              )}
              {(item.DAY_INTK_LOWLIMIT || item.DAY_INTK_HIGHLIMIT) && (
                <InfoRow
                  labelWidth={px(128)}
                  size={16}
                  label="일일섭취량 기준"
                  value={
                    item.DAY_INTK_LOWLIMIT && item.DAY_INTK_HIGHLIMIT
                      ? item.DAY_INTK_LOWLIMIT +
                        ' ~ ' +
                        item.DAY_INTK_HIGHLIMIT +
                        ' ' +
                        item.INTK_UNIT
                      : item.DAY_INTK_LOWLIMIT
                        ? item.DAY_INTK_LOWLIMIT +
                          ' ' +
                          item.INTK_UNIT +
                          ' 이상'
                        : item.DAY_INTK_HIGHLIMIT +
                          ' ' +
                          item.INTK_UNIT +
                          ' 이하'
                  }
                />
              )}
              {!isMeaningless(item.INTK_MEMO) && (
                <InfoRow
                  labelWidth={px(128)}
                  size={16}
                  label="섭취량 설명"
                  value={item.INTK_MEMO}
                />
              )}
              {!isMeaningless(item.IFTKN_ATNT_MATR_CN) && (
                <InfoRow
                  labelWidth={px(128)}
                  size={16}
                  label="주의사항"
                  value={item.IFTKN_ATNT_MATR_CN}
                />
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG.surface,
  },
  paragraph: {
    marginTop: px(8),
    color: COLOR_TEXT.body,
    lineHeight: fontPx(24),
  },
  description: {
    color: COLOR_TEXT.sub,
    lineHeight: fontPx(20),
  },
  content: {
    backgroundColor: COLOR_BG.base,
    paddingBottom: px(40),
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_BG.surface,
  },
  section: {
    marginTop: px(8),
    backgroundColor: COLOR_BG.surface,
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: px(16),
  },
  productSection: {
    marginTop: 0,
    paddingTop: 0,
  },
  sectionTitle: {
    color: COLOR_TEXT.subTitle,
  },
  classificationSpacing: {
    marginTop: px(16),
  },

  classificationTitle: {
    color: COLOR_TEXT.title,
    marginTop: px(16),
    marginBottom: px(4),
  },
  rows: {
    marginTop: px(8),
  },
});

export default FunctionalFoodDetailScreen;
