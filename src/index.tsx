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
  trackStyle?: RN.ViewStyle;
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
    trackStyle,
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

  // We should round number with the same precision as the min, max or step values if provided
  function calculatePrecision () {
    if (!step) return Infinity
    else {
      // Calculate the number of decimals we can encounter in the results
      const decimals = [minimumValue, maximumValue, step].map(value => ((value + '').split('.').pop() || '').length)
      return Math.max(...decimals)
    }
  }
  const decimalPrecision = React.useRef(calculatePrecision())
  React.useEffect(() => { decimalPrecision.current = calculatePrecision() }, [step])

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

  const trackViewStyle = RN.StyleSheet.compose({
    height: trackHeight,
    borderRadius: trackHeight / 2,
    // This is for web
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    userSelect: 'none'
  }, trackStyle)

  const minimumTrackStyle = RN.StyleSheet.compose(
    trackViewStyle,
    {
      backgroundColor: minimumTrackTintColor,
      flexGrow: minPercent * 100
    }
  )

  const maximumTrackStyle = RN.StyleSheet.compose(
    trackViewStyle,
    {
      backgroundColor: maximumTrackTintColor,
      flexGrow: maxPercent * 100
    }
  )

  const thumbContainerStyle: RN.ViewStyle = {
    width: trackHeight,
    height: trackHeight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  }

  /** We want to cover the end of the track */
  const ray = thumbSize
  const thumbViewStyle = RN.StyleSheet.compose(
    {
      width: ray,
      height: ray,
      backgroundColor: thumbTintColor,
      zIndex: 1,
      borderRadius: ray / 2,
      overflow: 'hidden',
      // This is for web
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      userSelect: 'none'
    },
    thumbStyle
  )

  const updateValue = (newValue: number) => {
    // Ensure that the value is correctly rounded
    const hardRounded = decimalPrecision.current < 20 ? Number.parseFloat(newValue.toFixed(decimalPrecision.current)) : newValue

    // Ensure that the new value is still between the bounds
    const withinBounds = Math.max(
      minimumValue,
      Math.min(hardRounded, maximumValue)
    )
    // FIXME: understand why this doesn't work as expected when reading the state from the props
    if (value !== withinBounds) {
      setValue(withinBounds)
      onValueChange && onValueChange(withinBounds)
    }
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

  const onPress = (event: RN.GestureResponderEvent) => {
    onMove(event)
    onSlidingStart && onSlidingStart(value)
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
      onResponderGrant={onPress}
      onResponderRelease={() => onSlidingComplete && onSlidingComplete(value)}
      onResponderMove={onMove}
      // This is for web
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      onKeyPress={handleAccessibilityKeys}
      {...others}>
      <RN.View pointerEvents="none" style={minimumTrackStyle} />
      <RN.View pointerEvents="none" style={thumbContainerStyle}>
        <RN.View style={thumbViewStyle} />
      </RN.View>
      <RN.View pointerEvents="none" style={maximumTrackStyle} />
    </RN.View>
  )
}
)

Slider.displayName = 'Slider'

export default Slider
