import { useEvent } from './useEvent'

export type RoundingProps = {
  step: number;
  minimumValue: number;
  maximumValue: number;
}

/**
 * Provide a rounding method given the provided slider configuration.
 * The results will be rounded, with the minimum amount of digits, and
 * we make sure that it still fits within the bounds.
*/
const useRounding = ({ step, minimumValue, maximumValue }: RoundingProps) => {
  return useEvent((value: number) => {
    // We tolerate not rounded values when they exactly match the bounds
    if (value === minimumValue || value === maximumValue) return value
    // Caluculate the precision we need to represent the values
    const precision = (!step) ? Infinity : ((step + '').split('.')[1] || '').length
    // Round the value to match the steps
    const rounded = step ? minimumValue + Math.round((value - minimumValue) / step) * step : value
    // Ensure that the value is correctly rounded for decimals
    const hardRounded = precision === 0 || precision === Infinity ? rounded : Number.parseFloat(rounded.toFixed(precision))
    // Ensure that the new value is still between the bounds
    const withinBounds = Math.max(
      minimumValue,
      Math.min(hardRounded, maximumValue)
    )
    return withinBounds
  })
}

export default useRounding
