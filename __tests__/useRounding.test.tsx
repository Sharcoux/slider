import React from 'react'
import useRounding, { RoundingProps } from '../src/hooks/useRounding' // Update this path
import { act, create } from 'react-test-renderer'

describe('useRounding', () => {
  // Helper function to test the hook
  function testRoundingHook (props: RoundingProps, value: number) {
    const result = { value: undefined as number | undefined }
    function TestComponent () {
      result.value = useRounding(props)(value)
      return null
    }
    act(() => {
      create(<TestComponent />)
    })
    return result.value
  }

  it('should return values at the bounds', () => {
    const props = { minimumValue: 10, maximumValue: 20, step: 1 }
    expect(testRoundingHook(props, 10)).toBe(10)
    expect(testRoundingHook(props, 20)).toBe(20)
  })

  it('should return the same value when no step is provided', () => {
    const props = { minimumValue: 0, maximumValue: 100, step: 0 }
    expect(testRoundingHook(props, 55.78)).toBe(55.78)
  })

  it('should round integer values with integer steps', () => {
    const props = { minimumValue: 0, maximumValue: 100, step: 5 }
    expect(testRoundingHook(props, 53)).toBe(55)
    expect(testRoundingHook(props, 52)).toBe(50)
  })

  it('should round decimal values with integer steps', () => {
    const props = { minimumValue: 0, maximumValue: 100, step: 15 }
    expect(testRoundingHook(props, 55.2)).toBe(60)
    expect(testRoundingHook(props, 49.5)).toBe(45)
  })

  it('should round values with decimal steps', () => {
    const props = { minimumValue: 0, maximumValue: 100, step: 0.25 }
    expect(testRoundingHook(props, 52.1)).toBe(52)
    expect(testRoundingHook(props, 52.7)).toBe(52.75)
    expect(testRoundingHook(props, 52.77777)).toBe(52.75)
  })

  it('should clamp values within bounds', () => {
    const props = { minimumValue: 10, maximumValue: 20, step: 1 }
    expect(testRoundingHook(props, 9)).toBe(10)
    expect(testRoundingHook(props, 21)).toBe(20)
  })

  it('should round valeus when minimumValue is not 0 and step is not 1', () => {
    const props = { minimumValue: 1, maximumValue: 13, step: 2 }
    expect(testRoundingHook(props, 2)).toBe(3)
    expect(testRoundingHook(props, 4.5)).toBe(5)
  })
})
