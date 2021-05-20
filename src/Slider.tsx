import React from 'react'
import * as RN from 'react-native'
import useThumb from './hooks/useThumb'
import Track from './components/Track'
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
  minTrackStyle?: RN.StyleProp<RN.ViewStyle>;
  maxTrackStyle?: RN.StyleProp<RN.ViewStyle>;
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
    minTrackStyle,
    maxTrackStyle,
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

  const { updateValue, value, canMove } = useThumb({
    minimumValue,
    maximumValue,
    value: propValue,
    step,
    slideOnTap,
    onValueChange
  })

  const { onPress, onMove, onRelease } = useDrag({ value, canMove, updateValue, onSlidingComplete, onSlidingStart })

  const percentage = React.useMemo(() => (value - minimumValue) / (maximumValue - minimumValue), [value, minimumValue, maximumValue])
  // We add a default padding to ensure that the responder view has enough space to recognize the touches
  const responderStyle = React.useMemo(() => [{ [vertical ? 'paddingHorizontal' : 'paddingVertical']: 10 }, style], [style, vertical])

  // See https://github.com/Sharcoux/slider/issues/13
  const thumbRadius = Math.min(trackHeight, thumbSize)

  const { minStyle, maxStyle } = React.useMemo(() => ({
    minStyle: (trackStyle && minTrackStyle) ? [trackStyle, minTrackStyle] : trackStyle || minTrackStyle,
    maxStyle: (trackStyle && maxTrackStyle) ? [trackStyle, maxTrackStyle] : trackStyle || maxTrackStyle
  }), [trackStyle, minTrackStyle, maxTrackStyle])

  return (
    <ResponderView style={responderStyle} ref={forwardedRef} maximumValue={maximumValue} minimumValue={minimumValue} step={step}
      value={value} updateValue={updateValue} onPress={onPress} onMove={onMove} onRelease={onRelease}
      enabled={enabled} vertical={vertical} inverted={inverted} {...others}
    >
      <Track color={minimumTrackTintColor} style={minStyle} length={percentage * 100} vertical={vertical} thickness={trackHeight} />
      <Thumb size={thumbSize} color={thumbTintColor} trackHeight={thumbRadius} style={thumbStyle} />
      <Track color={maximumTrackTintColor} style={maxStyle} length={(1 - percentage) * 100} vertical={vertical} thickness={trackHeight} />
    </ResponderView>
  )
}
)

Slider.displayName = 'Slider'

export default Slider
