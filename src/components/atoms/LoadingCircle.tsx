import { ActivityIndicator, StyleSheet, View } from "react-native";

interface IProps {
  size?: number | "large" | "small" | undefined,
  color?: string,
}

const LoadingCircle = ({ size = 'large', color = '#0000ff' }: IProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingCircle;