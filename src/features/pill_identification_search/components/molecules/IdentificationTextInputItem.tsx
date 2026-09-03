import React, { memo } from 'react';
import { View } from 'react-native';
import { Input } from '../atoms/Input';
import { useSearchIdStore } from '../../store/search_id_store';
import { IIdentificationTextInputItemProps } from '@features/pill_identification_search/types';
import { styles } from '../../styles/molecules/IdentificationTextInputItem';

// 개별 Input 필드를 위한 래퍼 컴포넌트 (스토어 구독 최적화)
const IdentificationTextInputItem = memo(
  ({
    placeholder,
    storeKey,
    inputKey,
    searchIdInputChangeHandler,
  }: IIdentificationTextInputItemProps) => {
    const value = useSearchIdStore((state) => state[storeKey] as string);

    return (
      <View style={styles.flex1}>
        <Input
          placeholder={placeholder}
          value={value}
          width="100%"
          height={40}
          inputChangeHandler={(text) => {
            const hasInputKey = Boolean(inputKey);

            if (hasInputKey) {
              searchIdInputChangeHandler(text, inputKey);
            }
          }}
        />
      </View>
    );
  },
);

IdentificationTextInputItem.displayName = 'IdentificationTextInputItem';

export default IdentificationTextInputItem;
