import { useMemo, useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from '@components/common/CustomImage';
import PillImageFallback from '@components/common/PillImageFallback';
import { normalizeImageUri } from '@features/pill_search_result_list/utils/pill_image_util';
import { styles } from '@features/pill_save/styles/atoms/PillImage';

// 보관함 리스트에서 썸네일을 보여주는 이미지 컴포넌트
export const PillImage = ({
  uri,
  style = styles.pillImage,
}: {
  uri?: string | null;
  style?: StyleProp<ViewStyle>;
}) => {
  const normalizedUri = useMemo(() => normalizeImageUri(uri), [uri]);
  const [failedUri, setFailedUri] = useState<string | null>(null);

  return (
    <View style={[style, styles.imageContainer]}>
      {normalizedUri && failedUri !== normalizedUri ? (
        <Image
          source={{ uri: normalizedUri }}
          contentFit="cover"
          style={styles.image}
          onError={() => setFailedUri(normalizedUri)}
        />
      ) : (
        <PillImageFallback />
      )}
    </View>
  );
};
