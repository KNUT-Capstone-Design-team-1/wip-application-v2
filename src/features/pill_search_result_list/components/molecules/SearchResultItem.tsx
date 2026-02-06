import { View, Text, Image } from 'react-native';
import { styles } from '../../styles/molecules/SearchResultItem';

const SearchResultItem = ({ resultItem }: any) => {
  return (
    <View style={styles.searchItemWrapper}>
      <View style={styles.searchItemImage}>
        <Image
          source={{ uri: resultItem.ITEM_IMAGE }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.searchItemContents}>
        <Text style={styles.searchItemTitle}>{resultItem.ITEM_NAME}</Text>
        <Text style={styles.searchItemEntpName}>{resultItem.ENTP_NAME}</Text>
        <Text style={styles.searchItemEtcOtcCode}>{resultItem.ETC_OTC_CODE}</Text>
        <Text style={styles.searchItemPrintFront}>{resultItem.PRINT_FRONT}</Text>
      </View>
    </View>
  );
};

export default SearchResultItem;
