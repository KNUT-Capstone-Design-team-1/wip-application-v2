import { Image } from '@components/common/CustomImage';
import { styles } from '@features/pill_save/styles/atoms/PillImage';

// 알약 보관함 리스트에서 썸네일을 보여주는 이미지 컴포넌트
export const PillImage = ({ uri }: { uri: string }) => (
  <Image source={{ uri }} contentFit="cover" style={styles.pillImage} />
);
