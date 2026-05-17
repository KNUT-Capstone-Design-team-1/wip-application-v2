import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSearchResultListStore } from '../../store/search_result_list_store';
import { styles } from '../../styles/PillSearchResultList';

const SearchConditionTags = () => {
  const { searchParam } = useSearchResultListStore();

  if (!searchParam) return null;

  const renderTags = () => {
    const tags: { label: string; value: string }[] = [];

    if (searchParam.ITEM_NAME) {
      tags.push({ label: '제품명', value: searchParam.ITEM_NAME });
    }
    if (searchParam.ENTP_NAME) {
      tags.push({ label: '회사명', value: searchParam.ENTP_NAME });
    }
    if (searchParam.PRINT_FRONT) {
      tags.push({ label: '식별(앞)', value: searchParam.PRINT_FRONT });
    }
    if (searchParam.PRINT_FRONT_EXACTLY) {
      tags.push({ label: '식별(앞)', value: searchParam.PRINT_FRONT_EXACTLY });
    }
    if (searchParam.PRINT_BACK) {
      tags.push({ label: '식별(뒤)', value: searchParam.PRINT_BACK });
    }
    if (searchParam.PRINT_BACK_EXACTLY) {
      tags.push({ label: '식별(뒤)', value: searchParam.PRINT_BACK_EXACTLY });
    }
    if (searchParam.DRUG_SHAPE && searchParam.DRUG_SHAPE.length > 0) {
      tags.push({ label: '모양', value: searchParam.DRUG_SHAPE.join(', ') });
    }
    if (searchParam.COLOR_CLASS1 && searchParam.COLOR_CLASS1.length > 0) {
      tags.push({
        label: '색상(앞)',
        value: searchParam.COLOR_CLASS1.join(', '),
      });
    }
    if (searchParam.COLOR_CLASS2 && searchParam.COLOR_CLASS2.length > 0) {
      tags.push({
        label: '색상(뒤)',
        value: searchParam.COLOR_CLASS2.join(', '),
      });
    }
    if (searchParam.LINE_FRONT && searchParam.LINE_FRONT.length > 0) {
      tags.push({
        label: '분할선(앞)',
        value: searchParam.LINE_FRONT.join(', '),
      });
    }
    if (searchParam.LINE_BACK && searchParam.LINE_BACK.length > 0) {
      tags.push({
        label: '분할선(뒤)',
        value: searchParam.LINE_BACK.join(', '),
      });
    }
    if (searchParam.FORM_CODE && searchParam.FORM_CODE.length > 0) {
      tags.push({ label: '제형', value: searchParam.FORM_CODE.join(', ') });
    }
    if (searchParam.MARK_CODE_FRONT) {
      tags.push({ label: '마크(앞)', value: searchParam.MARK_CODE_FRONT });
    }
    if (searchParam.MARK_CODE_BACK) {
      tags.push({ label: '마크(뒤)', value: searchParam.MARK_CODE_BACK });
    }

    if (tags.length === 0) return null;

    return (
      <View style={styles.tagList}>
        {tags.map((tag, index) => (
          <View key={`${tag.label}-${index}`} style={styles.tag}>
            <Text style={styles.tagLabel}>{tag.label}:</Text>
            <Text style={styles.tagValue}>{tag.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.searchConditionContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {renderTags()}
      </ScrollView>
    </View>
  );
};

export default SearchConditionTags;
