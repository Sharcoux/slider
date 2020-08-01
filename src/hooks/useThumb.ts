import React from 'react'

type Props = {
  step: number;
  value: number;
  minimumValue: number;
  maximumValue: number;
  onValueChange?: (value: number) => void;
}

const useThumb = ({ step, value: propValue, minimumValue, maximumValue, onValueChange }: Props) => {
  const [value, setValue] = React.useState(propValue || minimumValue) // The value desired
  const decimalPrecision = React.useRef(0)

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
    updateValue(value)
  }, [step, minimumValue, maximumValue]) // Update the precision on step changes

  const updateValue = (newValue: number) => {
    // Ensure that the value is correctly rounded
    const hardRounded = decimalPrecision.current < 20 ? Number.parseFloat(newValue.toFixed(decimalPrecision.current)) : newValue

    // Ensure that the new value is still between the bounds
    const withinBounds = Math.max(
      minimumValue,
      Math.min(hardRounded, maximumValue)
    )
    setValue(withinBounds)
    onValueChange && onValueChange(withinBounds)
  }

  return { updateValue, value }
}

export default useThumb
