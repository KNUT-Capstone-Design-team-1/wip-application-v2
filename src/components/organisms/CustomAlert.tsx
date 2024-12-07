import { toastConfig } from "@/constants/toast";
import { font, os } from "@/style/font";
import { Modal, StyleSheet, Platform, View, Text, TouchableOpacity, StyleProp, ViewStyle, GestureResponderEvent } from "react-native";
import Toast from "react-native-toast-message";
import { Fragment } from "react/jsx-runtime";

type CustomAlertButtons = {
  text: string
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  style?: StyleProp<ViewStyle>
}

type CustomAlertProps = {
  visible: boolean
  onRequestClose: (() => void) | undefined
  title: string
  message: string
  buttons?: CustomAlertButtons[]
}

const CustomAlert = ({ ...props }: CustomAlertProps): JSX.Element => {
  const styles = StyleSheet.create({
    backgroundViewWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalViewWrapper: {
      maxWidth: '90%',
      minHeight: '10%',
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

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={props.onRequestClose}
    >
      <View style={styles.backgroundViewWrapper}>

        <View style={styles.modalViewWrapper}>
          <Text style={styles.modalTitleText}>{props.title}</Text>
          <View style={styles.rowLine} />
          <Text style={styles.modalMessageText}>{props.message}</Text>
          {
            (props.buttons == null) ? null
              : <View style={styles.bottomButtonsWrapper}>
                {
                  props.buttons.map((button: CustomAlertButtons, idx) => {
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
              </View>
          }
        </View>
      </View>
      <Toast
        config={toastConfig}
        position='bottom'
        bottomOffset={130}
      />
    </Modal>
  )
}

export default CustomAlert