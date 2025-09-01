import { memo } from 'react';
import { toastConfig } from '@/constants/toast';
import { font, os } from '@/style/font';
import {
  Modal,
  StyleSheet,
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Fragment } from 'react/jsx-runtime';
import CustomCheckbox from '../atoms/CustomCheckbox';
import { CustomAlertProps } from '@/types/organisms/type';

const CustomAlertComponent = ({
  visible,
  onRequestClose,
  title,
  message,
  buttons,
  modalType = 'default',
  checkboxLabel,
  onCheckboxChange,
}: CustomAlertProps): React.JSX.Element => {
  const handleCheckboxChange = (isChecked: boolean) => {
    if (onCheckboxChange) {
      onCheckboxChange(isChecked);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.backgroundViewWrapper}>
        <View style={styles.modalViewWrapper}>
          <Text style={styles.modalTitleText}>{title}</Text>
          <View style={styles.rowLine} />
          <Text style={styles.modalMessageText}>{message}</Text>
          {buttons && (
            <View style={styles.bottomButtonsWrapper}>
              {buttons.map((button: TCustomAlertButtons, idx) => {
                return (
                  <Fragment key={idx}>
                    {idx > 0 ? <View style={styles.colLine} /> : null}
                    <TouchableOpacity
                      style={[styles.bottomButton, button.style]}
                      onPress={button.onPress}
                    >
                      <Text style={styles.buttonText}>{button.text}</Text>
                    </TouchableOpacity>
                  </Fragment>
                );
              })}
            </View>
          )}
        </View>
        <View style={styles.modalCheckboxWrapper}>
          {modalType === 'checkbox' && (
            <CustomCheckbox
              size={18}
              fillColor="#7472EB"
              boxStyle={{ borderWidth: 2, borderColor: '#000' }}
              text={checkboxLabel}
              textStyle={{ fontSize: font(16), color: '#000' }}
              onPress={(isChecked) => handleCheckboxChange(isChecked)}
            />
          )}
        </View>
      </View>
      <Toast config={toastConfig} position="bottom" bottomOffset={130} />
    </Modal>
  );
};

const CustomAlert = memo(CustomAlertComponent);

const styles = StyleSheet.create({
  backgroundViewWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
  },
  bottomButton: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  bottomButtonsWrapper: {
    alignSelf: 'flex-end',
    borderTopColor: '#7472EB',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#000',
    fontFamily: os.font(500, 500),
    fontSize: font(16),
  },
  colLine: { backgroundColor: '#7472EB', height: '100%', width: 1 },
  modalCheckboxWrapper: { alignItems: 'flex-start', width: '90%' },
  modalMessageText: {
    color: '#000',
    fontFamily: os.font(600, 700),
    fontSize: font(16),
    includeFontPadding: false,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  modalTitleText: {
    color: '#000',
    fontFamily: os.font(700, 800),
    fontSize: font(18),
    includeFontPadding: false,
    marginTop: 16,
  },
  modalViewWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: '80%',
    maxWidth: '90%',
    minHeight: '10%',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.4 },
      android: { elevation: 5 },
    }),
  },
  rowLine: {
    backgroundColor: '#7472EB',
    height: 4,
    marginBottom: 4,
    marginTop: 4,
    width: '100%',
  },
});

export default CustomAlert;
