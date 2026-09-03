import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { IInputProps } from '@features/pill_identification_search/types';
import { styles } from '../../styles/atoms/Input';

// 식별 검색 텍스트 인풋 컴포넌트 (Atom)
export const Input = ({
  placeholder = '',
  value: initialValue = '',
  width,
  height,
  inputChangeHandler,
}: IInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(initialValue);

  // 외부(store)에서 값이 바뀌면 로컬 상태와 동기화
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  // 포커스 아웃 핸들러
  const handleBlur = () => {
    setIsFocused(false);
  };

  // 엔터 입력 완료 핸들러
  const handleSubmit = () => {
    inputChangeHandler(localValue);
  };

  return (
    <View
      style={[
        styles.inputWrapper,
        { width: width, height: height },
        isFocused && {
          borderColor: COLOR['primary'],
          backgroundColor: '#FFFFFF',
        },
      ]}
    >
      <TextInput
        maxLength={50}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLOR_TEXT['disabled']}
        onChangeText={(text) => {
          setLocalValue(text);
          inputChangeHandler(text);
        }}
        value={localValue}
        autoCorrect={false}
        spellCheck={false}
        autoCapitalize="none"
      />
    </View>
  );
};
