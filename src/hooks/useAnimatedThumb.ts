import React from 'react'
import * as RN from 'react-native'
import useRounding from './useRounding'

type Props = {
  step: number;
  value: number;
  minimumValue: number;
  maximumValue: number;
  slideOnTap: boolean | undefined;
  onValueChange?: (value: number) => void;
}

/** Handle the state of the thumb of a slider, using the Animated API */
const useThumb = ({ step, value, slideOnTap, minimumValue, maximumValue, onValueChange }: Props) => {
  const latestValue = React.useRef(value || minimumValue) // The value desired
  const animatedValue = React.useRef(new RN.Animated.Value(latestValue.current)) // The value that will move between minimumValue to maximumValue
  const displayedValue = React.useRef(latestValue.current) // The value currently displayed by the slider
  const animation = React.useRef(false)
  const round = useRounding({ step, minimumValue, maximumValue })

  // We une the Animated API to move te slider to the provided position
  const animateTo = React.useCallback((val: number) => {
    if (animation.current) return // If an animation is currently ongoing, we wait
    if (displayedValue.current === val) return // If the displayedValue is the current value, we do nothing
    displayedValue.current = val
    animation.current = true
    RN.Animated.timing(animatedValue.current, { toValue: val, duration: 10, useNativeDriver: true }).start(() => {
      onValueChange && onValueChange(val)
      animation.current = false
      animateTo(latestValue.current)
    })
  }, [onValueChange])

  // Update the value on props change
  React.useLayoutEffect(() => { updateValue(value) }, [value])

  // Update the precision on step changes
  React.useLayoutEffect(() => { updateValue(latestValue.current) }, [step, minimumValue, maximumValue])

  // Move the slider to the provided position
  const updateValue = React.useCallback((newValue: number) => {
    const rounded = round(newValue)
    latestValue.current = rounded
    animateTo(rounded)
  }, [round, animateTo])

  /**
   * Indicates whether we accept to move to the specified position.
   * If the position is too far and slideOnTap is set, we don't accept sliding there
   **/
  const canMove = React.useCallback((newValue: number) => {
    if (slideOnTap) return true
    else if (step) return Math.abs(newValue - value) < step
    else return Math.abs(newValue - value) / (maximumValue - minimumValue) < 0.1
  }, slideOnTap ? [] : [value, step, maximumValue, minimumValue])

  return { updateValue, animatedValue: animatedValue.current, canMove, value: latestValue.current }
}

export default useThumb
