import { View, Text, TextInput, StyleSheet, ColorValue } from "react-native"
import { font, os } from "@/style/font"

const SearchIdInput = ({
  label,
  textInputs,
  errorLabel,
  errorState
}: {
  label?: string,
  textInputs: {
    placeholder?: string,
    placeholderTextColor?: ColorValue,
    onChangeText: (val: string) => void,
    value?: string
  }[],
  errorLabel?: string,
  errorState: boolean
}): JSX.Element => {
  return (
    <View style={styles.sectionTextInputWrapper}>
      <Text style={styles.sectionTextInputLabel}>{label}</Text>
      <View style={styles.sectionTextInputSplitWrapper}>
        {textInputs.map((textInput) =>
          <TextInput
            key={textInput.placeholder}
            placeholder={textInput.placeholder}
            placeholderTextColor={textInput.placeholderTextColor}
            onChangeText={textInput.onChangeText}
            value={textInput.value}
            autoCapitalize="none"
            maxLength={10}
            autoComplete="off"
            inputMode="text"
            style={[styles.sectionTextInput, errorState && styles.error]}
          />)}
      </View>
      <View style={styles.sectionErrorWrapper}>
        {errorState ? <Text style={styles.sectionTextInputError}>{errorLabel}</Text> : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionTextInputWrapper: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTextInputLabel: {
    paddingLeft: 4,
    paddingBottom: 4,
    fontSize: font(14),
    fontFamily: os.font(600, 700),
    color: "#7472EB",
    includeFontPadding: false
  },
  sectionTextInputSplitWrapper: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    width: '100%',
  },
  sectionTextInput: {
    flex: 1,
    paddingVertical: 8,
    paddingStart: 16,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#858585',
    fontSize: font(16),
    fontFamily: os.font(700, 800),
    includeFontPadding: false,
    maxHeight: font(16 * 3),
    color: "#000",
    backgroundColor: '#fff'
  },
  sectionErrorWrapper: {
    minHeight: 21
  },
  sectionTextInputError: {
    alignSelf: 'flex-end',
    paddingRight: 4,
    fontSize: font(13),
    fontFamily: os.font(600, 700),
    color: "#f00",
    includeFontPadding: false
  },
  error: {
    borderColor: '#f00'
  },
})

export default SearchIdInput