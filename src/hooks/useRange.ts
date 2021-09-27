import React from 'react'
import useThumb from './useThumb'

type Props = {
  step: number;
  range: [number, number];
  minimumRange: number;
  minimumValue: number;
  maximumValue: number;
  slideOnTap?: boolean;
  crossingAllowed?: boolean;
  onValueChange?: (range: [number, number]) => void;
}

/** Handle the state of a range slider */
const useRange = ({ step, range: propValue, minimumRange, minimumValue, maximumValue, slideOnTap, onValueChange, crossingAllowed }: Props) => {
  const [min, setMin] = React.useState(propValue[0])
  const [max, setMax] = React.useState(propValue[1])

  // When the propValue changes, we need to update the min and max values accordingly
  React.useEffect(() => {
    if (min !== propValue[0]) setMin(propValue[0])
    if (max !== propValue[1]) setMax(propValue[1])
  }, [propValue])

  // Memoïze the range between renders
  const range = React.useMemo(() => ([min, max] as [number, number]), [min, max])

  // Call onValueChange when the range changes
  React.useEffect(() => {
    onValueChange && onValueChange(range)
  }, range)

  // Min value thumb
  const { updateValue: updateMinValue, canMove: canMoveMin } = useThumb({
    minimumValue,
    maximumValue: max - minimumRange,
    value: propValue[0],
    step,
    slideOnTap,
    onValueChange: setMin
  })

  // Max value thumb
  const { updateValue: updateMaxValue, canMove: canMoveMax } = useThumb({
    minimumValue: min + minimumRange,
    maximumValue,
    value: propValue[1],
    step,
    slideOnTap,
    onValueChange: setMax
  })

  const currentThumb = React.useRef<'min' | 'max'>()

  // Method to update the lower or higher bound according to which one is the closest
  const updateClosestValue = React.useCallback((value: number, state: 'drag' | 'press' | 'release') => {
    const [minValue, maxValue] = range
    // When moving a thumb, we don't want to let it cross the other thumb
    const isMinClosest = (currentThumb.current && !crossingAllowed)
      ? currentThumb.current === 'min'
      : Math.abs(value - minValue) < Math.abs(value - maxValue)
    isMinClosest ? updateMinValue(value) : updateMaxValue(value)
    if (state === 'release') currentThumb.current = undefined // We release the thumb
    else if (state === 'press') currentThumb.current = isMinClosest ? 'min' : 'max' // We set the thumb being currently moved
    return isMinClosest ? [value, maxValue] : [minValue, value]
  }, [updateMinValue, updateMaxValue, range])

  const canMove = React.useCallback((value: number) => {
    return canMoveMax(value) || canMoveMin(value)
  }, [canMoveMin, canMoveMax])

  return { updateMinValue, updateMaxValue, updateClosestValue, canMove, range }
}

export default useRange
