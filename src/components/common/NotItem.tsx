import { Image } from '@components/common/CustomImage';
import { View } from 'react-native';
import { BaseText } from './BaseText';
import { styles } from './styles/NotItem';
import { INotItemProps } from '@features/notice/types/notice_type';
import character from '@assets/images/character.png';

const NotItem = ({ mainText, subText, marginTop, height }: INotItemProps) => {
  return (
    <View
      style={[
        styles.notItemWrapper,
        { marginTop: Number(marginTop), height: Number(height) },
      ]}
    >
      <BaseText
        fontFamily={'Jalnan2'}
        weight={'regular'}
        size={20}
        style={styles.mainText}
      >
        {mainText}
      </BaseText>
      <BaseText
        fontFamily={'Jalnan2'}
        weight={'regular'}
        size={14}
        style={styles.subText}
      >
        {subText}
      </BaseText>
      <Image source={character} style={styles.icon} contentFit="contain" />
    </View>
  );
};

export default NotItem;
