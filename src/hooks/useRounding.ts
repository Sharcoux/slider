import React from 'react'

type Props = {
  step: number;
  minimumValue: number;
  maximumValue: number;
}

/**
 * Provide a rounding method given the provided slider configuration.
 * The results will be rounded, with the minimum amount of digits, and
 * we make sure that it still fits within the bounds.
*/
const useRounding = ({ step, minimumValue, maximumValue }: Props) => {
  return React.useCallback((value: number) => {
    // We tolerate not rounded values when they exactly match the bounds
    if (value === minimumValue || value === maximumValue) return value
    // Caluculate the precision we need to represent the values
    const precision = (!step) ? Infinity : ((step + '').split('.')[1] || '').length
    // Round the value to match the steps
    const rounded = step ? Math.round(value * Math.pow(10, precision) / step) * step / Math.pow(10, precision) : value
    // Ensure that the value is correctly rounded for decimals
    const hardRounded = precision === 0 || precision === Infinity ? rounded : Number.parseFloat(rounded.toFixed(precision))
    // Ensure that the new value is still between the bounds
    const withinBounds = Math.max(
      minimumValue,
      Math.min(hardRounded, maximumValue)
    )
    return withinBounds
  }, [step, minimumValue, maximumValue])
}

export default useRounding
