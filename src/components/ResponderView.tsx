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

const ResponderView = React.forwardRef<RN.View, Props>((props, forwardedRef) => {
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
  const round = useRounding({ step, minimumValue, maximumValue })

  const isVertical = React.useMemo(() => vertical || (style && (RN.StyleSheet.flatten(style).flexDirection || '').startsWith('column')), [vertical, style])

  const eventToValue = useEvent((event: RN.GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent
    const offset = isVertical ? locationY : locationX
    const size = containerSize.current?.[isVertical ? 'height' : 'width'] || 1
    const newValue = inverted
      ? maximumValue - ((maximumValue - minimumValue) * offset) / size
      : minimumValue + ((maximumValue - minimumValue) * offset) / size
    return round(newValue)
  })

  const onMove = useEvent((event: RN.GestureResponderEvent) => {
    onMoveProp(eventToValue(event))
    event.preventDefault()
  })

  const onPress = useEvent((event: RN.GestureResponderEvent) => {
    onPressProp(eventToValue(event))
    event.preventDefault()
  })

  const onRelease = useEvent((event: RN.GestureResponderEvent) => {
    onReleaseProp(eventToValue(event))
    event.preventDefault()
  })

  const isEnabled = useEvent(() => enabled)

  const onLayout = useEvent((event: RN.LayoutChangeEvent) => {
    containerSize.current = event.nativeEvent.layout
    onLayoutProp?.(event)
  })

  return (
    <RN.View
      {...others}
      ref={forwardedRef}
      onLayout={onLayout}
      style={style}
      onStartShouldSetResponder={isEnabled}
      onMoveShouldSetResponder={isEnabled}
      onResponderGrant={onPress}
      onResponderRelease={onRelease}
      onResponderMove={onMove}
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
