import { View, Text, TouchableOpacity } from 'react-native';
import Save from '../../../../../assets/icons/save.svg';
import { styles } from '../../styles/molecules/PillBasicHeader';

interface IPillBasicHeaderProps {
  itemName: string;
  saveState: boolean;
  onSaveToggle: () => void;
}

const PillBasicHeader = ({
  itemName,
  saveState,
  onSaveToggle,
}: IPillBasicHeaderProps) => {
  return (
    <View style={styles.nameWrapper}>
      <Text style={styles.name}>{itemName}</Text>
      <TouchableOpacity onPress={onSaveToggle}>
        <Save
          width={15}
          height={20}
          fill={saveState ? '#32D2FF' : 'none'}
          stroke={'#32D2FF'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PillBasicHeader;
