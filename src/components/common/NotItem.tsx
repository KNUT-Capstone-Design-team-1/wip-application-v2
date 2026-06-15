import { Image } from '@components/common/CustomImage';
import { View, Text } from 'react-native';
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
      <Text style={styles.mainText}>{mainText}</Text>
      <Text style={styles.subText}>{subText}</Text>
      <Image source={character} style={styles.icon} contentFit="contain" />
    </View>
  );
};

export default NotItem;
