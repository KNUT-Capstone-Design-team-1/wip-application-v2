import { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/molecules/DetailSection';
import { decodeHtmlContent } from '../../utils/htmlDecoder';
import { IDetailSectionProps } from '@features/pill_search_result_detail/types/pill_detail_type';

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
        <Text style={styles.arrowIcon}>{isOpen ? '▼' : '▲'}</Text>
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
