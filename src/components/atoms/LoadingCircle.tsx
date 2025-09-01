import { ILoadingCircleProps } from '@/types/atoms/type';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const LoadingCircle = ({ size = 'large', color = '#0000ff' }: ILoadingCircleProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, justifyContent: 'center' },
});

export default LoadingCircle;
