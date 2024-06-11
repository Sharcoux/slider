import React, { useCallback } from 'react'
import { View } from 'react-native'
interface AccessibilityRangeSliderProps {
  min: number;
  max: number;
  updateMaxValue: (value: number) => void;
  updateMinValue: (value: number) => void;
}
/**
 * Custom hook to manage accessibility features for a range slider component.
 * It provides methods to update the minimum and maximum values of the range slider,
 * @param props -Props containing the minimum value, maximum value, and functions to update them.
 * @returns An object containing references to the minimum and maximum thumb elements,
 *          and functions to update their values.
 */
export const useAccessibilityRangeSlider = (props: AccessibilityRangeSliderProps) => {
  const { min, max, updateMaxValue, updateMinValue } = props

  // Refs to hold references to the minimum and maximum thumb elements
  const minThumbRef = React.useRef<View>(null)
  const maxThumbRef = React.useRef<View>(null)

  /**
   * Function to update the minimum value of the range slider
   * If the new value exceeds the maximum value, it updates the maximum value instead.
   * @param value - The value to be added to the current minimum value.
   */
  const updateAccessibilityMinValue = useCallback((value: number) => {
    const newValue = min + value
    if (newValue > max) {
      // If the new value exceeds the maximum value, update the maximum and min value instead
      updateMinValue(max)
      updateMaxValue(min + value)
      // Then focus on the maximum thumb for accessibility
      maxThumbRef.current?.focus()
    } else {
      updateMinValue(newValue)
    }
  }, [min, max, updateMaxValue, updateMinValue])

  /**
 * Function to update the maximum value of the range slider
 * If the new value exceeds the minimum value, it updates the maximum value instead.
 * @param value  - The value to be added to the current maximum value.
 */
  const updateAccessibilityMaxValue = useCallback((value: number) => {
    const newValue = max + value

    if (newValue < min) {
      // If the new value is less than the minimum value, update the minimum and maximum value instead
      updateMaxValue(min)
      updateMinValue(max + value)
      // Then focus on the minimum thumb for accessibility
      minThumbRef.current?.focus()
    } else {
      updateMaxValue(newValue)
    }
  }, [min, max, updateMaxValue, updateMinValue])

  /**
   * Function to blur thumbs
   */
  const blurThumbs = useCallback(() => {
    minThumbRef.current?.blur()
    maxThumbRef.current?.blur()
  }, [])

  return {
    minThumbRef,
    maxThumbRef,
    updateAccessibilityMinValue,
    updateAccessibilityMaxValue,
    blurThumbs
  }
}
