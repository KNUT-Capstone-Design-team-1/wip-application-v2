import React from "react";
import { toastConfig } from "@/constants/toast";
import { font, os } from "@/style/font";
import { Modal, StyleSheet, Platform, View, Text, TouchableOpacity, StyleProp, ViewStyle, GestureResponderEvent } from "react-native";
import Toast from "react-native-toast-message";
import { Fragment } from "react/jsx-runtime";
import CustomCheckbox from "../atoms/CustomCheckbox";

//TODO: 제목 가로선이 사라지는 문제 확인
export type TCustomAlertButtons = {
  text: string
  onPress?: ((event?: GestureResponderEvent) => void) | undefined;
  style?: StyleProp<ViewStyle>
}

export type TCustomModalType = 'default' | 'exit' | 'checkbox'

type CustomAlertProps = {
  visible: boolean
  onRequestClose: (() => void) | undefined
  title: string
  message: string
  buttons?: TCustomAlertButtons[],
  modalType?: TCustomModalType,
  checkboxLabel?: string,
  onCheckboxChange?: (isChecked: boolean) => void,
}

const CustomAlert = React.memo(
  ({
    visible,
    onRequestClose,
    title,
    message,
    buttons,
    modalType = 'default',
    checkboxLabel,
    onCheckboxChange
  }: CustomAlertProps): JSX.Element => {

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
            {
              buttons && (<View style={styles.bottomButtonsWrapper}>
                {
                  buttons.map((button: TCustomAlertButtons, idx) => {
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
                    )
                  })
                }
              </View>)
            }
          </View>
          <View style={styles.modalCheckboxWrapper}>
            {modalType == 'checkbox' && <CustomCheckbox
              size={18}
              fillColor="#7472EB"
              boxStyle={{ borderWidth: 2, borderColor: '#000' }}
              text={checkboxLabel}
              textStyle={{ fontSize: font(16), color: '#000' }}
              onPress={(isChecked) => handleCheckboxChange(isChecked)}
            />}
          </View>
        </View>
        <Toast
          config={toastConfig}
          position='bottom'
          bottomOffset={130}
        />
      </Modal>
    )
  })

const styles = StyleSheet.create({
  backgroundViewWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  modalViewWrapper: {
    maxWidth: '90%',
    minHeight: '10%',
    maxHeight: '80%',
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.4,
      },
      android: {
        elevation: 5,
      },
    })
  },
  modalCheckboxWrapper: {
    width: '90%',
    alignItems: 'flex-start'
  },
  modalTitleText: {
    fontSize: font(18),
    fontFamily: os.font(700, 800),
    color: "#000",
    marginTop: 16,
    includeFontPadding: false
  },
  modalMessageText: {
    fontSize: font(16),
    fontFamily: os.font(600, 700),
    color: "#000",
    includeFontPadding: false,
    paddingHorizontal: 16,
    textAlign: 'center'
  },
  bottomButtonsWrapper: {
    width: '100%',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 16,
    borderTopColor: '#7472EB',
    borderTopWidth: 1,
  },
  bottomButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  buttonText: {
    fontSize: font(16),
    fontFamily: os.font(500, 500),
    color: '#000'
  },
  rowLine: {
    width: '100%',
    height: 4,
    backgroundColor: '#7472EB',
    marginTop: 4,
    marginBottom: 4
  },
  colLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#7472EB',
  }
})

export default CustomAlert