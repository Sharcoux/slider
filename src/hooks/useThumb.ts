import React from 'react'
import useRounding from './useRounding'

type Props = {
  step: number;
  value: number;
  minimumValue: number;
  maximumValue: number;
  slideOnTap: boolean | undefined;
  onValueChange?: (value: number) => void;
}

/** Handle the state of a thumb for a slider */
const useThumb = (props: Props) => {
  const { step, value: propValue, slideOnTap, minimumValue, maximumValue, onValueChange } = props
  const [value, setValue] = React.useState(propValue || minimumValue) // The value desired
  const round = useRounding({ step, minimumValue, maximumValue })

  // This block will group close call to setValue into one single update to greatly improve perfs
  const [updated, setUpdated] = React.useState(false)
  const nextValue = React.useRef(value)
  React.useEffect(() => {
    if (updated) {
      setUpdated(false)
      setValue(nextValue.current)
    }
  }, [updated])

  // We need to access the last callback value
  const onValueChangeRef = React.useRef(onValueChange)
  onValueChangeRef.current = onValueChange

  /** Update the thumb value */
  const updateValue = React.useCallback((newValue: number) => {
    const rounded = round(newValue)
    if (rounded !== nextValue.current) setUpdated(true)
    nextValue.current = rounded
  }, [round])

  // Update the value on bounds change
  React.useLayoutEffect(() => {
    updateValue(nextValue.current)
  }, [step, minimumValue, maximumValue, updateValue])

  // Update the value on propchange
  React.useLayoutEffect(() => {
    updateValue(propValue)
  }, [propValue, updateValue])

  /** Call onValueChange when the user changed the value */
  const userUpdateValue = React.useCallback((newValue: number) => {
    updateValue(newValue)
    onValueChangeRef.current && onValueChangeRef.current(nextValue.current)
  }, [updateValue])

  /**
   * Indicates whether we accept to move to the specified position.
   * If the position is too far and slideOnTap is set, we don't accept sliding there
   **/
  const canMove = React.useCallback((newValue: number) => {
    if (slideOnTap) return true
    else return Math.abs(newValue - value) / ((maximumValue - minimumValue) || 1) < 0.1
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, slideOnTap ? [] : [value, step, maximumValue, minimumValue])

  return { updateValue: userUpdateValue, canMove, value }
}

export default useThumb
