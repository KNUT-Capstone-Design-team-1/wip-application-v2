import { View } from "react-native";
import TouchableScale, { TouchableScaleProps } from "react-native-touchable-scale";

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
    )
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
    )
  }
}


export default Button;