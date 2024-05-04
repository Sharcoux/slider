import React from 'react'
import * as RN from 'react-native'
import { useEvent } from '../hooks/useEvent'

export type ThumbProps = {
  style?: RN.StyleProp<RN.ViewStyle>;
  color?: RN.ColorValue;
  size: number;
  thumbRadius?: number
  thumbImage?: RN.ImageURISource;
  thumb?: 'min' | 'max'
  value: number
  minimumValue: number
  maximumValue: number
  step: number
  updateValue: (value: number) => void
  CustomThumb?: React.ComponentType<{ value: number; thumb?: 'min' | 'max' }>;
  thumbRef?: React.LegacyRef<RN.View>
}

function getThumbContainerStyle (size?: number) {
  // This is used for feedback on focus on the thumb.
  // On custom Thumb component, we prefer to ignore the size instruction
  const sizeDetails = size
    ? {
        width: size,
        height: size,
        borderRadius: size / 2
      }
    : undefined
  return RN.StyleSheet.create({
    thumbContainer: {
      ...sizeDetails,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'visible',
      zIndex: 3
    }
  }).thumbContainer
}

function getContainerStyle (thumbRadius: number) {
  return RN.StyleSheet.create({
    container: {
      width: thumbRadius,
      height: thumbRadius,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'visible',
      zIndex: 2
    }
  }).container
}

function getThumbStyle (size: number, color: RN.ColorValue) {
  return RN.StyleSheet.create({
    thumb: {
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: size / 2,
      overflow: 'hidden'
    }
  }).thumb
}

const accessibility = [
  { name: 'increment', label: 'increment' },
  { name: 'decrement', label: 'decrement' }
]

const Thumb = ({
  color = 'darkcyan',
  CustomThumb,
  size = 15,
  thumbRadius = 0,
  style, thumbImage,
  thumb,
  value,
  minimumValue,
  maximumValue,
  step,
  thumbRef,
  updateValue
}: ThumbProps) => {
  const thumbContainerStyle = React.useMemo<RN.StyleProp<RN.ViewStyle>>(() => getThumbContainerStyle(CustomThumb ? undefined : size), [CustomThumb, size])
  const containerStyle = React.useMemo<RN.StyleProp<RN.ViewStyle>>(() => getContainerStyle(thumbRadius), [thumbRadius])
  const thumbViewStyle = React.useMemo<RN.StyleProp<RN.ImageStyle>>(() => [getThumbStyle(size, color), style as RN.ImageStyle], [style, size, color])

  // Accessibility actions
  const accessibilityActions = useEvent((event: RN.AccessibilityActionEvent) => {
    const tenth = Math.round((maximumValue - minimumValue) / 10)
    switch (event.nativeEvent.actionName) {
      case 'increment':
        updateValue(+(step || tenth))
        break
      case 'decrement':
        updateValue(-(step || tenth))
        break
    }
  })
  const handleAccessibilityKeys = useEvent((event: RN.NativeSyntheticEvent<KeyboardEvent>) => {
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
  })
  const accessibilityValues = React.useMemo(() => ({ min: minimumValue, max: maximumValue, now: value }), [minimumValue, maximumValue, value])

  return <RN.View style={containerStyle}>
    <RN.View
      accessibilityActions={accessibility}
      onAccessibilityAction={accessibilityActions}
      focusable
      accessible
      accessibilityValue={accessibilityValues}
      accessibilityRole='adjustable'
      accessibilityLabel={thumb}
      ref={thumbRef}
      // This is for web
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onKeyDown={handleAccessibilityKeys}
      style={thumbContainerStyle}
    >
      {thumbImage ? <RN.Image source={thumbImage} style={thumbViewStyle} /> : CustomThumb ? <CustomThumb value={value} thumb={thumb} /> : <RN.View style={thumbViewStyle} />}
    </RN.View>
  </RN.View>
}

export default React.memo(Thumb)
