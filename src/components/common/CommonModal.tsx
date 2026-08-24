import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { styles } from './styles/CommonModal';
import { BaseText } from './BaseText';
import { useCommonModalStore } from '@store/common_modal_store';
import BaseModal from './BaseModal';

interface IModalButtonProps {
  style: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  text?: string;
  onPress: () => void;
}

// 반복되는 모달 버튼 UI를 분리한 전용 컴포넌트
const ModalButton = ({
  style,
  textStyle,
  text,
  onPress,
}: IModalButtonProps) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <BaseText weight={'semiBold'} size={15} style={textStyle}>
      {text}
    </BaseText>
  </TouchableOpacity>
);

// 앱 전역에서 띄울 수 있는 공통 모달 컴포넌트
const CommonModal = () => {
  const { isVisible, options, hideModal } = useCommonModalStore();

  // 취소 버튼 클릭 및 안드로이드 뒤로가기 시 실행되는 핸들러
  const handleCancel = () => {
    const { onCancel } = options;
    hideModal(); // 모달을 먼저 닫아 상태를 초기화

    if (!onCancel) {
      return;
    }

    onCancel(); // 이후 전달받은 콜백 실행
  };

  // 배경 터치 시 실행되는 핸들러
  const handleBackdropPress = () => {
    if (options.onBackdropPress) {
      options.onBackdropPress();
    }
    // 기본적으로 배경 터치 시 모달을 닫으려면 아래 주석 해제 (기획에 따라 다름)
    // hideModal();
  };

  // 확인 버튼 클릭 시 실행되는 핸들러
  const handleConfirm = () => {
    const { onConfirm } = options;
    hideModal(); // 모달을 먼저 닫아 상태를 초기화

    if (!onConfirm) {
      return;
    }

    onConfirm(); // 이후 전달받은 콜백 실행
  };

  return (
    <BaseModal
      visible={isVisible}
      onBackPress={handleCancel}
      onBackdropPress={handleBackdropPress}
      overlayStyle={options.overlayStyle}
      contentStyle={options.contentStyle}
    >
      {/* 제목이 있을 경우에만 렌더링 */}
      {!!options.title && (
        <BaseText
          weight={'bold'}
          size={18}
          style={[styles.title, options.titleStyle]}
        >
          {options.title}
        </BaseText>
      )}

      {/* 모달 본문 메시지 (텍스트 혹은 React Node) */}
      {typeof options.message === 'string' ? (
        <BaseText
          weight={'regular'}
          size={15}
          style={[styles.message, options.messageStyle]}
        >
          {options.message}
        </BaseText>
      ) : (
        options.message // 커스텀 컴포넌트인 경우 그대로 렌더링
      )}

      <View style={styles.buttonContainer}>
        {/* hideCancel 옵션이 없을 때만 취소 버튼 렌더링 */}
        {!options.hideCancel && (
          <ModalButton
            style={[styles.cancelButton, options.cancelButtonStyle]}
            textStyle={[styles.cancelButtonText, options.cancelButtonTextStyle]}
            text={options.cancelText}
            onPress={handleCancel}
          />
        )}
        {/* 확인 버튼 (스타일 분기 처리 포함) */}
        <ModalButton
          style={[
            options.confirmStyle === 'destructive'
              ? styles.destructiveButton
              : styles.confirmButton,
            options.confirmButtonStyle,
          ]}
          textStyle={[styles.confirmButtonText, options.confirmButtonTextStyle]}
          text={options.confirmText}
          onPress={handleConfirm}
        />
      </View>
    </BaseModal>
  );
};

export default CommonModal;
