import React, { memo, useState, useMemo, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { IPharmacyInfoCardProps } from '@features/nearby_pharmacy/types/pharmacy_ui_type';
import { X } from 'lucide-react-native';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { usePharmacyCall } from '@features/nearby_pharmacy/hooks/use_pharmacy_call';
import PharmacyInfoRow from '@features/nearby_pharmacy/components/atoms/PharmacyInfoRow';
import StockInquiryCallButton from '@features/nearby_pharmacy/components/atoms/StockInquiryCallButton';
import PharmacyHoursHeaderRow from '@features/nearby_pharmacy/components/atoms/PharmacyHoursHeaderRow';
import PharmacyExpandedHoursList from '@features/nearby_pharmacy/components/atoms/PharmacyExpandedHoursList';
import { BaseText } from '@components/common/BaseText';
import { getFormattedDistance } from '@utils/location';
import {
  getTodayBusinessHourSummary,
  parsePharmacyBusinessHours,
  isPharmacyOpenNow,
} from '@features/nearby_pharmacy/utils/business_hours';
import { usePharmacyCurrentTime } from '@features/nearby_pharmacy/hooks/use_pharmacy_current_time';
import { styles } from '@features/nearby_pharmacy/styles/PharmacyInfoCard';

// 지도에서 단일 약국 마커를 선택했을 때 하단에 나타나는 상세 정보 카드
const PharmacyInfoCard = ({
  pharmacy,
  onCopyPress,
  onClosePress,
  onStockInquiryPress,
}: IPharmacyInfoCardProps) => {
  const { callPharmacy } = usePharmacyCall();

  // 영업시간 리스트 확장(펼침) 상태
  const [isExpanded, setIsExpanded] = useState(false);

  // 선택된 약국 변경 시 펼침 상태 초기화
  useEffect(() => {
    setIsExpanded(false);
  }, [pharmacy.id]);

  // 전화 걸기 핸들러
  const handlePhonePress = () => {
    if (onStockInquiryPress) {
      onStockInquiryPress(pharmacy.telephone);
      return;
    }

    callPharmacy(pharmacy.telephone);
  };

  // 영업시간 확장/축소 토글 핸들러
  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  // 약국명 복사 핸들러
  const handleCopyName = () => {
    onCopyPress(pharmacy.name);
  };

  // 약국 주소 복사 핸들러
  const handleCopyAddress = () => {
    onCopyPress(pharmacy.address);
  };

  // 거리 텍스트 계산
  const distanceText = useMemo(() => {
    if (typeof pharmacy.distance !== 'number') {
      return '';
    }

    return getFormattedDistance(pharmacy.distance);
  }, [pharmacy.distance]);

  // 1분 단위 및 포커스 복귀 시 갱신되는 현재 시각 구독
  const currentTime = usePharmacyCurrentTime();

  // 오늘 요일 영업시간 요약 정보 계산
  const todayHours = useMemo(
    () =>
      getTodayBusinessHourSummary(
        pharmacy.openTime,
        pharmacy.closeTime,
        currentTime,
      ),
    [pharmacy.openTime, pharmacy.closeTime, currentTime],
  );

  // 전체 요일(월~공휴일) 영업시간 목록 계산
  const businessHours = useMemo(
    () =>
      parsePharmacyBusinessHours(
        pharmacy.openTime,
        pharmacy.closeTime,
        currentTime,
      ),
    [pharmacy.openTime, pharmacy.closeTime, currentTime],
  );

  // 현재 시각 기준 영업 중 여부 계산 (시간 경과 시 실시간 재계산)
  const isOpen = useMemo(
    () => isPharmacyOpenNow(pharmacy.openTime, pharmacy.closeTime, currentTime),
    [pharmacy.openTime, pharmacy.closeTime, currentTime],
  );

  const hasTelephone = Boolean(pharmacy.telephone);
  const showStockInquiryBtn = Boolean(onStockInquiryPress) && hasTelephone;

  return (
    <View style={styles.infoContainer}>
      {/* 카드 상단 헤더: 약국명 & 거리 & 우측 상단 영업 상태 및 닫기 버튼 */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.nameContainer}
          onPress={handleCopyName}
          activeOpacity={0.7}
        >
          <BaseText
            weight="bold"
            size={18}
            style={styles.pharmacyName}
            numberOfLines={1}
          >
            {pharmacy.name}
          </BaseText>
          {!!distanceText && (
            <BaseText weight="medium" size={13} style={styles.pharmacyDistance}>
              {distanceText}
            </BaseText>
          )}
        </TouchableOpacity>

        {/* 우측 상단: 영업 상태 뱃지 & 닫기 버튼 */}
        <View style={styles.headerRightArea}>
          <BaseText
            weight="bold"
            size={13}
            style={[
              styles.pharmacyStatus,
              isOpen ? styles.statusOpen : styles.statusClosed,
            ]}
          >
            {isOpen ? '영업 중' : '영업 종료'}
          </BaseText>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClosePress}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={fontPx(16)} color={COLOR_TEXT.sub} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 카드 본문: 전화번호, 주소, 영업시간 */}
      <ScrollView
        contentContainerStyle={styles.infoContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* 전화번호 정보 행 */}
        <PharmacyInfoRow
          text={pharmacy.telephone || '전화번호 없음'}
          onPress={handlePhonePress}
          disabled={!hasTelephone}
          weight="medium"
          size={14}
          textStyle={[
            styles.pharmacyPhone,
            !hasTelephone && styles.pharmacyPhoneDisabled,
          ]}
        />

        {/* 주소 정보 행 */}
        <PharmacyInfoRow
          text={pharmacy.address}
          onPress={handleCopyAddress}
          disabled={!pharmacy.address}
          weight="semiBold"
          size={14}
          textStyle={styles.pharmacyAddress}
        />

        {/* 영업시간 요약 표시 및 펼치기/접기 토글 행 */}
        <PharmacyHoursHeaderRow
          label={todayHours.label}
          text={todayHours.text}
          isExpanded={isExpanded}
          onToggle={handleToggleExpand}
        />

        {/* 확장 시 나타나는 월~공휴일 전체 영업시간 리스트 및 출처 */}
        {isExpanded && (
          <PharmacyExpandedHoursList businessHours={businessHours} />
        )}

        {/* 재고 문의 모드 버튼 */}
        {showStockInquiryBtn && (
          <StockInquiryCallButton
            onPress={() => onStockInquiryPress?.(pharmacy.telephone)}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default memo(PharmacyInfoCard);
