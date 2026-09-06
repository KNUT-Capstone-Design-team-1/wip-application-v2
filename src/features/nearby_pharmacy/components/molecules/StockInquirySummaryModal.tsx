import React, { memo } from 'react';
import { View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { Image } from '@components/common/CustomImage';
import { Phone, Copy, X } from 'lucide-react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { INearbyPharmacies } from '@services/database/types';
import { IStockInquiryPillContext } from '@features/nearby_pharmacy/hooks/use_stock_inquiry';
import { pharmacyActionService } from '@features/nearby_pharmacy/services/pharmacy_action_service';
import { useToast } from '@hooks/use_toast';
import { styles } from '@features/nearby_pharmacy/styles/StockInquirySummaryModal';

interface IStockInquirySummaryModalProps {
  isVisible: boolean;
  pharmacy: INearbyPharmacies | null;
  pillContext: IStockInquiryPillContext;
  onClose: () => void;
  onCall: (telephone: string) => void;
}

// 재고 문의 시 약 정보 요약 및 추천 멘트, 원터치 전화 걸기를 제공하는 모달 (Presentation Layer)
const StockInquirySummaryModal = ({
  isVisible,
  pharmacy,
  pillContext,
  onClose,
  onCall,
}: IStockInquirySummaryModalProps) => {
  const { showToast } = useToast();

  if (!isVisible || !pharmacy) {
    return null;
  }

  const script = pharmacyActionService.generateInquiryScript(
    pillContext.name || '',
    pillContext.className,
  );

  const handleCopyScript = async () => {
    const success = await pharmacyActionService.copyText(script);
    if (success) {
      showToast({ type: 'default', message: '문의 멘트가 복사되었습니다.' });
    }
  };

  const handleCall = () => {
    if (pharmacy.telephone) {
      onCall(pharmacy.telephone);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* 상단 헤더 */}
          <View style={styles.header}>
            <BaseText weight="bold" size={17} style={styles.headerTitle}>
              약국 재고 문의 안내
            </BaseText>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={fontPx(20)} color={COLOR_TEXT.sub} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 1. 대상 약국 요약 */}
            <View style={styles.sectionContainer}>
              <BaseText weight="semiBold" size={13} style={styles.sectionLabel}>
                문의 대상 약국
              </BaseText>
              <BaseText weight="bold" size={16} style={styles.pharmacyName}>
                {pharmacy.name}
              </BaseText>
              <BaseText weight="medium" size={13} style={styles.pharmacySub}>
                {pharmacy.telephone || '전화번호 정보 없음'}
              </BaseText>
            </View>

            {/* 2. 약 정보 요약 카드 */}
            {pillContext.name ? (
              <View style={styles.pillCard}>
                {pillContext.image ? (
                  <Image
                    source={{ uri: pillContext.image }}
                    style={styles.pillImage}
                    contentFit="contain"
                  />
                ) : null}
                <View style={styles.pillInfo}>
                  <BaseText weight="bold" size={15} style={styles.pillName}>
                    {pillContext.name}
                  </BaseText>
                  {(pillContext.entpName || pillContext.className) && (
                    <BaseText weight="medium" size={12} style={styles.pillMeta}>
                      {[pillContext.entpName, pillContext.className]
                        .filter(Boolean)
                        .join(' | ')}
                    </BaseText>
                  )}
                </View>
              </View>
            ) : null}

            {/* 3. 추천 문의 멘트 */}
            <View style={styles.scriptContainer}>
              <View style={styles.scriptHeader}>
                <BaseText
                  weight="semiBold"
                  size={13}
                  style={styles.sectionLabel}
                >
                  추천 문의 멘트
                </BaseText>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={handleCopyScript}
                >
                  <Copy
                    size={fontPx(13)}
                    color={COLOR.primary}
                    strokeWidth={2}
                  />
                  <BaseText
                    weight="semiBold"
                    size={12}
                    style={styles.copyBtnText}
                  >
                    복사
                  </BaseText>
                </TouchableOpacity>
              </View>
              <View style={styles.scriptBox}>
                <BaseText weight="medium" size={13} style={styles.scriptText}>
                  {script}
                </BaseText>
              </View>
            </View>
          </ScrollView>

          {/* 하단 전화 걸기 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.callButton,
                !pharmacy.telephone && styles.callButtonDisabled,
              ]}
              disabled={!pharmacy.telephone}
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <Phone
                size={fontPx(18)}
                color={COLOR_TEXT.white}
                strokeWidth={2.2}
              />
              <BaseText weight="bold" size={15} style={styles.callButtonText}>
                {pharmacy.telephone ? '약국에 바로 전화 걸기' : '전화번호 없음'}
              </BaseText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(StockInquirySummaryModal);
