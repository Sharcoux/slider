import React from 'react'
import * as RN from 'react-native'
import { useEvent } from '../hooks/useEvent'
import useRounding from '../hooks/useRounding'

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

const styleSheet = RN.StyleSheet.create({
  view: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    alignItems: 'center',
    ...(RN.Platform.OS === 'web'
      ? {
          cursor: 'pointer',
          // This is for web
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          userSelect: 'none'
        }
      : {})
  },
  row: {
    flexDirection: 'row'
  },
  rowReverse: {
    flexDirection: 'row-reverse'
  },
  column: {
    flexDirection: 'column'
  },
  columnReverse: {
    flexDirection: 'column-reverse'
  }
})

const ResponderView = React.forwardRef<RN.View, Props>(({
  vertical, inverted, enabled,
  style,
  minimumValue, maximumValue, step,
  onLayout: onLayoutProp,
  onMove: onMoveProp,
  onPress: onPressProp,
  onRelease: onReleaseProp,
  ...props
}: Props, ref) => {
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

  // We calculate the style of the container
  const isVertical = React.useMemo(() => vertical || (style && (RN.StyleSheet.flatten(style).flexDirection || '').startsWith('column')), [vertical, style])
  const containerStyle = React.useMemo(() => ([
    styleSheet.view,
    styleSheet[(isVertical ? 'column' : 'row') + (inverted ? 'Reverse' : '') as 'row'],
    style
  ]), [style, isVertical, inverted])

  const originPageLocation = React.useRef({ pageX: 0, pageY: 0 })
  /** Convert a touch event into it's position on the slider */
  const eventToValue = useEvent((event: RN.GestureResponderEvent) => {
    // We could simplify this code if this bug was solved:
    // https://github.com/Sharcoux/slider/issues/18#issuecomment-877411645
    const { pageX, pageY, locationX, locationY } = event.nativeEvent
    const x = (RN.Platform.OS === 'web' ? locationX : pageX) - originPageLocation.current.pageX
    const y = (RN.Platform.OS === 'web' ? locationY : pageY) - originPageLocation.current.pageY
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
    // For some reason, pageX and pageY might be 'undefined' in some cases
    fallbackRef.current?.measure((x, y, _width, _height, pageX = 0, pageY = 0) => {
      return (originPageLocation.current = { pageX: RN.Platform.OS === 'web' ? x : pageX, pageY: RN.Platform.OS === 'web' ? y : pageY })
    })
    onLayoutProp?.(event)
    containerSize.current = event.nativeEvent.layout
  })

  return <RN.View
    {...props}
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
  />
})

ResponderView.displayName = 'ResponderView'

export default React.memo(ResponderView)
