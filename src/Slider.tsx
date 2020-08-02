import React from 'react'
import * as RN from 'react-native'
import useThumb from './hooks/useThumb'
import Track from './components/Track'
import Thumb from './components/Thumb'
import ResponderView from './components/ResponderView'

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
  trackHeight?: number;
  thumbSize?: number;
  onValueChange?: (value: number) => void;
  onSlidingStart?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
}

const Slider = React.forwardRef<RN.View, SliderProps>((props: SliderProps, forwardedRef) => {
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

  const { updateValue, value } = useThumb({
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

  const percentage = (value - minimumValue) / (maximumValue - minimumValue)

  return (
    <ResponderView style={style} ref={forwardedRef} maximumValue={maximumValue} minimumValue={minimumValue} step={step}
      value={value} updateValue={updateValue} onPress={onPress} onMove={updateValue} onRelease={onSlidingComplete}
      enabled={enabled} vertical={vertical} inverted={inverted} {...others}
    >
      <Track color={minimumTrackTintColor} style={trackStyle} length={percentage * 100} vertical={vertical} thickness={trackHeight} />
      <Thumb size={thumbSize} color={thumbTintColor} trackHeight={trackHeight} style={thumbStyle} />
      <Track color={maximumTrackTintColor} style={trackStyle} length={(1 - percentage) * 100} vertical={vertical} thickness={trackHeight} />
    </ResponderView>
  )
}
)

Slider.displayName = 'Slider'

export default Slider
