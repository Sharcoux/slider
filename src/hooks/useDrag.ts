import React from 'react'
import { useEvent } from './useEvent'

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

  const onPress = useEvent((newValue: number) => {
    if (!canMove(newValue)) return
    onSlidingStart?.(value)
    setSliding(true)
    updateValue(newValue, 'press')
  })

  const onRelease = useEvent((newValue: number) => {
    if (!sliding) return
    setSliding(false)
    updateValue(newValue, 'release')
  })

  // The useEffect cannot depend on value, so we need this function
  const fireSlidingComplete = useEvent(() => onSlidingComplete?.(value))
  // Each time "sliding" switches from "true" to "false", we want to fire the event "complete" with the latest value (after update)
  React.useEffect(() => {
    if (sliding) return fireSlidingComplete
  }, [fireSlidingComplete, sliding])

  const onMove = useEvent((value: number) => {
    if (sliding) updateValue(value, 'drag')
  })

  return { onPress, onRelease, onMove }
}

export default useDrag
