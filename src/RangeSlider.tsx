import React from 'react'
import * as RN from 'react-native'
import useRange from './hooks/useRange'
import Track from './components/Track'
import Thumb, { ThumbProps } from './components/Thumb'
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
  CustomThumb?: React.ComponentType<ThumbProps & { value: number; thumb: 'min' | 'max' }>;
}

const styleSheet = RN.StyleSheet.create({
  vertical: {
    paddingHorizontal: 10
  },
  horizontal: {
    paddingVertical: 10
  }
})

const Slider = React.forwardRef<RN.View, SliderProps>((props: SliderProps, forwardedRef) => {
  const defaultValue = React.useMemo<[number, number]>(() => [props.minimumValue || 0, props.minimumValue || 0], [props.minimumValue])
  const {
    minimumValue = 0,
    maximumValue = 1,
    range: propValue = defaultValue,
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
    CustomThumb,
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

  const [min, max] = range
  const minTrackPct = React.useMemo(() => (min - minimumValue) / ((maximumValue - minimumValue) || 1), [min, minimumValue, maximumValue])
  const maxTrackPct = React.useMemo(() => (max - minimumValue) / ((maximumValue - minimumValue) || 1), [max, minimumValue, maximumValue])
  // We add a default padding to ensure that the responder view has enough space to recognize the touches
  const responderStyle = React.useMemo(() => [styleSheet[vertical ? 'vertical' : 'horizontal'], style], [style, vertical])

  // See https://github.com/Sharcoux/slider/issues/13
  const thumbRadius = Math.min(trackHeight, thumbSize)

  const { minStyle, midStyle, maxStyle } = React.useMemo(() => ({
    minStyle: (trackStyle && minTrackStyle) ? [trackStyle, minTrackStyle] : trackStyle || minTrackStyle,
    midStyle: (trackStyle && midTrackStyle) ? [trackStyle, midTrackStyle] : trackStyle || midTrackStyle,
    maxStyle: (trackStyle && maxTrackStyle) ? [trackStyle, maxTrackStyle] : trackStyle || maxTrackStyle
  }), [trackStyle, minTrackStyle, midTrackStyle, maxTrackStyle])

  const thumbProps = React.useMemo(() => ({
    size: thumbSize,
    color: thumbTintColor,
    trackHeight: thumbRadius,
    style: thumbStyle,
    thumbImage: thumbImage
  }), [thumbImage, thumbRadius, thumbSize, thumbStyle, thumbTintColor])

  return (
    <ResponderView style={responderStyle} ref={forwardedRef} maximumValue={maximumValue} minimumValue={minimumValue} step={step}
      value={max} updateValue={updateMaxValue} onPress={onPress} onMove={onMove} onRelease={onRelease}
      enabled={enabled} vertical={vertical} inverted={inverted} {...others}
    >
      <Track color={outboundColor} style={minStyle} length={minTrackPct * 100} vertical={vertical} thickness={trackHeight} />
      {CustomThumb ? <CustomThumb {...thumbProps} value={min} thumb='min' /> : <Thumb {...thumbProps} />}
      <Track color={inboundColor} style={midStyle} length={(maxTrackPct - minTrackPct) * 100} vertical={vertical} thickness={trackHeight} />
      {CustomThumb ? <CustomThumb {...thumbProps} value={max} thumb='max' /> : <Thumb {...thumbProps} />}
      <Track color={outboundColor} style={maxStyle} length={(1 - maxTrackPct) * 100} vertical={vertical} thickness={trackHeight} />
    </ResponderView>
  )
})

Slider.displayName = 'Slider'

export default Slider
