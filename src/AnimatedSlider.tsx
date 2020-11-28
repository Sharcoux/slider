import React from 'react'
import * as RN from 'react-native'
import useThumb from './hooks/useAnimatedThumb'
import Track from './components/AnimatedTrack'
import Thumb from './components/Thumb'
import ResponderView from './components/ResponderView'
import useDrag from './hooks/useDrag'

export type SliderProps = RN.ViewProps & {
  value?: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  minimumTrackTintColor?: RN.ColorValue;
  maximumTrackTintColor?: RN.ColorValue;
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
  onValueChange?: (value: number) => void;
  onSlidingStart?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
}

const AnimatedSlider = React.forwardRef<RN.View, SliderProps>((props: SliderProps, forwardedRef) => {
  const {
    minimumValue = 0,
    maximumValue = 1,
    value: propValue = minimumValue,
    step = 0,
    minimumTrackTintColor = 'grey',
    maximumTrackTintColor = 'grey',
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

  const { updateValue, animatedValue, value, canMove } = useThumb({
    minimumValue,
    maximumValue,
    value: propValue,
    step,
    onValueChange,
    slideOnTap
  })

  const { onPress, onMove, onRelease } = useDrag({ value, updateValue, onSlidingComplete, onSlidingStart, canMove })

  return (
    <ResponderView style={style} ref={forwardedRef} maximumValue={maximumValue} minimumValue={minimumValue} step={step}
      value={value} updateValue={updateValue} onPress={onPress} onMove={onMove} onRelease={onRelease}
      enabled={enabled} vertical={vertical} inverted={inverted} {...others}
    >
      <Track color={minimumTrackTintColor} style={trackStyle} length={animatedValue.interpolate({
        inputRange: [minimumValue, maximumValue],
        outputRange: [0, 100]
      })} thickness={trackHeight} vertical={vertical}/>
      <Thumb size={thumbSize} color={thumbTintColor} trackHeight={trackHeight} style={thumbStyle} />
      <Track color={maximumTrackTintColor} style={trackStyle} length={animatedValue.interpolate({
        inputRange: [minimumValue, maximumValue],
        outputRange: [100, 0]
      })} thickness={trackHeight} vertical={vertical}/>
    </ResponderView>
  )
})

AnimatedSlider.displayName = 'Slider'

export default AnimatedSlider
