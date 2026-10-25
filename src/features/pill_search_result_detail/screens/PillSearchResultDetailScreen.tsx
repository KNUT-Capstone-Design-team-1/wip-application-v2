import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useStore } from 'zustand';
import { BaseText } from '@components/common/BaseText';
import FolderSelectModal from '@features/pill_save/components/organisms/FolderSelectModal';
import PillDetailContent from '../components/organisms/PillDetailContent';
import PillDetailSkeleton from '../components/organisms/PillDetailSkeleton';
import { KeywordNavigationProvider } from '../contexts/keyword_navigation_context';
import { PillDetailProvider } from '../contexts/pill_detail_context';
import { usePillDetailSaveActions } from '../hooks/use_pill_detail_actions';
import { usePillDetailContext } from '../hooks/use_pill_detail_context';
import { usePillDetailInit } from '../hooks/use_pill_detail_init';
import { styles } from '../styles/PillSearchResultDetailScreen';

// 저장 폴더 모달에 필요한 상태만 구독.
const PillDetailSaveModal = () => {
  const store = usePillDetailContext();
  const visible = useStore(store, (state) => state.isFolderModalVisible);
  const savedFolderIds = useStore(store, (state) => state.savedFolderIds);
  const itemSeq = useStore(store, (state) => state.pillData?.ITEM_SEQ);
  const itemName = useStore(store, (state) => state.pillData?.ITEM_NAME);
  const { closeFolderModal, completeSave } = usePillDetailSaveActions();

  const hasIncompleteRoute = !itemSeq || !itemName;

  if (hasIncompleteRoute) {
    return null;
  }

  return (
    <FolderSelectModal
      isVisible={visible}
      onClose={closeFolderModal}
      itemSeq={itemSeq}
      itemName={itemName}
      initialSelectedIds={savedFolderIds}
      onSaveComplete={completeSave}
    />
  );
};

// 초기 조회 상태에 따른 상세 화면 구성.
const PillDetailView = () => {
  const store = usePillDetailContext();

  const loading = useStore(store, (state) => state.loading);
  const hasData = useStore(store, (state) => state.pillData !== null);
  usePillDetailInit();

  if (loading) {
    return (
      <ScrollView style={styles.scrollViewWrapper}>
        <PillDetailSkeleton />
      </ScrollView>
    );
  }

  if (!hasData) {
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
    <KeywordNavigationProvider>
      <PillDetailContent />
      <PillDetailSaveModal />
    </KeywordNavigationProvider>
  );
};

// 경로와 화면별 의존성 연결.
const PillSearchResultDetailScreen = () => {
  const { ITEM_SEQ, itemImage } = useLocalSearchParams();
  const itemSeq = Array.isArray(ITEM_SEQ) ? ITEM_SEQ[0] : ITEM_SEQ;
  const image = Array.isArray(itemImage) ? itemImage[0] : itemImage;

  return (
    <PillDetailProvider key={itemSeq} itemSeq={itemSeq} image={image}>
      <PillDetailView />
    </PillDetailProvider>
  );
};

export default PillSearchResultDetailScreen;
