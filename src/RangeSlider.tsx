import React from 'react'
import * as RN from 'react-native'
import useRange from './hooks/useRange'
import Track from './components/Track'
import Thumb from './components/Thumb'
import ResponderView from './components/ResponderView'

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
  trackHeight?: number;
  thumbSize?: number;
  onValueChange?: (range: [number, number]) => void;
  onSlidingStart?: (range: [number, number]) => void;
  onSlidingComplete?: (range: [number, number]) => void;
}

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
    trackHeight = 4,
    thumbSize = 15,
    onValueChange,
    onSlidingStart,
    onSlidingComplete,
    ...others
  } = props

  const { updateValue, range: [minValue, maxValue] } = useRange({
    minimumValue,
    maximumValue,
    range: propValue,
    step,
    onValueChange
  })

  const updateMaxValue = (value: number) => updateValue([minValue, value])
  const updateClosestValue = (value: number): [number, number] => {
    const isMinClosest = Math.abs(value - minValue) < Math.abs(value - maxValue)
    return isMinClosest ? [value, maxValue] : [minValue, value]
  }
  const onPress = (value: number) => {
    const newRange = updateClosestValue(value)
    updateValue(newRange)
    onSlidingStart && onSlidingStart(newRange)
  }
  const onRelease = (value: number) => {
    const newRange = updateClosestValue(value)
    onSlidingComplete && onSlidingComplete(newRange)
  }
  const onMove = (value: number) => {
    const newRange = updateClosestValue(value)
    updateValue(newRange)
  }

  const minPercentage = (minValue - minimumValue) / (maximumValue - minimumValue)
  const maxPercentage = (maxValue - minimumValue) / (maximumValue - minimumValue)

  return (
    <ResponderView style={style} ref={forwardedRef} maximumValue={maximumValue} minimumValue={minimumValue} step={step}
      value={maxValue} updateValue={updateMaxValue} onPress={onPress} onMove={onMove} onRelease={onRelease}
      enabled={enabled} vertical={vertical} inverted={inverted} {...others}
    >
      <Track color={outboundColor} style={trackStyle} length={minPercentage * 100} vertical={vertical} thickness={trackHeight} />
      <Thumb size={thumbSize} color={thumbTintColor} trackHeight={trackHeight} style={thumbStyle} />
      <Track color={inboundColor} style={trackStyle} length={(maxPercentage - minPercentage) * 100} vertical={vertical} thickness={trackHeight} />
      <Thumb size={thumbSize} color={thumbTintColor} trackHeight={trackHeight} style={thumbStyle} />
      <Track color={outboundColor} style={trackStyle} length={(1 - maxPercentage) * 100} vertical={vertical} thickness={trackHeight} />
    </ResponderView>
  )
}
)

Slider.displayName = 'Slider'

export default Slider
