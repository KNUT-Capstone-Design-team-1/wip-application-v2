import { memo, useState } from 'react';
import { View } from 'react-native';
import { useStore } from 'zustand';
import PillImageFallback from '@components/common/PillImageFallback';
import { normalizeImageUri } from '@features/pill_search_result_list/utils/pill_image_util';
import { Image } from '@components/common/CustomImage';
import { usePillDetailContext } from '../../hooks/use_pill_detail_context';
import { styles } from '../../styles/PillSearchResultDetailScreen';

// 알약 사진 또는 앱 로고 표시.
const PillDetailImage = () => {
  const store = usePillDetailContext();
  const imageUri = useStore(
    store,
    (state) => state.image || state.pillData?.ITEM_IMAGE,
  );

  const uri = normalizeImageUri(imageUri);
  const [failedUri, setFailedUri] = useState<string | null>(null);

  return (
    <View style={styles.pillImgContainer}>
      <View style={styles.pillImgWrapper}>
        {uri && failedUri !== uri ? (
          <Image
            style={styles.pillImg}
            source={{ uri }}
            contentFit="contain"
            onError={() => setFailedUri(uri)}
          />
        ) : (
          <View style={styles.pillDetailNoImageWrapper}>
            <PillImageFallback />
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(PillDetailImage);
