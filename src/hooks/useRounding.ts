import React from 'react'

type Props = {
  step: number;
  minimumValue: number;
  maximumValue: number;
}

const useRounding = ({ step, minimumValue, maximumValue }: Props) => {
  return React.useCallback((value: number) => {
    // Caluculate the precision we need to represent the values
    const precision = (!step) ? Infinity : Math.max(...[minimumValue, maximumValue, step].map(value => ((value + '').split('.').pop() || '').length))
    // Ensure that the value is correctly rounded
    const hardRounded = precision < 20 ? Number.parseFloat(value.toFixed(precision)) : value
    // Ensure that the new value is still between the bounds
    const withinBounds = Math.max(
      minimumValue,
      Math.min(hardRounded, maximumValue)
    )
    return withinBounds
  }, [step, minimumValue, maximumValue])
}

export default useRounding
