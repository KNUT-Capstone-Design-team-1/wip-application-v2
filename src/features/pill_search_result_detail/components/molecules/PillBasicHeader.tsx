import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/molecules/PillBasicHeader';
import { Bookmark } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';

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
  const itemNames = itemName.split(/(?=\()/, 2);

  return (
    <View style={styles.nameWrapper}>
      <View>
        <Text style={styles.name} numberOfLines={1}>
          {itemNames[0]}
        </Text>
        {itemNames[1] && (
          <Text
            style={[styles.name, { fontSize: fontPx(18) }]}
            numberOfLines={1}
          >
            {itemNames[1]}
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={onSaveToggle}>
        <Bookmark
          size={fontPx(24)}
          fill={saveState ? '#32D2FF' : 'none'}
          stroke={'#32D2FF'}
          strokeWidth={2}
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(PillBasicHeader);
