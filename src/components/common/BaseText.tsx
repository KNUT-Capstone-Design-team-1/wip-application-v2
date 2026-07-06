import { fontPx } from '@utils/responsive';
import { Text, TextProps, TextStyle } from 'react-native';

type TBaseTextWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

interface IBaseTextProps extends TextProps {
  fontFamily?: string;
  weight?: TBaseTextWeight;
  size?: number;
  children?: React.ReactNode;
}

const WEIGHT_MAP: Record<TBaseTextWeight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

/**
 * 가장 기본적인 텍스트 컴포넌트
 * @param fontFamily - 폰트 패밀리 (기본값: 'Pretendard')
 * @param weight - 폰트 두께 (기본값: 'medium')
 * @param size - 폰트 크기 (기본값: px(12))
 * @param style - 스타일 (기본값: undefined)
 * @param children - 텍스트 내용 (기본값: undefined)
 * @param props - Text 컴포넌트의 props
 * @returns
 */
export const BaseText: React.FC<IBaseTextProps> = ({
  fontFamily = 'Pretendard',
  weight = 'medium',
  size = 12,
  style,
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        {
          fontFamily: fontFamily,
          fontWeight: WEIGHT_MAP[weight],
          fontSize: fontPx(size),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
