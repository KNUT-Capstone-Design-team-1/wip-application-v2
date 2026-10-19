import { memo } from 'react';
import { View } from 'react-native';
import { px } from '@utils/responsive';
import { styles } from '../../styles/molecules/SectionItem';
import type {
  DocumentParagraphProps,
  DocumentArticleProps,
  SectionItemProps,
} from '../../types/pill_detail_component_type';
import KeywordText from '../atoms/KeywordText';
import TableWebView from '../atoms/TableWebView';

// 문단 형식에 따른 표·텍스트 표시.
const DocumentParagraph = ({ paragraph, targetId }: DocumentParagraphProps) => {
  if (paragraph.table) {
    return <TableWebView html={paragraph.table} targetId={targetId} />;
  }

  return (
    <KeywordText
      text={paragraph.content || ''}
      targetId={targetId}
      size={16}
      style={[
        styles.paragraphText,
        { marginLeft: paragraph.textIndent === '0' ? px(8) : 0 },
      ]}
    />
  );
};

// 조항 제목·문단 목록 표시.
const DocumentArticle = ({ article, targetPrefix }: DocumentArticleProps) => (
  <View style={styles.articleWrapper}>
    {article.title ? (
      <KeywordText
        size={17}
        weight="bold"
        style={styles.articleTitle}
        text={article.title}
        targetId={targetPrefix + '-title'}
      />
    ) : null}
    {article.paragraphs.map((paragraph, index) => (
      <DocumentParagraph
        key={index}
        paragraph={paragraph}
        targetId={targetPrefix + '-' + index}
      />
    ))}
  </View>
);

// 문서 절 제목·조항 그룹 표시.
const SectionItem = ({
  sectionItem,
  targetPrefix = 'doc',
}: SectionItemProps) => {
  if (!sectionItem) {
    return null;
  }

  return (
    <View>
      {sectionItem.sections.map((section, index) => (
        <View key={index}>
          {section.title ? (
            <KeywordText
              size={18}
              weight="bold"
              style={styles.sectionTitle}
              text={section.title}
              targetId={targetPrefix + '-' + index + '-title'}
            />
          ) : null}
          {section.articles.map((article, articleIndex) => (
            <DocumentArticle
              key={articleIndex}
              article={article}
              targetPrefix={targetPrefix + '-' + index + '-' + articleIndex}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default memo(SectionItem);
