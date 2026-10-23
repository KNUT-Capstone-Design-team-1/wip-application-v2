import { memo } from 'react';
import { BaseText } from '@components/common/BaseText';
import { useWarningKeywordActions } from '../../hooks/use_keyword_navigation_actions';
import { styles } from '../../styles/molecules/PillSafetySection';
import type { WarningKeywordsProps } from '../../types/pill_detail_component_type';

// 문구별 본문 찾기 링크.
const WarningKeywords = ({ items, matches }: WarningKeywordsProps) => {
  const jump = useWarningKeywordActions(matches);

  if (!items?.length) {
    return <>-</>;
  }

  return (
    <>
      {items.map((item, index) => (
        <BaseText key={item} weight="bold" size={14} style={styles.warningText}>
          {index > 0 ? ', ' : ''}
          <BaseText
            weight="bold"
            size={14}
            accessibilityRole="button"
            accessibilityLabel={item + ' 본문에서 찾기'}
            onPress={() => jump(item)}
            style={styles.warningText}
          >
            {item}
          </BaseText>
        </BaseText>
      ))}
    </>
  );
};

export default memo(WarningKeywords);
