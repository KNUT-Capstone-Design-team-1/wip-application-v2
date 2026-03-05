import { View, Text, Image } from 'react-native';
import { styles } from './styles/NotItem';
import { INotItemProps } from '../../features/notice/types/notice_type';
import character from '../../../assets/images/character.png';

const NotItem = ({ mainText, subText, marginTop, height }: INotItemProps) => {
  return (
    <View style={[styles.notItemWrapper, { marginTop: marginTop, height: height }]}>
      <Text style={styles.mainText}>{mainText}</Text>
      <Text style={styles.subText}>{subText}</Text>
      <Image source={character} style={styles.icon} resizeMode="contain" />
    </View>
  );
};

export default NotItem;
