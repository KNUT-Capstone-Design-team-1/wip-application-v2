import { memo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { COLOR, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';

interface IUnderlineInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  maxLength?: number;
  // 하단 밑줄 표시 여부 (마지막 입력은 false로 두어 밑줄 제거)
  showUnderline?: boolean;
}

/**
 * 밑줄(underline) 스타일 검색 입력 (title 없이 입력만)
 * - 식별 검색 입력과 동일한 "값/변경/제출을 props로 받는" controlled 방식
 * - 박스가 아닌 하단 보더만 그려 가벼운 느낌 (ai/img.png 참고)
 */
const UnderlineInput = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = '검색어 입력',
  maxLength = 50,
  showUnderline = true,
}: IUnderlineInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  // 평소엔 showUnderline에 따라 밑줄을 그리고, 포커스 시엔 항상 primary 밑줄로 표시
  return (
    <View
      style={[
        styles.wrapper,
        (showUnderline || isFocused) && styles.underline,
        isFocused && styles.underlineFocused,
      ]}
    >
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={COLOR_TEXT.disabled}
        returnKeyType="search"
        maxLength={maxLength}
        multiline={false}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: px(34),
    justifyContent: 'center',
  },
  underline: {
    borderBottomWidth: px(1),
    borderBottomColor: COLOR_LINE.border,
  },
  underlineFocused: {
    borderBottomColor: COLOR.primary,
  },
  input: {
    fontFamily: 'Pretendard',
    fontSize: fontPx(14),
    fontWeight: '500',
    color: COLOR_TEXT.title,
    includeFontPadding: false,
    paddingVertical: 0,
  },
});

export default memo(UnderlineInput);
