import React from 'react'
import * as RN from 'react-native'
import useThumb from './hooks/useThumb'
import Track from './components/Track'
import Thumb from './components/Thumb'
import ResponderView from './components/ResponderView'
import useDrag from './hooks/useDrag'
import useCustomMarks from './hooks/useCustomMarks'

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
  onValueChange?: (value: number) => void;
  onSlidingStart?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  CustomThumb?: React.ComponentType<{ value: number }>;
  CustomMark?: React.ComponentType<{ value: number; active: boolean }>;
}

// We add a default padding to ensure that the responder view has enough space to recognize the touches
const styleSheet = RN.StyleSheet.create({
  vertical: {
    paddingHorizontal: 10
  },
  horizontal: {
    paddingVertical: 10
  }
})

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

  const { minStyle, maxStyle } = React.useMemo(() => ({
    minStyle: (trackStyle && minTrackStyle) ? [trackStyle, minTrackStyle] : trackStyle || minTrackStyle,
    maxStyle: (trackStyle && maxTrackStyle) ? [trackStyle, maxTrackStyle] : trackStyle || maxTrackStyle
  }), [trackStyle, minTrackStyle, maxTrackStyle])

  const thumbProps = React.useMemo(() => ({
    color: thumbTintColor,
    style: thumbStyle,
    size: thumbSize,
    CustomThumb: CustomThumb as React.ComponentType<{ value: number; thumb?: 'min' | 'max' }>,
    thumbImage
  }), [CustomThumb, thumbImage, thumbSize, thumbStyle, thumbTintColor])

  const { marks, onLayoutUpdateMarks } = useCustomMarks(CustomMark, { step, minimumValue, maximumValue, activeValues: [value], inverted, vertical })

  const minimumTrackLength = inverted? (1 - percentage) * 100: percentage * 100
  const maximumTrackLength = inverted? percentage * 100 : (1 - percentage) * 100

  return (
    <RN.View {...others}>
      <ResponderView style={styleSheet[vertical ? 'vertical' : 'horizontal']} ref={forwardedRef} maximumValue={maximumValue} minimumValue={minimumValue} step={step}
        value={value} updateValue={updateValue} onPress={onPress} onMove={onMove} onRelease={onRelease}
        enabled={enabled} vertical={vertical} inverted={inverted} onLayout={onLayoutUpdateMarks}
      >
        <Track color={minimumTrackTintColor} style={minStyle} length={minimumTrackLength} vertical={vertical} thickness={trackHeight} />
        <Thumb {...thumbProps} value={value} />
        <Track color={maximumTrackTintColor} style={maxStyle} length={maximumTrackLength} vertical={vertical} thickness={trackHeight} />
        {marks}
      </ResponderView>
    </RN.View>
  )
}
)

Slider.displayName = 'Slider'

export default Slider
