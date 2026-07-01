import React from 'react';
import { Image } from '@components/common/CustomImage';
import { View, Text } from 'react-native';
import { px, fontPx } from '@utils/responsive';

// Base64 문자열 탐지용 정규식 (예: {data:image/png;base64,...})
const base64Regex = /^data:image\/[a-zA-Z]+;base64,/;

const RenderNoticeContent = ({ contents }: { contents: string }) => {
  // 1. 개행 문자 기준으로 줄 단위로 나눈 후
  // 2. 각 줄 안에서 base64 여부 판단
  const lines = contents.split(/\n|\\n/);

  return (
    <View style={{ flexDirection: 'column', gap: px(8) }}>
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          // 빈 줄이면 단순 개행
          return <Text key={index}>{'\n'}</Text>;
        }

        // base64 문자열인지 확인
        if (base64Regex.test(trimmed)) {
          const imgSrc = trimmed.replace(/[{}]/g, '');
          return (
            <Image
              key={index}
              source={{ uri: imgSrc }}
              style={{
                width: px(200),
                height: px(200),
                borderRadius: px(8),
                alignSelf: 'center',
              }}
              contentFit="cover"
            />
          );
        }

        // 일반 텍스트일 경우
        return (
          <Text
            key={index}
            style={{
              fontSize: fontPx(16),
              lineHeight: px(22),
              fontFamily: 'Paperlogy',
              fontWeight: 500,
            }}
          >
            {trimmed}
          </Text>
        );
      })}
    </View>
  );
};

export default RenderNoticeContent;
