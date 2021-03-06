import React from 'react'

type Props<T extends number | [number, number]> = {
  value: T;
  onSlidingStart?: (value: T) => void
  onSlidingComplete?: (value: T) => void
  updateValue: (value: number, state: 'press' | 'release' | 'drag') => void;
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
    if (!canMove(value)) return
    setSliding(true)
    updateValue(value, 'press')
  }, [updateValue, setSliding, canMove])

  const onRelease = React.useCallback((value: number) => {
    if (!sliding) return
    setSliding(false)
    updateValue(value, 'release')
  }, [setSliding, sliding])

  const onMove = React.useCallback((value: number) => {
    if (sliding) updateValue(value, 'drag')
  }, [updateValue, sliding])

  return { onPress, onRelease, onMove }
}

export default useDrag
