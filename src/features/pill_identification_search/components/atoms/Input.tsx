import { View, TextInput, DimensionValue } from 'react-native';
import { useState, useEffect } from 'react';
import { COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { styles } from '../../styles/atoms/Input';

interface IInputProps {
  placeholder?: string;
  value: string;
  width: DimensionValue;
  height: DimensionValue;
  inputChangeHandler: (text: string) => void;
}

export const Input = ({
  placeholder = '',
  value: initialValue,
  width,
  height,
  inputChangeHandler,
}: IInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(initialValue);

  // 외부(store)에서 값이 바뀌면 로컬 상태와 동기화 (예: 초기화 시)
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSubmit = () => {
    // 키보드 엔터를 눌렀을 때도 업데이트 (이미 onChangeText에서 하고 있지만 명시적 유지)
    inputChangeHandler(localValue);
  };

  return (
    <View
      style={[
        styles.inputWrapper,
        { width: width, height: height },
        isFocused && { borderColor: COLOR_PRIMARY[100] },
      ]}
    >
      <TextInput
        maxLength={50}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLOR_GRAY[200]}
        onChangeText={(text) => {
          setLocalValue(text);
          inputChangeHandler(text);
        }}
        value={localValue}
      />
    </View>
  );
};
