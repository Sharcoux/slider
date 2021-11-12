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
  const [range, setRange] = React.useState(propValue)
  const [minProp, maxProp] = propValue

  // We need to access the last callback value
  const onValueChangeRef = React.useRef(onValueChange)
  onValueChangeRef.current = onValueChange

  const updateRange = React.useCallback((rangeUpdate: React.SetStateAction<[number, number]>) => {
    setRange(oldRange => {
      const newRange = typeof rangeUpdate === 'function' ? rangeUpdate(oldRange) : rangeUpdate
      console.error(new Error(newRange + ''))
      // If no change, we return the previous object to avoir rerenders
      if (oldRange[0] === newRange[0] && oldRange[1] === newRange[1]) return oldRange
      // We call onValueChange as soon as the setState is over
      setTimeout(() => onValueChangeRef.current && onValueChangeRef.current(newRange), 0)
      return newRange
    })
  }, [])

  // When the propValue changes, we need to update the min and max values accordingly
  React.useEffect(() => { updateRange([minProp, maxProp]) }, [minProp, maxProp, updateRange])

  const updateMin = React.useCallback((newMin: number) => updateRange(([, oldMax]) => [newMin, oldMax]), [updateRange])
  const updateMax = React.useCallback((newMax: number) => updateRange(([oldMin]) => [oldMin, newMax]), [updateRange])

  // Min value thumb
  const { updateValue: updateMinValue, canMove: canMoveMin } = useThumb({
    minimumValue,
    maximumValue: range[1] - minimumRange,
    value: minProp,
    step,
    slideOnTap,
    onValueChange: updateMin
  })

  // Max value thumb
  const { updateValue: updateMaxValue, canMove: canMoveMax } = useThumb({
    minimumValue: range[0] + minimumRange,
    maximumValue,
    value: maxProp,
    step,
    slideOnTap,
    onValueChange: updateMax
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
  }, [range, crossingAllowed, updateMinValue, updateMaxValue])

  const canMove = React.useCallback((value: number) => {
    return canMoveMax(value) || canMoveMin(value)
  }, [canMoveMin, canMoveMax])

  return { updateMinValue, updateMaxValue, updateClosestValue, canMove, range }
}

export default useRange
