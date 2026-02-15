import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/molecules/DetailSection';
import { decodeHtmlContent } from '../../utils/htmlDecoder';

interface IDetailSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  content?: string;
}

const DetailSection = ({
  title,
  isOpen,
  onToggle,
  content,
}: IDetailSectionProps) => {
  if (!content) return null;

  // HTML 태그를 일반 텍스트로 변환
  const decodedContent = decodeHtmlContent(content);

  return (
    <View style={styles.detailSectionWrapper}>
      <TouchableOpacity style={styles.detailInfoHeadWrapper} onPress={onToggle}>
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

export default DetailSection;
