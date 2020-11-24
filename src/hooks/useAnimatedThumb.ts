import React from 'react'
import * as RN from 'react-native'
import useRounding from './useRounding'

type Props = {
  step: number;
  value: number;
  minimumValue: number;
  maximumValue: number;
  onValueChange?: (value: number) => void;
}

const useThumb = ({ step, value, minimumValue, maximumValue, onValueChange }: Props) => {
  const latestValue = React.useRef(value || minimumValue) // The value desired
  const animatedValue = React.useRef(new RN.Animated.Value(latestValue.current)) // The value that will move between minimumValue to maximumValue
  const displayedValue = React.useRef(latestValue.current) // The value currently displayed by the slider
  const animation = React.useRef(false)
  const round = useRounding({ step, minimumValue, maximumValue })

  function animateTo (val: number) {
    if (animation.current) return // If an animation is currently ongoing, we wait
    if (displayedValue.current === val) return // If the displayedValue is the current value, we do nothing
    displayedValue.current = val
    animation.current = true
    RN.Animated.timing(animatedValue.current, { toValue: val, duration: 10, useNativeDriver: true }).start(() => {
      onValueChange && onValueChange(val)
      animation.current = false
      animateTo(latestValue.current)
    })
  }

  // Update the value on props change
  React.useLayoutEffect(() => {
    updateValue(value)
  }, [value])

  // Update the precision on step changes
  React.useLayoutEffect(() => {
    updateValue(latestValue.current)
  }, [step, minimumValue, maximumValue])

  const updateValue = (newValue: number) => {
    const rounded = round(newValue)
    latestValue.current = rounded
    animateTo(rounded)
  }

  return { updateValue, animatedValue: animatedValue.current, value: latestValue.current }
}

export default useThumb
