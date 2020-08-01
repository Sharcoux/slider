import React from 'react'
import useThumb from './useThumb'

type Props = {
  step: number;
  range: [number, number];
  minimumValue: number;
  maximumValue: number;
  onValueChange?: (range: [number, number]) => void;
}

const useRange = ({ step, range: propValue, minimumValue, maximumValue, onValueChange }: Props) => {
  const [min, setMin] = React.useState(propValue[0])
  const [max, setMax] = React.useState(propValue[1])

  const onMinValueChange = (value: number) => {
    setMin(value)
    onValueChange && onValueChange([value, maxValue])
  }
  const onMaxValueChange = (value: number) => {
    setMax(value)
    onValueChange && onValueChange([minValue, value])
  }

  const { updateValue: updateMinValue, value: minValue } = useThumb({
    minimumValue,
    maximumValue,
    value: propValue[0],
    step,
    onValueChange: onMinValueChange
  })
  const { updateValue: updateMaxValue, value: maxValue } = useThumb({
    minimumValue,
    maximumValue,
    value: propValue[1],
    step,
    onValueChange: onMaxValueChange
  })

  const updateValue = (range: [number, number]) => {
    updateMinValue(range[0])
    updateMaxValue(range[1])
  }

  return { updateValue, range: [min, max] }
}

export default useRange
