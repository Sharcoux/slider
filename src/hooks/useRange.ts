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
  const [minProp, maxProp] = propValue
  const [minValue, setMinValue] = React.useState(minProp)
  const [maxValue, setMaxValue] = React.useState(maxProp)

  React.useEffect(() => setMinValue(minProp), [minProp])
  React.useEffect(() => setMaxValue(maxProp), [maxProp])
  const range = React.useMemo<[number, number]>(() => [minValue, maxValue], [maxValue, minValue])
  console.log('---', minProp, minValue)

  const updateMin = useEvent((newMin: number) => {
    if (minValue === newMin) return
    setMinValue(newMin)
    onValueChange?.([newMin, maxValue])
  })
  const updateMax = useEvent((newMax: number) => {
    if (maxValue === newMax) return
    setMaxValue(newMax)
    onValueChange?.([minValue, newMax])
  })

  // Min value thumb
  const { updateValue: updateMinValue, canMove: canMoveMin } = useThumb({
    minimumValue,
    maximumValue: Math.max(minValue, maxValue - minimumRange),
    value: minValue,
    step,
    slideOnTap,
    onValueChange: updateMin
  })

  // Max value thumb
  const { updateValue: updateMaxValue, canMove: canMoveMax } = useThumb({
    minimumValue: Math.min(maxValue, minValue + minimumRange),
    maximumValue,
    value: maxValue,
    step,
    slideOnTap,
    onValueChange: updateMax
  })

  const currentThumb = React.useRef<'min' | 'max'>()

  // Method to update the lower or higher bound according to which one is the closest
  const updateClosestValue = useEvent((value: number, state: 'press' | 'release' | 'drag') => {
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
