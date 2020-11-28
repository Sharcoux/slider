import React from 'react'
import * as RN from 'react-native'
import useAnimatedRange from './hooks/useAnimatedRange'
import Track from './components/AnimatedTrack'
import Thumb from './components/Thumb'
import ResponderView from './components/ResponderView'
import useDrag from './hooks/useDrag'

export type SliderProps = RN.ViewProps & {
  range?: [number, number];
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  outboundColor?: RN.ColorValue;
  inboundColor?: RN.ColorValue;
  thumbTintColor?: RN.ColorValue;
  thumbStyle?: RN.StyleProp<RN.ViewStyle>;
  trackStyle?: RN.StyleProp<RN.ViewStyle>;
  style?: RN.StyleProp<RN.ViewStyle>;
  inverted?: boolean;
  vertical?: boolean;
  enabled?: boolean;
  slideOnTap?: boolean;
  trackHeight?: number;
  thumbSize?: number;
  onValueChange?: (range: [number, number]) => void;
  onSlidingStart?: (range: [number, number]) => void;
  onSlidingComplete?: (range: [number, number]) => void;
}

/** A Range slider for React Native / React Native Web, using the Animated API */
const Slider = React.forwardRef<RN.View, SliderProps>((props: SliderProps, forwardedRef) => {
  const {
    minimumValue = 0,
    maximumValue = 1,
    range: propValue = [minimumValue, minimumValue],
    step = 0,
    outboundColor = 'grey',
    inboundColor = 'blue',
    thumbTintColor = 'darkcyan',
    thumbStyle,
    trackStyle,
    style,
    inverted = false,
    vertical = false,
    enabled = true,
    slideOnTap = true,
    trackHeight = 4,
    thumbSize = 15,
    onValueChange,
    onSlidingStart,
    onSlidingComplete,
    ...others
  } = props

  // Get the slider state
  const { updateClosestValue, updateMaxValue, canMove, range, animatedRange: [minboundValue, maxRangeValue] } = useAnimatedRange({
    minimumValue,
    maximumValue,
    range: propValue,
    step,
    slideOnTap,
    onValueChange
  })

  const { onPress, onMove, onRelease } = useDrag({ value: range, updateValue: updateClosestValue, onSlidingComplete, onSlidingStart, canMove })

  return (
    <ResponderView style={style} ref={forwardedRef} maximumValue={maximumValue} minimumValue={minimumValue} step={step}
      value={range[1]} updateValue={updateMaxValue} onPress={onPress} onMove={onMove} onRelease={onRelease}
      enabled={enabled} vertical={vertical} inverted={inverted} {...others}
    >
      <Track color={outboundColor} style={trackStyle} length={minboundValue.interpolate({
        inputRange: [minimumValue, maximumValue],
        outputRange: [0, 100]
      })} vertical={vertical} thickness={trackHeight} />
      <Thumb size={thumbSize} color={thumbTintColor} trackHeight={trackHeight} style={thumbStyle} />
      <Track color={inboundColor} style={trackStyle} length={(RN.Animated.subtract(maxRangeValue, minboundValue)).interpolate({
        inputRange: [minimumValue, maximumValue],
        outputRange: [0, 100]
      })} vertical={vertical} thickness={trackHeight} />
      <Thumb size={thumbSize} color={thumbTintColor} trackHeight={trackHeight} style={thumbStyle} />
      <Track color={outboundColor} style={trackStyle} length={maxRangeValue.interpolate({
        inputRange: [minimumValue, maximumValue],
        outputRange: [100, 0]
      })} vertical={vertical} thickness={trackHeight} />
    </ResponderView>
  )
}
)

Slider.displayName = 'Slider'

export default Slider
