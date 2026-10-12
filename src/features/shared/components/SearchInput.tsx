import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { CircleX, Search } from 'lucide-react-native';
import { COLOR, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { fontPx, px } from '@utils/responsive';

interface ISearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  maxLength?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * 앱 공용 검색 입력 컴포넌트 (프레젠테이셔널 / controlled)
 * - 값/변경/제출을 전부 props로 받는다. 검색 로직은 사용하는 쪽이 소유한다.
 * - 통합검색 헤더(UnifiedSearchBar)와 영양제 검색 등에서 공용으로 사용.
 */
const SearchInput = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = '검색어를 입력하세요',
  autoFocus = false,
  maxLength = 50,
  containerStyle,
}: ISearchInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = useCallback(() => {
    onChangeText('');
  }, [onChangeText]);

  const handleSubmit = useCallback(() => {
    Keyboard.dismiss();
    onSubmit();
  }, [onSubmit]);

  // 키보드가 내려가면 포커스 해제 (테두리 상태 동기화)
  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current?.blur();
      setIsFocused(false);
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        { borderColor: isFocused ? COLOR.primary : COLOR_LINE.border },
        containerStyle,
      ]}
    >
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmit}
        placeholder={placeholder}
        placeholderTextColor={COLOR_TEXT.disabled}
        returnKeyType="search"
        maxLength={maxLength}
        multiline={false}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value.length > 0 ? (
        <TouchableOpacity onPress={handleClear} style={styles.rightButton}>
          <CircleX
            size={fontPx(16)}
            color={COLOR_TEXT.sub}
            strokeWidth={px(2)}
          />
        </TouchableOpacity>
      ) : (
        <Search size={fontPx(16)} color={COLOR_TEXT.sub} strokeWidth={px(2)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.white,
    borderRadius: px(16),
    paddingHorizontal: px(16),
    height: px(34),
    borderWidth: px(1),
    // 그림자 (iOS)
    shadowColor: COLOR.shadow,
    shadowOffset: { width: 0, height: px(1) },
    shadowOpacity: 0.1,
    shadowRadius: px(2),
    // 그림자 (Android)
    elevation: px(2),
  },
  input: {
    flex: 1,
    fontSize: fontPx(14),
    lineHeight: fontPx(18),
    includeFontPadding: false,
    paddingVertical: 0,
    fontFamily: 'Pretendard',
    fontWeight: '500',
    color: COLOR_TEXT.title,
  },
  rightButton: {
    paddingVertical: px(5),
    paddingLeft: px(8),
  },
});

export default memo(SearchInput);
