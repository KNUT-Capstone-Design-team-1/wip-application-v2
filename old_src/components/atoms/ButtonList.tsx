// ButtonList.tsx
import React from 'react';
import Button from '@components/atoms/Button';
import { Text, View, StyleSheet } from 'react-native';
import { TMarkData } from '@/types/TApiType';

const ButtonList = ({
  buttonClickHandler,
  markData,
}: {
  buttonClickHandler: () => void;
  markData: TMarkData[];
}) => {
  return (
    <View style={styles.marks}>
      {markData.map((data: TMarkData, index: number) => (
        <Button.imgInButton
          style={styles.mark}
          key={index}
          onPress={buttonClickHandler}
          src={data.base64}
        >
          <Text style={{ display: 'none' }}>{data.code}</Text>
        </Button.imgInButton>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  marks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    padding: 5,
    borderWidth: 1,
  },
});

export default ButtonList;
