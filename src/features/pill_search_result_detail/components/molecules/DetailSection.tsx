import { memo, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/molecules/DetailSection';
import { IDetailSectionProps } from '@features/pill_search_result_detail/types/pill_detail_type';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { xmlToJson } from '@features/pill_search_result_detail/utils/xml_parser';
import SectionItem from './SectionItem';

const DetailSection = ({
  title,
  isOpen,
  onToggle,
  content,
}: IDetailSectionProps) => {
  const parsedData = useMemo(() => {
    if (!content) return null;
    const result = xmlToJson(content);
    return result.doc;
  }, [content]);

  return (
    <View style={styles.detailSectionWrapper}>
      <TouchableOpacity
        style={styles.detailInfoHeadWrapper}
        onPress={onToggle}
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
          <SectionItem sectionItem={parsedData} />
        </View>
      )}
    </View>
  );
};

export default memo(DetailSection);
