import React, { memo } from 'react';
import { View } from 'react-native';
import KeywordText from '../atoms/KeywordText';
import { ISectionItemProps } from '@features/pill_search_result_detail/types/pill_detail_type';
import { styles } from '@features/pill_search_result_detail/styles/molecules/SectionItem';
import { px } from '@utils/responsive';
import TableWebView from '@features/pill_search_result_detail/components/atoms/TableWebView';

// 문서 절·문단·표 표시.
const SectionItem = ({
  sectionItem,
  targetPrefix = 'doc',
}: ISectionItemProps) => {
  if (!sectionItem || !sectionItem.sections) {
    return null;
  }

  return (
    <View>
      {sectionItem.sections.map((section, sIndex) => (
        <View key={`sec-${sIndex}`}>
          {section.title ? (
            <KeywordText
              size={18}
              weight="bold"
              style={styles.sectionTitle}
              text={section.title}
              targetId={`${targetPrefix}-${sIndex}-title`}
            />
          ) : null}
          {section.articles?.map((article, aIndex) => (
            <View key={`art-${sIndex}-${aIndex}`} style={styles.articleWrapper}>
              {article.title ? (
                <KeywordText
                  size={17}
                  weight="bold"
                  style={styles.articleTitle}
                  text={article.title}
                  targetId={`${targetPrefix}-${sIndex}-${aIndex}-title`}
                />
              ) : null}
              {article.paragraphs?.map((p, pIndex) => {
                if (p.table) {
                  return (
                    <TableWebView
                      key={`table-${pIndex}`}
                      html={p.table}
                      targetId={`${targetPrefix}-${sIndex}-${aIndex}-${pIndex}`}
                    />
                  );
                }

                const pContent = p.content ?? '';

                return (
                  <KeywordText
                    text={pContent}
                    targetId={`${targetPrefix}-${sIndex}-${aIndex}-${pIndex}`}
                    key={`p-${pIndex}`}
                    size={16}
                    style={[
                      styles.paragraphText,
                      { marginLeft: p.textIndent === '0' ? px(8) : 0 },
                    ]}
                  />
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
