import { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/molecules/DetailSection';
import { decodeHtmlContent } from '../../utils/htmlDecoder';
import { IDetailSectionProps } from '@features/pill_search_result_detail/types/pill_detail_type';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLOR_PRIMARY } from '@constants/color';
import { fontPx } from '@utils/responsive';

const DetailSection = ({
  title,
  isOpen,
  onToggle,
  content,
}: IDetailSectionProps) => {
  const decodedContent = useMemo(() => {
    if (!content) {
      return '';
    }
    return decodeHtmlContent(content);
  }, [content]);

  if (!content) {
    return null;
  }

  return (
    <View style={styles.detailSectionWrapper}>
      <TouchableOpacity
        style={styles.detailInfoHeadWrapper}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.detailInfoHeadText}>{title}</Text>
        {isOpen ? (
          <ChevronDown
            size={fontPx(24)}
            color={COLOR_PRIMARY[200]}
            strokeWidth={2}
          />
        ) : (
          <ChevronUp
            size={fontPx(24)}
            color={COLOR_PRIMARY[200]}
            strokeWidth={2}
          />
        )}
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.detailInfoContent}>
          <Text style={styles.detailInfoText}>{decodedContent}</Text>
        </View>
      )}
    </View>
  );
};

export default memo(DetailSection);
