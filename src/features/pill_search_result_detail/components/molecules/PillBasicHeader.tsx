import { memo } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/molecules/PillBasicHeader';
import { Bookmark } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { LinearGradient } from 'expo-linear-gradient';

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
    <View style={styles.headerWrapper}>
      <ScrollView
        style={styles.nameScrollWrapper}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.nameViewWrapper}>
          <Text style={styles.name}>{itemNames[0].trim()}</Text>
          {itemNames[1] && (
            <Text style={[styles.name, { fontSize: fontPx(18) }]}>
              {itemNames[1]}
            </Text>
          )}
        </View>
      </ScrollView>
      <LinearGradient
        colors={['transparent', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradiant}
        pointerEvents="none"
      />
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
