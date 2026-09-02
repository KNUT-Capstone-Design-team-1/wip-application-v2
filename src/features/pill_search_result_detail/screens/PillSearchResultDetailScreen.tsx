import { Image } from '@components/common/CustomImage';
import { View, ScrollView } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import PillDetailInfo from '@features/pill_search_result_detail/components/organisms/PillDetailInfo';
import PillDetailSkeleton from '@features/pill_search_result_detail/components/organisms/PillDetailSkeleton';
import { styles } from '@features/pill_search_result_detail/styles/PillSearchResultDetailScreen';
import { usePillDetailScreen } from '@features/pill_search_result_detail/hooks/use_pill_detail_screen';
import FolderSelectModal from '@features/pill_save/components/organisms/FolderSelectModal';
import { openStockInquiryModal } from '@features/nearby_pharmacy/hooks/use_stock_inquiry';

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
    <>
      <ScrollView style={styles.scrollViewWrapper}>
        <View style={styles.viewWrapper}>
          {/* 알약 이미지 */}
          <View style={styles.pillImgContainer}>
            <View style={styles.pillImgWrapper}>
              {itemImageStr || pillData.ITEM_IMAGE ? (
                <Image
                  style={styles.pillImg}
                  source={{ uri: itemImageStr || pillData.ITEM_IMAGE || '' }}
                  contentFit="contain"
                />
              ) : (
                <View style={styles.pillDetailNoImageWrapper}>
                  <BaseText
                    weight="semiBold"
                    size={16}
                    style={styles.pillDetailNoImageText}
                  >
                    이미지가 없습니다
                  </BaseText>
                </View>
              )}
            </View>
          </View>

          {/* 알약 정보 */}
          <PillDetailInfo
            data={pillData}
            saveState={isSaved}
            onSaveToggle={openFolderModal}
            onStockInquiry={openStockInquiryModal}
            detailLoading={detailLoading}
          />

          {/* 의료 정보 면책 조항 */}
          <View style={styles.disclaimerWrapper}>
            <BaseText weight="semiBold" size={13} style={styles.disclaimerText}>
              본 앱의 정보는 참고용이며, 정확한 의학적 진단 및 치료를 대신할 수
              없습니다. 의약품 복용 시 반드시 의사나 약사와 상담하십시오.
            </BaseText>
          </View>
        </View>
      </ScrollView>

      <FolderSelectModal
        isVisible={isFolderModalVisible}
        onClose={closeFolderModal}
        itemSeq={pillData.ITEM_SEQ}
        itemName={pillData.ITEM_NAME}
        initialSelectedIds={savedFolderIds}
        onSaveComplete={handleSaveComplete}
      />
    </>
  );
};

export default PillSearchResultDetailScreen;
