import React from 'react'
import * as RN from 'react-native'

export type SliderProps = RN.ViewProps & {
  value?: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  thumbStyle?: RN.ViewStyle;
  style?: RN.ViewStyle;
  inverted?: boolean;
  enabled?: boolean;
  trackHeight?: number;
  thumbSize?: number;
  onValueChange?: (value: number) => void;
  onSlidingStart?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
}

const Slider = React.forwardRef<RN.View, SliderProps>((props: SliderProps, forwardedRef) => {
  const {
    value: initialValue = 0,
    minimumValue = 0,
    maximumValue = 1,
    step = 0,
    minimumTrackTintColor = 'grey',
    maximumTrackTintColor = 'grey',
    thumbTintColor = 'darkcyan',
    thumbStyle,
    style,
    inverted = false,
    enabled = true,
    trackHeight = 4,
    thumbSize = 15,
    onValueChange,
    onSlidingStart,
    onSlidingComplete,
    ...others
  } = props
  const containerSize = React.useRef({ width: 0, height: 0 })
  const containerRef = forwardedRef || React.createRef()
  const [value, setValue] = React.useState(initialValue || minimumValue)
  React.useLayoutEffect(() => updateValue(initialValue), [initialValue])

  const percentageValue =
      (value - minimumValue) / (maximumValue - minimumValue)
  const minPercent = percentageValue
  const maxPercent = 1 - percentageValue

  const containerStyle = RN.StyleSheet.compose(
    {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 'auto',
      flexDirection: 'row',
      // For web
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      userSelect: 'none',
      alignItems: 'center',
      cursor: 'pointer'
    },
    style
  )

  const trackStyle = {
    height: trackHeight,
    borderRadius: trackHeight / 2,
    userSelect: 'none'
  }

  const minimumTrackStyle = {
    ...trackStyle,
    backgroundColor: minimumTrackTintColor,
    flexGrow: minPercent * 100
  }

  const maximumTrackStyle = {
    ...trackStyle,
    backgroundColor: maximumTrackTintColor,
    flexGrow: maxPercent * 100
  }

  const thumbViewStyle = RN.StyleSheet.compose(
    {
      width: thumbSize,
      height: thumbSize,
      backgroundColor: thumbTintColor,
      zIndex: 1,
      borderRadius: thumbSize / 2,
      overflow: 'hidden',
      // This is for web
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      userSelect: 'none'
    },
    thumbStyle
  )

  const updateValue = (newValue: number) => {
    // Ensure that the new value is still between the bounds
    const withinBounds = Math.max(
      minimumValue,
      Math.min(newValue, maximumValue)
    )
    // FIXME: understand why this doesn't work as expected when reading the state from the props
    // if (value !== withinBounds) {
    setValue(withinBounds)
    onValueChange && onValueChange(withinBounds)
    // }
  }

  const onMove = (event: RN.GestureResponderEvent) => {
    const { locationX: x } = event.nativeEvent
    const width = containerSize.current ? containerSize.current.width : 1
    const newValue = inverted
      ? maximumValue - ((maximumValue - minimumValue) * x) / width
      : minimumValue + ((maximumValue - minimumValue) * x) / width
    const roundedValue = step ? Math.round(newValue / step) * step : newValue
    updateValue(roundedValue)
  }
  const accessibilityActions = (event: RN.AccessibilityActionEvent) => {
    const tenth = (maximumValue - minimumValue) / 10
    switch (event.nativeEvent.actionName) {
      case 'increment':
        updateValue(value + (step || tenth))
        break
      case 'decrement':
        updateValue(value - (step || tenth))
        break
    }
  }
  const handleAccessibilityKeys = (event: RN.NativeSyntheticEvent<KeyboardEvent>) => {
    const key = event.nativeEvent.key
    switch (key) {
      case 'ArrowUp':
      case 'ArrowRight': {
        const accessibilityEvent = { ...event, nativeEvent: { actionName: 'increment' } }
        accessibilityActions(accessibilityEvent)
      } break
      case 'ArrowDown':
      case 'ArrowLeft': {
        const accessibilityEvent = { ...event, nativeEvent: { actionName: 'decrement' } }
        accessibilityActions(accessibilityEvent)
      } break
    }
  }

  return (
    <RN.View
      ref={containerRef}
      onLayout={({ nativeEvent }) =>
        (containerSize.current = nativeEvent.layout)
      }
      accessibilityActions={[
        { name: 'increment', label: 'increment' },
        { name: 'decrement', label: 'decrement' }
      ]}
      onAccessibilityAction={accessibilityActions}
      accessible={true}
      accessibilityValue={{ min: minimumValue, max: maximumValue, now: value }}
      accessibilityRole={'adjustable'}
      style={containerStyle}
      onStartShouldSetResponder={() => enabled}
      onMoveShouldSetResponder={() => enabled}
      onResponderGrant={() => onSlidingStart && onSlidingStart(value)}
      onResponderRelease={() => onSlidingComplete && onSlidingComplete(value)}
      onResponderMove={onMove}
      // This is for web
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      onKeyPress={handleAccessibilityKeys}
      {...others}>
      <RN.View pointerEvents="none" style={minimumTrackStyle} />
      <RN.View pointerEvents="none" style={thumbViewStyle} />
      <RN.View pointerEvents="none" style={maximumTrackStyle} />
    </RN.View>
  )
}
)

Slider.displayName = 'Slider'

export default Slider
