import { View, Text, TextInput, StyleSheet, ColorValue } from 'react-native';
import { font, os } from '@/style/font';

const SearchIdInput = ({
  label,
  textInputs,
  errorLabel,
  errorState,
}: {
  label?: string;
  textInputs: {
    placeholder?: string;
    placeholderTextColor?: ColorValue;
    onChangeText: (val: string) => void;
    value?: string;
  }[];
  errorLabel?: string;
  errorState: boolean;
}): JSX.Element => {
  return (
    <View style={styles.sectionTextInputWrapper}>
      <Text style={styles.sectionTextInputLabel}>{label}</Text>
      <View style={styles.sectionTextInputSplitWrapper}>
        {textInputs.map((textInput) => (
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
          />
        ))}
      </View>
      <View style={styles.sectionErrorWrapper}>
        {errorState ? (
          <Text style={styles.sectionTextInputError}>{errorLabel}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  error: { borderColor: '#f00' },
  sectionErrorWrapper: { minHeight: 21 },
  sectionTextInput: {
    backgroundColor: '#fff',
    borderColor: '#444',
    borderRadius: 8,
    borderWidth: 2,
    color: '#444',
    flex: 1,
    fontFamily: os.font(700, 800),
    fontSize: font(16),
    includeFontPadding: false,
    maxHeight: font(16 * 3),
    paddingStart: 16,
    paddingVertical: 8,
  },
  sectionTextInputError: {
    alignSelf: 'flex-end',
    color: '#f00',
    fontFamily: os.font(600, 700),
    fontSize: font(13),
    includeFontPadding: false,
    paddingRight: 4,
  },
  sectionTextInputLabel: {
    color: '#4D4DAD',
    fontFamily: os.font(600, 700),
    fontSize: font(14),
    includeFontPadding: false,
    paddingBottom: 4,
    paddingLeft: 4,
  },
  sectionTextInputSplitWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  sectionTextInputWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    width: '100%',
  },
});

export default SearchIdInput;
