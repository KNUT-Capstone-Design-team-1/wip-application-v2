import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { ISectionItemProps } from '@features/pill_search_result_detail/types/pill_detail_type';
import { COLOR_TEXT } from '@constants/color';
import { styles } from '@features/pill_search_result_detail/styles/molecules/SectionItem';
import { px } from '@utils/responsive';
import TableWebView from '@features/pill_search_result_detail/components/atoms/TableWebView';

const SectionItem = ({ sectionItem }: ISectionItemProps) => {
  if (!sectionItem || !sectionItem.sections) return null;

  return (
    <View>
      {sectionItem.sections.map((section, sIndex) => (
        <View key={`sec-${sIndex}`}>
          {section.title ? (
            <BaseText size={18} weight="bold" style={styles.sectionTitle}>
              {section.title}
            </BaseText>
          ) : null}
          {section.articles?.map((article, aIndex) => (
            <View key={`art-${sIndex}-${aIndex}`} style={styles.articleWrapper}>
              {article.title ? (
                <BaseText size={17} weight="bold" style={styles.articleTitle}>
                  {article.title}
                </BaseText>
              ) : null}
              {article.paragraphs?.map((p, pIndex) => {
                if (p.table) {
                  return (
                    <TableWebView key={`table-${pIndex}`} html={p.table} />
                  );
                }
                const pContent = p.content ?? '';
                return (
                  <BaseText
                    key={`p-${pIndex}`}
                    size={16}
                    style={[
                      styles.paragraphText,
                      { marginLeft: p.textIndent === '0' ? px(8) : 0 },
                    ]}
                  >
                    {pContent}
                  </BaseText>
                );
              })}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default memo(SectionItem);
