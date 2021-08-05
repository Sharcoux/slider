import React from 'react'
import * as RN from 'react-native'
import useRange from './hooks/useRange'
import Track from './components/Track'
import Thumb from './components/Thumb'
import ResponderView from './components/ResponderView'
import useDrag from './hooks/useDrag'

export type SliderProps = RN.ViewProps & {
  range?: [number, number];
  minimumValue?: number;
  maximumValue?: number;
  minimumRange?: number;
  step?: number;
  outboundColor?: RN.ColorValue;
  inboundColor?: RN.ColorValue;
  thumbTintColor?: RN.ColorValue;
  thumbStyle?: RN.StyleProp<RN.ViewStyle>;
  trackStyle?: RN.StyleProp<RN.ViewStyle>;
  minTrackStyle?: RN.StyleProp<RN.ViewStyle>;
  midTrackStyle?: RN.StyleProp<RN.ViewStyle>;
  maxTrackStyle?: RN.StyleProp<RN.ViewStyle>;
  style?: RN.StyleProp<RN.ViewStyle>;
  inverted?: boolean;
  vertical?: boolean;
  enabled?: boolean;
  slideOnTap?: boolean;
  trackHeight?: number;
  thumbSize?: number;
  thumbImage?: RN.ImageURISource;
  crossingAllowed?: boolean;
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
    minTrackStyle,
    midTrackStyle,
    maxTrackStyle,
    style,
    inverted = false,
    vertical = false,
    enabled = true,
    slideOnTap = true,
    trackHeight = 4,
    thumbSize = 15,
    thumbImage,
    minimumRange = step,
    crossingAllowed = false,
    onValueChange,
    onSlidingStart,
    onSlidingComplete,
    ...others
  } = props

  const { updateClosestValue, updateMaxValue, range, canMove } = useRange({
    minimumRange,
    minimumValue,
    maximumValue,
    range: propValue,
    step,
    slideOnTap,
    crossingAllowed,
    onValueChange
  })

  const { onPress, onMove, onRelease } = useDrag({ value: range, updateValue: updateClosestValue, onSlidingComplete, onSlidingStart, canMove })

  const minTrackPct = React.useMemo(() => (range[0] - minimumValue) / ((maximumValue - minimumValue) || 1), [range[0], minimumValue, maximumValue])
  const maxTrackPct = React.useMemo(() => (range[1] - minimumValue) / ((maximumValue - minimumValue) || 1), [range[1], minimumValue, maximumValue])

  // See https://github.com/Sharcoux/slider/issues/13
  const thumbRadius = Math.min(trackHeight, thumbSize)

  const { minStyle, midStyle, maxStyle } = React.useMemo(() => ({
    minStyle: (trackStyle && minTrackStyle) ? [trackStyle, minTrackStyle] : trackStyle || minTrackStyle,
    midStyle: (trackStyle && midTrackStyle) ? [trackStyle, midTrackStyle] : trackStyle || midTrackStyle,
    maxStyle: (trackStyle && maxTrackStyle) ? [trackStyle, maxTrackStyle] : trackStyle || maxTrackStyle
  }), [trackStyle, minTrackStyle, maxTrackStyle])

  return (
    <ResponderView style={style} ref={forwardedRef} maximumValue={maximumValue} minimumValue={minimumValue} step={step}
      value={range[1]} updateValue={updateMaxValue} onPress={onPress} onMove={onMove} onRelease={onRelease}
      enabled={enabled} vertical={vertical} inverted={inverted} {...others}
    >
      <Track color={outboundColor} style={minStyle} length={minTrackPct * 100} vertical={vertical} thickness={trackHeight} />
      <Thumb size={thumbSize} color={thumbTintColor} trackHeight={thumbRadius} style={thumbStyle} thumbImage={thumbImage} />
      <Track color={inboundColor} style={midStyle} length={(maxTrackPct - minTrackPct) * 100} vertical={vertical} thickness={trackHeight} />
      <Thumb size={thumbSize} color={thumbTintColor} trackHeight={thumbRadius} style={thumbStyle} thumbImage={thumbImage} />
      <Track color={outboundColor} style={maxStyle} length={(1 - maxTrackPct) * 100} vertical={vertical} thickness={trackHeight} />
    </ResponderView>
  )
})

Slider.displayName = 'Slider'

export default Slider
