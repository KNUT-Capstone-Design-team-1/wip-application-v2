import { View, TextInput } from 'react-native';
import { InputEvent, useState } from 'react';
import { COLOR_PRIMARY } from '@constants/color';
import { styles } from '../../styles/atoms/Input';

interface IInputProps {
  placeholder: string;
  value: string;
  width: string;
  height: string;
  inputChangeHandler: (event: InputEvent) => void;
}

export const Input = ({
  placeholder,
  value,
  width,
  height,
  inputChangeHandler,
}: IInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.inputWrapper,
        { width: width, height: height },
        isFocused && { borderColor: COLOR_PRIMARY[100] },
      ]}
    >
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.input}
        placeholder={placeholder}
        onChangeText={(text) =>
          inputChangeHandler({ nativeEvent: { text } } as any)
        }
        value={value}
      />
    </View>
  );
};
