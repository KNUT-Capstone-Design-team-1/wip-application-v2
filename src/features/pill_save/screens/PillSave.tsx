import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from '@features/pill_save/styles/PillSave';
import PillSaveList from '@features/pill_save/components/organisms/PillSaveList';
import { usePillSaveList } from '@features/pill_save/hooks/use_pill_save_list';
import { COLOR_PRIMARY } from '@constants/color';

/**
 * 저장된 알약 개수 표시 헤더
 */
const SaveCountHeader = ({ count }: { count: number }) => (
  <View style={styles.header}>
    <Text style={styles.countText}>전체 개수 {count}개</Text>
  </View>
);

/**
 * 로딩 화면
 */
const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLOR_PRIMARY[100]} />
    <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
  </View>
);

const PillSave = () => {
  const { pillSaveData, loading, deleteSaveData } = usePillSaveList();

  if (loading) {
    return <LoadingView />;
  }

  return (
    <View style={styles.pillSaveRoot}>
      <SaveCountHeader count={pillSaveData.length} />

      <PillSaveList pillSaveData={pillSaveData} onDataChange={deleteSaveData} />
    </View>
  );
};

export default PillSave;
