import React from 'react';
import { Image } from '@components/common/CustomImage';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../styles/RenderNoticeContent';

// Base64 문자열 탐지용 정규식 (예: {data:image/png;base64,...})
const base64Regex = /^data:image\/[a-zA-Z]+;base64,/;

const RenderNoticeContent = ({ contents }: { contents: string }) => {
  // 1. 개행 문자 기준으로 줄 단위로 나눈 후
  // 2. 각 줄 안에서 base64 여부 판단
  const lines = contents.split(/\n|\\n/);

  return (
    <View style={styles.container}>
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          // 빈 줄이면 단순 개행
          return (
            <BaseText size={16} weight="medium" key={index}>
              {'\n'}
            </BaseText>
          );
        }

        // base64 문자열인지 확인
        if (base64Regex.test(trimmed)) {
          const imgSrc = trimmed.replace(/[{}]/g, '');
          return (
            <Image
              key={index}
              source={{ uri: imgSrc }}
              style={styles.image}
              contentFit="cover"
            />
          );
        }

        // 일반 텍스트일 경우
        return (
          <BaseText key={index} size={16} weight="medium" style={styles.text}>
            {trimmed}
          </BaseText>
        );
      })}
    </View>
  );
};

export default RenderNoticeContent;
