import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEvent<T extends (...args: any[]) => any>(onEvent: T) {
  const onEventRef = React.useRef<T>(onEvent)

  onEventRef.current = onEvent

  const staticOnEvent = React.useCallback((...args) => {
    const currentOnEvent = onEventRef.current
    return currentOnEvent(...args)
  }, [])

  return staticOnEvent as T
}
