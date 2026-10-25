import { memo } from 'react';
import { BaseText } from '@components/common/BaseText';
import { useKeywordSearchActions } from '../../hooks/use_keyword_search_actions';
import { styles } from '../../styles/molecules/PillSafetySection';
import type { WarningKeywordsProps } from '../../types/pill_detail_component_type';

// 문구별 본문 찾기 링크.
const WarningKeywords = ({
  items,
  variant = 'warning',
}: WarningKeywordsProps) => {
  const { requestSearch } = useKeywordSearchActions();
  const textStyle =
    variant === 'reference' ? styles.referenceText : styles.warningText;

  const hasNoItems = !items?.length;

  if (hasNoItems) {
    return <>-</>;
  }

  return (
    <>
      {items.map((item, index) => (
        <BaseText key={item} weight="bold" size={14} style={textStyle}>
          {index > 0 ? ', ' : ''}
          <BaseText
            weight="bold"
            size={14}
            accessibilityRole="button"
            accessibilityLabel={item + ' 본문에서 찾기'}
            onPress={() => requestSearch(item)}
            style={textStyle}
          >
            {item}
          </BaseText>
        </BaseText>
      ))}
    </>
  );
};

export default memo(WarningKeywords);
