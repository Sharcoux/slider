import React from 'react'
import * as RN from 'react-native'
import useRange from './hooks/useRange'
import Track from './components/Track'
import Thumb from './components/Thumb'
import ResponderView from './components/ResponderView'
import useDrag from './hooks/useDrag'
import Marks, { CustomMarkType } from './components/Marks'

export type RangeSliderProps = RN.ViewProps & {
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
  onValueChange?: (range: [number, number]) => boolean | void;
  onSlidingStart?: (range: [number, number]) => void;
  onSlidingComplete?: (range: [number, number]) => void;
  CustomThumb?: React.ComponentType<{ value: number; thumb: 'min' | 'max' }>;
  StepMarker?: CustomMarkType<'range'>
  CustomTrack?: React.ComponentType<{ length: number; thickness: number; vertical: boolean; track: 'min' | 'mid' | 'max' ; style: RN.StyleProp<RN.ViewStyle>; color: RN.ColorValue }>;
}

const RangeSlider = React.forwardRef<RN.View, RangeSliderProps>((props: RangeSliderProps, forwardedRef) => {
  const {
    minimumValue = 0,
    step = 0,
    minimumRange = step,
    maximumValue = minimumValue + minimumRange,
    range: propRange,
    outboundColor = 'grey',
    inboundColor = 'blue',
    thumbTintColor = 'darkcyan',
    thumbStyle,
    trackStyle,
    minTrackStyle,
    midTrackStyle,
    maxTrackStyle,
    inverted = false,
    vertical = false,
    enabled = true,
    slideOnTap = true,
    trackHeight = 4,
    thumbSize = 15,
    thumbImage,
    crossingAllowed = false,
    onValueChange,
    onSlidingStart,
    onSlidingComplete,
    CustomThumb,
    CustomTrack,
    StepMarker,
    ...others
  } = props

  const [minProp, maxProp] = propRange || []
  const propValue = React.useMemo<[number, number]>(() => [
    minProp ?? props.minimumValue ?? 0,
    maxProp ?? Math.max(props.maximumValue ?? 1, (props.minimumValue || 0) + (props.minimumRange || props.step || 0))
  ], [maxProp, minProp, props.maximumValue, props.minimumRange, props.minimumValue, props.step])

  const { updateClosestValue, updateMaxValue, updateMinValue, range, canMove } = useRange({
    minimumRange,
    minimumValue,
    maximumValue,
    range: propValue,
    step,
    slideOnTap,
    crossingAllowed,
    onValueChange
  })

  const [min, max] = range
  const { onPress, onMove, onRelease } = useDrag({ value: range, updateValue: updateClosestValue, onSlidingComplete, onSlidingStart, canMove })

  const minTrackPct = React.useMemo(() => (min - minimumValue) / ((maximumValue - minimumValue) || 1), [min, minimumValue, maximumValue])
  const maxTrackPct = React.useMemo(() => (max - minimumValue) / ((maximumValue - minimumValue) || 1), [max, minimumValue, maximumValue])

  const [minStyle, midStyle, maxStyle] = React.useMemo(() =>
    [minTrackStyle, midTrackStyle, maxTrackStyle].map(
      style => (style && trackStyle) ? [style, trackStyle] : (style || trackStyle)
    ), [trackStyle, minTrackStyle, midTrackStyle, maxTrackStyle]
  )

  const thumbProps = {
    color: thumbTintColor,
    style: thumbStyle,
    size: thumbSize,
    CustomThumb: CustomThumb as React.ComponentType<{ value: number; thumb?: 'min' | 'max' }>,
    thumbImage,
    minimumValue,
    maximumValue,
    step
  }

  const trackProps = {
    thickness: trackHeight,
    CustomTrack,
    vertical
  }

  const marksProps = { StepMarker, step, minimumValue, maximumValue, activeValue: range, inverted, vertical }

  return (
    <ResponderView
      {...others}
      ref={forwardedRef}
      maximumValue={maximumValue}
      minimumValue={minimumValue}
      step={step}
      onPress={onPress}
      onMove={onMove}
      onRelease={onRelease}
      enabled={enabled}
      vertical={vertical}
      inverted={inverted}
    >
      <Track {...trackProps} color={outboundColor} style={minStyle} length={minTrackPct * 100} track='min' />
      <Thumb key='min' {...thumbProps} updateValue={updateMinValue} value={min} thumb='min' />
      <Track {...trackProps} color={inboundColor} style={midStyle} length={(maxTrackPct - minTrackPct) * 100} track='mid' />
      <Thumb key='max' {...thumbProps} updateValue={updateMaxValue} value={max} thumb='max' />
      <Track {...trackProps} color={outboundColor} style={maxStyle} length={(1 - maxTrackPct) * 100} track='max' />
      <Marks type='range' {...marksProps} />
    </ResponderView>
  )
})

RangeSlider.displayName = 'RangeSlider'

export default React.memo(RangeSlider)
