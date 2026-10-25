import { memo, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import { xmlToJson } from '@features/pill_search_result_detail/utils/xml_parser';
import { fontPx } from '@utils/responsive';
import { useDetailSectionExpansion } from '../../hooks/use_pill_detail_expansion';
import { styles } from '../../styles/molecules/DetailSection';
import type { DetailSectionProps } from '../../types/pill_detail_component_type';
import SectionItem from './SectionItem';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

// 접기 상태에 따른 상세 문서 표시.
const DetailSection = ({ title, content }: DetailSectionProps) => {
  const { isOpen, toggle } = useDetailSectionExpansion();
  const parsedData = useMemo(() => {
    const hasNoContent = !content;

    if (hasNoContent) {
      return null;
    }

    const result = xmlToJson(content);

    return result.doc;
  }, [content]);

  return (
    <View style={styles.detailSectionWrapper}>
      <TouchableOpacity
        style={styles.detailInfoHeadWrapper}
        onPress={toggle}
        activeOpacity={0.7}
      >
        <BaseText weight="bold" size={20} style={styles.detailInfoHeadText}>
          {title}
        </BaseText>
        {isOpen ? (
          <ChevronDown
            size={fontPx(24)}
            color={COLOR['secondary']}
            strokeWidth={2}
          />
        ) : (
          <ChevronUp
            size={fontPx(24)}
            color={COLOR['secondary']}
            strokeWidth={2}
          />
        )}
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.detailInfoContent}>
          <SectionItem sectionItem={parsedData} targetPrefix={title} />
        </View>
      )}
    </View>
  );
};

export default memo(DetailSection);
