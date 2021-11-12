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
  // We need to access the last callback value
  const onSlidingStartRef = React.useRef(onSlidingStart)
  onSlidingStartRef.current = onSlidingStart
  const onSlidingCompleteRef = React.useRef(onSlidingComplete)
  onSlidingCompleteRef.current = onSlidingComplete

  // Emit the events onSlidingStart and onSlidingComplete when we start / stop sliding
  const [sliding, setSliding] = React.useState(false)
  const updateSliding = React.useCallback(slide => {
    if (slide) onSlidingStartRef.current && onSlidingStartRef.current(value)
    else onSlidingCompleteRef.current && onSlidingCompleteRef.current(value)
    setSliding(slide)
  }, [value])

  const onPress = React.useCallback((value: number) => {
    if (!canMove(value)) return
    updateSliding(true)
    updateValue(value, 'press')
  }, [canMove, updateSliding, updateValue])

  const onRelease = React.useCallback((value: number) => {
    if (!sliding) return
    updateSliding(false)
    updateValue(value, 'release')
  }, [sliding, updateSliding, updateValue])

  const onMove = React.useCallback((value: number) => {
    if (sliding) updateValue(value, 'drag')
  }, [updateValue, sliding])

  return { onPress, onRelease, onMove }
}

export default useDrag
