import React from 'react'
import * as RN from 'react-native'

type Props = RN.ViewProps & {
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  style?: RN.StyleProp<RN.ViewStyle>;
  inverted: boolean;
  vertical: boolean;
  enabled: boolean;
  thumbSize?: number;
  updateValue: (value: number) => void;
  onMove?: (value: number) => void;
  onPress?: (value: number) => void;
  onRelease?: (value: number) => void;
  children?: React.ReactNode;
}

const ResponderView = React.forwardRef<RN.View, Props>(({
  vertical, inverted, enabled,
  style,
  minimumValue, maximumValue, value, step,
  updateValue,
  ...props
}: Props, ref) => {
  const isVertical = vertical || (style && (RN.StyleSheet.flatten(style).flexDirection || '').startsWith('column'))
  const containerSize = React.useRef({ width: 0, height: 0 })
  const forwardRef = ref || React.useRef<RN.View>(null)

  const containerStyle = [
    {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 'auto',
      flexDirection: (isVertical ? 'column' : 'row') + (inverted ? '-reverse' : ''),
      // For web
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userSelect: 'none',
      alignItems: 'center',
      cursor: 'pointer'
    } as RN.ViewStyle,
    style
  ]
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

  function eventToValue (event: RN.GestureResponderEvent) {
    const { locationX: x, locationY: y } = event.nativeEvent
    const offset = isVertical ? y : x
    const size = containerSize.current ? containerSize.current[isVertical ? 'height' : 'width'] : 1
    const newValue = inverted
      ? maximumValue - ((maximumValue - minimumValue) * offset) / size
      : minimumValue + ((maximumValue - minimumValue) * offset) / size
    const roundedValue = step ? Math.round(newValue / step) * step : newValue
    return roundedValue
  }

  const onMove = (event: RN.GestureResponderEvent) => {
    props.onMove && props.onMove(eventToValue(event))
  }

  const onPress = (event: RN.GestureResponderEvent) => {
    props.onPress && props.onPress(eventToValue(event))
  }

  const onRelease = (event: RN.GestureResponderEvent) => {
    props.onRelease && props.onRelease(eventToValue(event))
  }

  return <RN.View
    ref={forwardRef}
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
    onResponderRelease={onRelease}
    onResponderMove={onMove}
    // This is for web
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onKeyDown={handleAccessibilityKeys}
    {...props} />
})

export default ResponderView
