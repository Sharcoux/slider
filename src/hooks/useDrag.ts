import React from 'react'

type Props<T extends number | [number, number]> = {
  value: T;
  onSlidingStart?: (value: T) => void
  onSlidingComplete?: (value: T) => void
  updateValue: (value: number) => void;
  canMove: (value: number) => boolean;
}

/** Creates the interactions with the slider */
const useDrag = <T extends number | [number, number], >({ value, canMove, updateValue, onSlidingStart, onSlidingComplete }: Props<T>) => {
  // Emit the events onSlidingStart and onSlidingComplete when we start / stop sliding
  const [sliding, setSliding] = React.useState(false)
  React.useEffect(() => {
    if (sliding) onSlidingStart && onSlidingStart(value)
    else onSlidingComplete && onSlidingComplete(value)
  }, [sliding])

  const onPress = React.useCallback((value: number) => {
    console.log(canMove(value))
    if (!canMove(value)) return
    setSliding(true)
    updateValue(value)
  }, [updateValue, setSliding, canMove])

  const onRelease = React.useCallback(() => {
    if (sliding) setSliding(false)
  }, [setSliding])

  const onMove = React.useCallback((value: number) => {
    if (sliding) updateValue(value)
  }, [updateValue, sliding])

  return { onPress, onRelease, onMove }
}

export default useDrag
