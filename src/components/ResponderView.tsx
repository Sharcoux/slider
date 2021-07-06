import React from 'react'
import * as RN from 'react-native'
import useRounding from '../hooks/useRounding'

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
  onMove: (value: number) => void;
  onPress: (value: number) => void;
  onRelease: (value: number) => void;
  children?: React.ReactNode;
}

const accessibility = [
  { name: 'increment', label: 'increment' },
  { name: 'decrement', label: 'decrement' }
]

const ResponderView = React.forwardRef<RN.View, Props>(({
  vertical, inverted, enabled,
  style,
  minimumValue, maximumValue, value, step,
  updateValue,
  onLayout: onLayoutProp,
  ...props
}: Props, ref) => {
  const containerSize = React.useRef({ width: 0, height: 0 })
  const forwardRef = ref || React.useRef<RN.View>(null)
  const round = useRounding({ step, minimumValue, maximumValue })

  // We calculate the style of the container
  const isVertical = React.useMemo(() => vertical || (style && (RN.StyleSheet.flatten(style).flexDirection || '').startsWith('column')), [vertical, style])
  const containerStyle = React.useMemo(() => ([
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
  ]), [style, isVertical, inverted])

  // Accessibility actions
  const accessibilityActions = React.useCallback((event: RN.AccessibilityActionEvent) => {
    const tenth = (maximumValue - minimumValue) / 10
    switch (event.nativeEvent.actionName) {
      case 'increment':
        updateValue(value + (step || tenth))
        break
      case 'decrement':
        updateValue(value - (step || tenth))
        break
    }
  }, [maximumValue, minimumValue, updateValue, value, step])
  const handleAccessibilityKeys = React.useCallback((event: RN.NativeSyntheticEvent<KeyboardEvent>) => {
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
  }, [accessibilityActions])
  const accessibilityValues = React.useMemo(() => ({ min: minimumValue, max: maximumValue, now: value }), [minimumValue, maximumValue, value])

  /** Convert a touch event into it's position on the slider */
  const eventToValue = React.useCallback((event: RN.GestureResponderEvent) => {
    const { locationX: x, locationY: y } = event.nativeEvent
    const offset = isVertical ? y : x
    const size = containerSize.current?.[isVertical ? 'height' : 'width'] || 1
    const newValue = inverted
      ? maximumValue - ((maximumValue - minimumValue) * offset) / size
      : minimumValue + ((maximumValue - minimumValue) * offset) / size
    return round(newValue)
  }, [round, maximumValue, minimumValue])

  const onMove = React.useCallback((event: RN.GestureResponderEvent) => {
    props.onMove(eventToValue(event))
  }, [props.onMove, eventToValue])

  const onPress = React.useCallback((event: RN.GestureResponderEvent) => {
    props.onPress(eventToValue(event))
  }, [props.onPress, eventToValue])

  const onRelease = React.useCallback((event: RN.GestureResponderEvent) => {
    props.onRelease(eventToValue(event))
  }, [props.onRelease, eventToValue])

  const isEnabled = React.useCallback(() => enabled, [enabled])
  const onLayout = React.useCallback((event: RN.LayoutChangeEvent) => {
    onLayoutProp?.(event)
    containerSize.current = event.nativeEvent.layout
  }, [])

  return <RN.View
    {...props}
    ref={forwardRef}
    onLayout={onLayout}
    accessibilityActions={accessibility}
    onAccessibilityAction={accessibilityActions}
    accessible={true}
    accessibilityValue={accessibilityValues}
    accessibilityRole={'adjustable'}
    style={containerStyle}
    onStartShouldSetResponder={isEnabled}
    onMoveShouldSetResponder={isEnabled}
    onResponderGrant={onPress}
    onResponderRelease={onRelease}
    onResponderMove={onMove}
    // This is for web
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onKeyDown={handleAccessibilityKeys}
  />
})

export default React.memo(ResponderView)
