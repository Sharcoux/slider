import React from 'react'
import * as RN from 'react-native'
import useThumb from './hooks/useAnimatedThumb'
import Track from './components/AnimatedTrack'
import Thumb from './components/Thumb'
import ResponderView from './components/ResponderView'

export type SliderProps = RN.ViewProps & {
  value?: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  thumbStyle?: RN.StyleProp<RN.ViewStyle>;
  trackStyle?: RN.StyleProp<RN.ViewStyle>;
  style?: RN.StyleProp<RN.ViewStyle>;
  inverted?: boolean;
  vertical?: boolean;
  enabled?: boolean;
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
    trackHeight = 4,
    thumbSize = 15,
    onValueChange,
    onSlidingStart,
    onSlidingComplete,
    ...others
  } = props

  const { updateValue, animatedValue, value } = useThumb({
    minimumValue,
    maximumValue,
    value: propValue,
    step,
    onValueChange
  })

  const onPress = (value: number) => {
    updateValue(value)
    onSlidingStart && onSlidingStart(value)
  }

  return (
    <ResponderView style={style} ref={forwardedRef} maximumValue={maximumValue} minimumValue={minimumValue} step={step}
      value={value} updateValue={updateValue} onPress={onPress} onMove={updateValue} onRelease={onSlidingComplete}
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
