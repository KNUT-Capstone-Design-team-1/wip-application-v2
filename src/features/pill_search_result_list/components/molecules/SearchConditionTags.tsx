import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useSearchResultListStore } from '../../store/search_result_list_store';
import { styles } from '../../styles/molecules/SearchConditionTags';

interface SearchConditionTagsProps {
  markImages?: { code: string; base64: string }[];
}

const SearchConditionTags = ({ markImages }: SearchConditionTagsProps) => {
  const { searchParam } = useSearchResultListStore();

  if (!searchParam) {
    return null;
  }

  const renderTags = () => {
    const tags: { label: string; value: string; images?: string[] }[] = [];

    if (searchParam.ITEM_NAME) {
      tags.push({ label: '제품명', value: searchParam.ITEM_NAME });
    }

    if (searchParam.ENTP_NAME) {
      tags.push({ label: '회사명', value: searchParam.ENTP_NAME });
    }

    if (searchParam.PRINT_FRONT || searchParam.PRINT_FRONT_EXACTLY) {
      tags.push({
        label: '식별(앞)',
        value: (searchParam.PRINT_FRONT ||
          searchParam.PRINT_FRONT_EXACTLY) as string,
      });
    }

    if (searchParam.PRINT_BACK || searchParam.PRINT_BACK_EXACTLY) {
      tags.push({
        label: '식별(뒤)',
        value: (searchParam.PRINT_BACK ||
          searchParam.PRINT_BACK_EXACTLY) as string,
      });
    }

    if (searchParam.DRUG_SHAPE && searchParam.DRUG_SHAPE.length > 0) {
      tags.push({ label: '모양', value: searchParam.DRUG_SHAPE.join(', ') });
    }

    const colors = Array.from(
      new Set([
        ...(searchParam.COLOR_CLASS1 || []),
        ...(searchParam.COLOR_CLASS2 || []),
      ]),
    );

    if (colors.length > 0) {
      tags.push({ label: '색상', value: colors.join(', ') });
    }

    const lines = Array.from(
      new Set([
        ...(searchParam.LINE_FRONT || []),
        ...(searchParam.LINE_BACK || []),
      ]),
    );

    if (lines.length > 0) {
      tags.push({ label: '분할선', value: lines.join(', ') });
    }

    if (searchParam.FORM_CODE && searchParam.FORM_CODE.length > 0) {
      tags.push({ label: '제형', value: searchParam.FORM_CODE.join(', ') });
    }

    const marks = Array.from(
      new Set(
        [searchParam.MARK_CODE_FRONT, searchParam.MARK_CODE_BACK].filter(
          Boolean,
        ),
      ),
    ) as string[];

    if (marks.length > 0) {
      const images = marks
        .map((code) => markImages?.find((m) => m.code === code)?.base64)
        .filter((img): img is string => !!img);

      tags.push({ label: '마크', value: '', images });
    }

    if (tags.length === 0) {
      return null;
    }

    return (
      <View style={styles.tagList}>
        {tags.map((tag, index) => (
          <View key={`${tag.label}-${index}`} style={styles.tag}>
            <Text style={styles.tagLabel}>{tag.label}:</Text>
            {tag.value ? (
              <Text style={styles.tagValue}>{tag.value}</Text>
            ) : null}
            {tag.images &&
              tag.images.map((uri, idx) => (
                <Image
                  key={`mark-img-${idx}`}
                  source={{ uri }}
                  style={styles.tagImage}
                />
              ))}
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
