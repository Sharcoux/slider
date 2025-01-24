import React from 'react'
import * as RN from 'react-native'
import useThumb from './hooks/useThumb'
import Track from './components/Track'
import Thumb from './components/Thumb'
import ResponderView from './components/ResponderView'
import useDrag from './hooks/useDrag'
import Marks from './components/Marks'

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
  thumbImage?: RN.ImageURISource;
  onValueChange?: (value: number) => boolean | void;
  onSlidingStart?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  CustomThumb?: React.ComponentType<{ value: number }>;
  CustomMark?: React.ComponentType<{ value: number; active: boolean }>;
  CustomTrack?: React.ComponentType<{ length: number; thickness: number; vertical: boolean; track: 'min' | 'max' ; style: RN.StyleProp<RN.ViewStyle>; color: RN.ColorValue }>;
}

const Slider = React.forwardRef<RN.View, SliderProps>((props: SliderProps, forwardedRef) => {
  const {
    step = 0,
    minimumValue = 0,
    maximumValue = minimumValue + step,
    value: propValue = minimumValue,
    minimumTrackTintColor = 'grey',
    maximumTrackTintColor = 'grey',
    thumbTintColor = 'darkcyan',
    thumbStyle,
    trackStyle,
    minTrackStyle,
    maxTrackStyle,
    inverted = false,
    vertical = false,
    enabled = true,
    slideOnTap = true,
    trackHeight = 4,
    thumbSize = 15,
    thumbImage,
    onValueChange,
    onSlidingStart,
    onSlidingComplete,
    CustomThumb,
    CustomTrack,
    CustomMark,
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

  const percentage = React.useMemo(() => (value - minimumValue) / ((maximumValue - minimumValue) || 1), [value, minimumValue, maximumValue])

  const [minStyle, maxStyle] = React.useMemo(() =>
    [minTrackStyle, maxTrackStyle].map(
      style => (style && trackStyle) ? [style, trackStyle] : (style || trackStyle)
    ), [trackStyle, minTrackStyle, maxTrackStyle]
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
    // We pretend to accept "mid" as value for track, but we don't use it
    CustomTrack: CustomTrack as React.ComponentType<{ length: number; thickness: number; vertical: boolean; track: 'min' | 'mid' | 'max' ; style: RN.StyleProp<RN.ViewStyle>; color: RN.ColorValue }>,
    vertical
  }

  const marksProps = { CustomMark, step, minimumValue, maximumValue, activeValues: [value], inverted, vertical }

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
      <Track {...trackProps} color={minimumTrackTintColor} style={minStyle} length={percentage * 100} track='min' />
      <Thumb {...thumbProps} updateValue={updateValue} value={value} />
      <Track {...trackProps} color={maximumTrackTintColor} style={maxStyle} length={(1 - percentage) * 100} track='max' />
      <Marks {...marksProps} />
    </ResponderView>
  )
}
)

Slider.displayName = 'Slider'

export default React.memo(Slider)
