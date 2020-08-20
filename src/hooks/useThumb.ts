import React from 'react'
import useRounding from './useRounding'

type Props = {
  step: number;
  value: number;
  minimumValue: number;
  maximumValue: number;
  onValueChange?: (value: number) => void;
}

const useThumb = ({ step, value: propValue, minimumValue, maximumValue, onValueChange }: Props) => {
  const [value, setValue] = React.useState(propValue || minimumValue) // The value desired
  const round = useRounding({ step, minimumValue, maximumValue })

  // Update the value on bounds change
  React.useLayoutEffect(() => {
    updateValue(value)
  }, [step, minimumValue, maximumValue])

  // Update the value on manual value change
  React.useLayoutEffect(() => {
    updateValue(propValue)
  }, [propValue])

  const updateValue = (newValue: number) => {
    const rounded = round(newValue)
    setValue(rounded)
    onValueChange && value !== rounded && onValueChange(rounded)
  }

  return { updateValue, value }
}

export default useThumb
