import PillDetailContent from '../components/organisms/PillDetailContent';
import { View, ScrollView } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import PillDetailSkeleton from '@features/pill_search_result_detail/components/organisms/PillDetailSkeleton';
import { styles } from '@features/pill_search_result_detail/styles/PillSearchResultDetailScreen';
import { usePillDetailScreen } from '@features/pill_search_result_detail/hooks/use_pill_detail_screen';
import FolderSelectModal from '@features/pill_save/components/organisms/FolderSelectModal';

import { KeywordNavigationProvider } from '../contexts/keyword_navigation_context';

// 알약 상세 화면 구성.
const PillSearchResultDetailScreen = () => {
  const {
    pillData,
    loading,
    itemImageStr,
    isSaved,
    savedFolderIds,
    isFolderModalVisible,
    openFolderModal,
    closeFolderModal,
    handleSaveComplete,
    detailLoading,
  } = usePillDetailScreen();

  if (loading) {
    return (
      <ScrollView style={styles.scrollViewWrapper}>
        <PillDetailSkeleton />
      </ScrollView>
    );
  }

  if (!pillData) {
    return (
      <View style={styles.pillResultDetailRoot}>
        <BaseText
          weight="semiBold"
          size={18}
          style={styles.pillResultDetailNotFoundText}
        >
          데이터를 불러올 수 없습니다.
        </BaseText>
      </View>
    );
  }

  return (
    <KeywordNavigationProvider key={pillData.ITEM_SEQ}>
      <PillDetailContent
        data={pillData}
        image={itemImageStr}
        isSaved={isSaved}
        detailLoading={detailLoading}
        onSaveToggle={openFolderModal}
      />

      <FolderSelectModal
        isVisible={isFolderModalVisible}
        onClose={closeFolderModal}
        itemSeq={pillData.ITEM_SEQ}
        itemName={pillData.ITEM_NAME}
        initialSelectedIds={savedFolderIds}
        onSaveComplete={handleSaveComplete}
      />
    </KeywordNavigationProvider>
  );
};

export default PillSearchResultDetailScreen;
