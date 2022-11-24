import React from 'react'
import { useEvent } from './useEvent'
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

  const updateRange = useEvent((rangeUpdate: React.SetStateAction<[number, number]>, fireEvent?: boolean) => {
    setRange(oldRange => {
      const newRange = typeof rangeUpdate === 'function' ? rangeUpdate(oldRange) : rangeUpdate
      // If no change, we return the previous object to avoir rerenders
      if (oldRange[0] === newRange[0] && oldRange[1] === newRange[1]) return oldRange
      // We call onValueChange as soon as the setState is over
      if (fireEvent && onValueChange) setTimeout(() => onValueChange(newRange), 0)
      return newRange
    })
  })

  const userUpdateRange = useEvent((newRange: React.SetStateAction<[number, number]>) => updateRange(newRange, true))

  // Update the value on bounds or prop change
  React.useEffect(() => {
    updateRange(propValue)
  }, [step, minimumValue, maximumValue, updateRange, propValue])

  const updateMin = useEvent((newMin: number) => userUpdateRange(([, oldMax]) => [newMin, oldMax]))
  const updateMax = useEvent((newMax: number) => userUpdateRange(([oldMin]) => [oldMin, newMax]))

  // Min value thumb
  const { updateValue: updateMinValue, canMove: canMoveMin } = useThumb({
    minimumValue,
    maximumValue: range[1] - (crossingAllowed ? 0 : minimumRange),
    value: minProp,
    step,
    slideOnTap,
    onValueChange: updateMin
  })

  // Max value thumb
  const { updateValue: updateMaxValue, canMove: canMoveMax } = useThumb({
    minimumValue: range[0] + (crossingAllowed ? 0 : minimumRange),
    maximumValue,
    value: maxProp,
    step,
    slideOnTap,
    onValueChange: updateMax
  })

  const currentThumb = React.useRef<'min' | 'max'>()

  // Method to update the lower or higher bound according to which one is the closest
  const updateClosestValue = useEvent((value: number, state: 'press' | 'release' | 'drag') => {
    const [minValue, maxValue] = range
    let isMinClosest = false
    // When moving a thumb, we don't want to let it cross the other thumb
    if (currentThumb.current && !crossingAllowed) isMinClosest = currentThumb.current === 'min'
    else if (!currentThumb.current) isMinClosest = Math.abs(value - minValue) < Math.abs(value - maxValue)
    // if the current thumb is the min, we keep it as long as it's below the max
    else if (currentThumb.current === 'min') isMinClosest = value <= maxValue
    // Otherwise, if we hold the max thumb, we switch only if the value is below the min
    else isMinClosest = value < minValue

    // We update the state accordingly
    isMinClosest ? updateMinValue(value) : updateMaxValue(value)
    if (state === 'release') currentThumb.current = undefined // We release the thumb
    else currentThumb.current = isMinClosest ? 'min' : 'max' // We set the thumb being currently moved
    return isMinClosest ? [value, maxValue] : [minValue, value]
  })

  const canMove = useEvent((value: number) => {
    return canMoveMax(value) || canMoveMin(value)
  })

  return { updateMinValue, updateMaxValue, updateClosestValue, canMove, range }
}

export default useRange
