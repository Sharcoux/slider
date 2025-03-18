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
  onValueChange?: (range: [number, number]) => boolean | void;
}

/** Handle the state of a range slider */
const useRange = ({ step, range: propValue, minimumRange, minimumValue, maximumValue, slideOnTap, onValueChange, crossingAllowed }: Props) => {
  const [minProp, maxProp] = propValue
  const minRef = React.useRef<number>(minProp)
  const maxRef = React.useRef<number>(maxProp)

  // When updating the props, we immediately apply the change to the refs in order to have the correct values in useThumb
  React.useMemo(() => {
    minRef.current = Math.max(minimumValue, minProp)
  }, [minProp, minimumValue])

  React.useMemo(() => {
    maxRef.current = Math.min(maximumValue, maxProp)
  }, [maxProp, maximumValue])

  const onMinChange = useEvent((min: number) => onValueChange?.([min, maxRef.current].sort((a, b) => a - b) as [number, number]))
  const onMaxChange = useEvent((max: number) => onValueChange?.([minRef.current, max].sort((a, b) => a - b) as [number, number]))

  // Min value thumb
  const { updateValue: updateMinValue, canMove: canMoveMin, value: minValue } = useThumb({
    minimumValue,
    maximumValue: Math.max(minimumValue, maxRef.current - minimumRange),
    value: minProp,
    step,
    slideOnTap,
    onValueChange: onMinChange
  })
  minRef.current = minValue

  // Max value thumb
  const { updateValue: updateMaxValue, canMove: canMoveMax, value: maxValue } = useThumb({
    minimumValue: Math.min(maximumValue, minRef.current + minimumRange),
    maximumValue,
    value: maxProp,
    step,
    slideOnTap,
    onValueChange: onMaxChange
  })
  maxRef.current = maxValue

  const range = React.useMemo(() => [minValue, maxValue].sort((a, b) => a - b) as [number, number], [maxValue, minValue])

  const currentThumb = React.useRef<'min' | 'max'>()

  // Method to update the lower or higher bound according to which one is the closest
  const updateClosestValue = useEvent((value: number, state: 'press' | 'release' | 'drag') => {
    let isMinClosest = false
    // When moving a thumb, we don't want to let it cross the other thumb
    if (currentThumb.current && !crossingAllowed) isMinClosest = currentThumb.current === 'min'
    else if (!currentThumb.current) isMinClosest = Math.abs(value - minValue) < Math.abs(value - maxValue) || (minValue === maxValue && value < minValue)
    // if the current thumb is the min, we keep it as long as it's below the max
    else if (currentThumb.current === 'min') isMinClosest = value <= maxValue
    // Otherwise, if we hold the max thumb, we switch only if the value is below the min
    else isMinClosest = value < minValue

    // We update the state accordingly
    isMinClosest ? updateMinValue(value) : updateMaxValue(value)
    const newThumb = isMinClosest ? 'min' : 'max' // We set the thumb being currently moved
    // When the 2 thumbs cross, we set the other thumb to the max possible value
    if (state === 'drag' && newThumb !== currentThumb.current) isMinClosest ? updateMaxValue(minValue) : updateMinValue(maxValue)
    currentThumb.current = state === 'release' ? undefined : newThumb // We release the thumb, or keep maintaining it
    return isMinClosest ? [value, maxValue] : [minValue, value]
  })

  const canMove = useEvent((value: number) => {
    return canMoveMax(value) || canMoveMin(value)
  })

  return { updateMinValue, updateMaxValue, updateClosestValue, canMove, range }
}

export default useRange
