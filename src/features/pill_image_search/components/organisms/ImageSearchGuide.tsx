import { View, Text, Image } from 'react-native';
import { styles } from '../../styles/organisms/ImageSearchGuide';
import { AFTER_PILL_IMAGE_SEARCH as content } from '../../constants/pillImageSearch';
import { Info } from 'lucide-react-native';
import { COLOR, COLOR_PRIMARY } from '@constants/color';
import { fontPx } from '@utils/responsive';

const ImageSearchGuide = () => {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{content.title}</Text>
      <View style={styles.contentTitleWrapper}>
        <Info
          size={fontPx(24)}
          color={COLOR['white']}
          fill={COLOR_PRIMARY[300]}
        />
        <Text style={styles.contentTitle}>{content.contentTitle}</Text>
      </View>
      <Text style={styles.contentDescription}>
        {content.contentDescription}
      </Text>
      <Image
        source={content.contentImage}
        style={styles.contentImage}
        resizeMode="contain"
      />
    </View>
  );
};

export default ImageSearchGuide;
