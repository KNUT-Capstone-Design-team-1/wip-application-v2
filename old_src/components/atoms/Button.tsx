import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import TouchableScale, {
  TouchableScaleProps,
} from 'react-native-touchable-scale';

const Button = {
  scale: ({ children, ...props }: TouchableScaleProps) => {
    return (
      <View style={props.style}>
        <TouchableScale
          activeScale={0.95}
          pressInTension={150}
          pressInFriction={150}
          pressOutTension={0}
          {...props}
          style={{ width: '100%' }}
        >
          {children}
        </TouchableScale>
      </View>
    );
  },
  imgInButton: ({
    children,
    src,
    ...props
  }: TouchableScaleProps & { src: string }) => {
    return (
      <TouchableScale
        onPress={props.onPress}
        activeScale={0.95}
        pressInTension={150}
        pressInFriction={150}
        pressOutTension={0}
        style={styles.buttonContainer} // 그림자 + 배경 + 둥근 모서리 적용
      >
        <Image
          source={{ uri: src }}
          style={{ width: 30, height: 30, marginBottom: 4 }}
          contentFit="contain"
        />
        {children}
      </TouchableScale>
    );
  },
  scaleFast: ({ children, ...props }: TouchableScaleProps) => {
    return (
      <View style={props.style}>
        <TouchableScale
          activeScale={0.95}
          tension={150}
          friction={20}
          // pressInTension={150}
          // pressInFriction={150}
          // pressOutTension={0}
          {...props}
          style={{ width: '100%' }}
        >
          {children}
        </TouchableScale>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,

    // iOS 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,

    // Android 그림자
    elevation: 4,
  },
});

export default Button;
