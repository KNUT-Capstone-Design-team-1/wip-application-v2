import type { StyleProp, ViewStyle } from 'react-native';
import PillThumbnail from '@components/common/PillThumbnail';
import { styles } from '@features/pill_save/styles/atoms/PillImage';

// 보관함 리스트에서 썸네일을 보여주는 이미지 컴포넌트
export const PillImage = ({
  uri,
  style = styles.pillImage,
}: {
  uri?: string | null;
  style?: StyleProp<ViewStyle>;
}) => <PillThumbnail uri={uri} style={style} />;
