import React from 'react'
import * as RN from 'react-native'

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
  const decimalPrecision = React.useRef(0)
  const animation = React.useRef(false)

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

  React.useLayoutEffect(() => updateValue(value), [value]) // Update the value on props change
  React.useLayoutEffect(() => {
    // We should round number with the same precision as the min, max or step values if provided
    function calculatePrecision () {
      if (!step) return Infinity
      else {
        // Calculate the number of decimals we can encounter in the results
        const decimals = [minimumValue, maximumValue, step].map(value => ((value + '').split('.').pop() || '').length)
        return Math.max(...decimals)
      }
    }
    decimalPrecision.current = calculatePrecision()
    updateValue(latestValue.current)
  }, [step, minimumValue, maximumValue]) // Update the precision on step changes

  const updateValue = (newValue: number) => {
    // Ensure that the value is correctly rounded
    const hardRounded = decimalPrecision.current < 20 ? Number.parseFloat(newValue.toFixed(decimalPrecision.current)) : newValue

    // Ensure that the new value is still between the bounds
    const withinBounds = Math.max(
      minimumValue,
      Math.min(hardRounded, maximumValue)
    )
    latestValue.current = withinBounds
    animateTo(withinBounds)
  }

  return { updateValue, animatedValue: animatedValue.current, value: latestValue.current }
}

export default useThumb
