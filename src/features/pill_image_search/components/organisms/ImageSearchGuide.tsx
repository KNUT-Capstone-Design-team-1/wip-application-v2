import { Image } from '@components/common/CustomImage';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/organisms/ImageSearchGuide';
import { AFTER_PILL_IMAGE_SEARCH as content } from '../../constants/pillImageSearch';
import { Info } from 'lucide-react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';

const ImageSearchGuide = () => {
  return (
    <View style={styles.contentContainer}>
      <BaseText size={18} weight="bold" style={styles.title}>
        {content.title}
      </BaseText>
      <View style={styles.contentTitleWrapper}>
        <Info
          size={fontPx(24)}
          color={COLOR['white']}
          fill={COLOR_TEXT['label']}
        />
        <BaseText size={16} weight="medium" style={styles.contentTitle}>
          {content.contentTitle}
        </BaseText>
      </View>
      <BaseText size={14} weight="medium" style={styles.contentDescription}>
        {content.contentDescription}
      </BaseText>
      <Image
        source={content.contentImage}
        style={styles.contentImage}
        contentFit="contain"
      />
    </View>
  );
};

export default ImageSearchGuide;
