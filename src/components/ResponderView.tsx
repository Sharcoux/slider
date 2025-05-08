import React from 'react'
import * as RN from 'react-native'
import { useEvent } from '../hooks/useEvent'
import useRounding from '../hooks/useRounding'
import SliderView from './SliderView'

type Props = RN.ViewProps & {
  minimumValue: number;
  maximumValue: number;
  step: number;
  style?: RN.StyleProp<RN.ViewStyle>;
  inverted: boolean;
  vertical: boolean;
  enabled: boolean;
  thumbSize?: number;
  onMove: (value: number) => void;
  onPress: (value: number) => void;
  onRelease: (value: number) => void;
  children?: React.ReactNode;
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
const ResponderView = React.forwardRef<RN.View, Props>((props, ref) => {
  const { width: windowWidth, height: windowHeight } = RN.useWindowDimensions()
  const {
    vertical, inverted, enabled,
    style,
    minimumValue, maximumValue, step,
    onLayout: onLayoutProp,
    onMove: onMoveProp,
    onPress: onPressProp,
    onRelease: onReleaseProp,
    ...others
  } = props

  const containerSize = React.useRef({ width: 0, height: 0 })
  const fallbackRef = React.useRef<RN.View>()
  const forwardRef = React.useCallback((view: RN.View) => {
    fallbackRef.current = view
    if (ref) {
      if (typeof ref === 'function') ref(view)
      else ref.current = view
    }
  }, [ref])

  const round = useRounding({ step, minimumValue, maximumValue })

  const isVertical = React.useMemo(() => vertical || (style && (RN.StyleSheet.flatten(style).flexDirection || '').startsWith('column')), [vertical, style])

  // See below for more details
  const originPageLocation = React.useRef({ pageX: 0, pageY: 0 })
  React.useEffect(() => {
    // We update the component's origin when the window size changes
    fallbackRef.current?.measure((_x, _y, _width, _height, pageX = 0, pageY = 0) => (originPageLocation.current = { pageX, pageY }))
  }, [windowWidth, windowHeight])

  /** Convert a touch event into it's position on the slider */
  const eventToValue = useEvent((event: RN.GestureResponderEvent) => {
    // We could simplify this code if this bug was solved:
    // https://github.com/Sharcoux/slider/issues/18#issuecomment-877411645
    const { pageX, pageY, locationX, locationY } = event.nativeEvent
    const x = RN.Platform.OS === 'web' ? locationX : (pageX - originPageLocation.current.pageX)
    const y = RN.Platform.OS === 'web' ? locationY : (pageY - originPageLocation.current.pageY)
    const offset = isVertical ? y : x
    const size = containerSize.current?.[isVertical ? 'height' : 'width'] || 1
    const newValue = inverted
      ? maximumValue - ((maximumValue - minimumValue) * offset) / size
      : minimumValue + ((maximumValue - minimumValue) * offset) / size
    return round(newValue)
  })

  const onMove = useEvent((event: RN.GestureResponderEvent) => {
    onMoveProp(eventToValue(event))
    event.preventDefault()
    event.stopPropagation()
  })

  const onPress = useEvent((event: RN.GestureResponderEvent) => {
    onPressProp(eventToValue(event))
    event.preventDefault()
    event.stopPropagation()
  })

  const onRelease = useEvent((event: RN.GestureResponderEvent) => {
    onReleaseProp(eventToValue(event))
    event.preventDefault()
    event.stopPropagation()
  })

  const isEnabled = useEvent((event: RN.GestureResponderEvent) => {
    event.stopPropagation()
    return enabled
  })

  const keepResponder = useEvent((event: RN.GestureResponderEvent) => {
    event.stopPropagation()
    return false
  })

  const onLayout = useEvent((event: RN.LayoutChangeEvent) => {
    // For some reason, pageX and pageY might be 'undefined' in some cases
    fallbackRef.current?.measure((_x, _y, _width, _height, pageX = 0, pageY = 0) => (originPageLocation.current = { pageX, pageY }))
    onLayoutProp?.(event)
    containerSize.current = event.nativeEvent.layout
  })

  const containerStyle = React.useMemo(() =>
    [styleSheet[vertical ? 'vertical' : 'horizontal'], style],
  [vertical, style])

  return (
    <RN.View
      {...others}
      focusable={false}
      pointerEvents='box-only'
      ref={forwardRef}
      onLayout={onLayout}
      style={containerStyle}
      onStartShouldSetResponder={isEnabled}
      onMoveShouldSetResponder={isEnabled}
      onResponderGrant={onPress}
      onResponderRelease={onRelease}
      onResponderMove={onMove}
      onResponderTerminationRequest={keepResponder}
      onResponderTerminate={onRelease}
    >
      <SliderView
        vertical={vertical}
        inverted={inverted}
      >
        {props.children}
      </SliderView>
    </RN.View>
  )
})

ResponderView.displayName = 'ResponderView'

export default React.memo(ResponderView)
