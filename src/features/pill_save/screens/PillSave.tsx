import { View, ActivityIndicator } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_save/styles/PillSave';
import PillSaveList from '@features/pill_save/components/organisms/PillSaveList';
import { usePillSaveList } from '@features/pill_save/hooks/use_pill_save_list';
import { COLOR_PRIMARY } from '@constants/color';

/**
 * 저장된 알약 개수 표시 헤더
 */
const SaveCountHeader = ({ count }: { count: number }) => (
  <View style={styles.header}>
    <BaseText size={14} weight="semiBold" style={styles.countText}>
      전체 개수 {count}
    </BaseText>
  </View>
);

/**
 * 로딩 화면
 */
const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLOR_PRIMARY[100]} />
    <BaseText size={16} weight="bold" style={styles.loadingText}>
      데이터를 불러오는 중...
    </BaseText>
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
