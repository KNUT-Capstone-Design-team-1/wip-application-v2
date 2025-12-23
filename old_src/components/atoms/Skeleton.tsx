import React from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SkeletonPlaceholder = (style: any) => {
  const translateX = React.useRef(
    new Animated.Value(-SCREEN_WIDTH * 2),
  ).current;

  React.useEffect(() => {
    const animate = () => {
      Animated.timing(translateX, {
        toValue: SCREEN_WIDTH,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        translateX.setValue(-SCREEN_WIDTH * 2);
        animate();
      });
    };

    animate();
  }, [translateX]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={['#fafdfe00', '#fafdfe', '#fafdfe00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, width: '300%' }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ebf1f5',
    borderRadius: 4,
    height: 100,
    overflow: 'hidden',
    width: 100,
  },
});

export default SkeletonPlaceholder;
