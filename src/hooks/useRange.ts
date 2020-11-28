import React from 'react'
import useThumb from './useThumb'

type Props = {
  step: number;
  range: [number, number];
  minimumValue: number;
  maximumValue: number;
  slideOnTap: boolean | undefined;
  onValueChange?: (range: [number, number]) => void;
}

/** Handle the state of a range slider */
const useRange = ({ step, range: propValue, minimumValue, maximumValue, slideOnTap, onValueChange }: Props) => {
  const [min, setMin] = React.useState(propValue[0])
  const [max, setMax] = React.useState(propValue[1])

  // Memoïze the range between renders
  const range = React.useMemo(() => ([min, max] as [number, number]), [min, max])

  // Call onValueChange when the range changes
  React.useEffect(() => {
    onValueChange && onValueChange(range)
  }, range)

  // Min value thumb
  const { updateValue: updateMinValue, canMove: canMoveMin } = useThumb({
    minimumValue,
    maximumValue,
    value: propValue[0],
    step,
    slideOnTap,
    onValueChange: setMin
  })

  // Max value thumb
  const { updateValue: updateMaxValue, canMove: canMoveMax } = useThumb({
    minimumValue,
    maximumValue,
    value: propValue[1],
    step,
    slideOnTap,
    onValueChange: setMax
  })

  // Method to update the lower or higher bound according to which one is the closest
  const updateClosestValue = React.useCallback((value: number): [number, number] => {
    const [minValue, maxValue] = range
    const isMinClosest = Math.abs(value - minValue) < Math.abs(value - maxValue)
    isMinClosest ? updateMinValue(value) : updateMaxValue(value)
    return isMinClosest ? [value, maxValue] : [minValue, value]
  }, [updateMinValue, updateMaxValue, range])

  const canMove = React.useCallback((value: number) => {
    return canMoveMax(value) || canMoveMin(value)
  }, [canMoveMin, canMoveMax])

  return { updateMinValue, updateMaxValue, updateClosestValue, canMove, range }
}

export default useRange
