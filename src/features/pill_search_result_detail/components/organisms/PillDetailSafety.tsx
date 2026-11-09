import { memo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useStore } from 'zustand';
import { COLOR_TEXT } from '@constants/color';
import { usePillDetailContext } from '../../hooks/use_pill_detail_context';
import { styles } from '../../styles/organisms/PillDetailInfo';
import PillSafetySection from '../molecules/PillSafetySection';

// 특수 분류는 서버 문서 로딩과 분리해 준비되는 즉시 표시한다.
const PillDetailSafety = () => {
  const store = usePillDetailContext();
  const loading = useStore(store, (state) => state.classificationLoading);
  const data = useStore(store, (state) => state.pillData);
  if (!data) return null;
  return (
    <View style={styles.detailInfoContainer}>
      {loading ? (
        <ActivityIndicator color={COLOR_TEXT.sub} />
      ) : (
        <PillSafetySection data={data} />
      )}
    </View>
  );
};

export default memo(PillDetailSafety);
