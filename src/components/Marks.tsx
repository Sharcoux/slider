import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import useRounding from '../hooks/useRounding'
import { useEvent } from '../hooks/useEvent'
import { THUMB_SIZE } from './Thumb'

type SliderType = 'slider' | 'range'
type SliderValue<T extends SliderType> = T extends 'slider' ? number : [number, number]
export type CustomMarkType<T extends 'slider' | 'range'> = React.ComponentType<{ stepMarked: boolean; currentValue: SliderValue<T>; index: number; min: number; max: number; markValue: number }>;

const styleSheet = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    height: '100%',
    width: '100%',
    top: 0,
    margin: 'auto',
    overflow: 'visible'
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 0,
    height: 0,
    pointerEvents: 'none',
    zIndex: 1,
    overflow: 'visible'
  }
})

type MarkProps<T extends 'slider' | 'range'> = {
  StepMarker: CustomMarkType<T>
  stepMarked: boolean
  markValue: number
  index: number
  min: number
  max: number
  left: number
  top: number
  currentValue: SliderValue<T>
}

const Mark = <T extends 'slider' | 'range'>({ StepMarker, left, top, ...props }: MarkProps<T>) => {
  const style = React.useMemo(() => ([styleSheet.mark, { top, left }]), [top, left])
  return <View style={style}>
    <StepMarker {...props} />
  </View>
}

type CustomMarksProps<T extends 'slider' | 'range'> = {
  StepMarker?: CustomMarkType<T>
  minimumValue: number
  maximumValue: number
  step: number
  activeValue: SliderValue<T>
  type: T
  inverted: boolean
  vertical: boolean
}
const Marks = <T extends 'slider' | 'range'>(props: CustomMarksProps<T>) => {
  const { StepMarker, step, minimumValue, maximumValue, inverted, vertical, activeValue } = props
  const [sliderWidth, setSliderWidth] = React.useState(0)
  const [sliderHeight, setSliderHeight] = React.useState(0)
  const onLayoutUpdateMarks = useEvent<Exclude<ViewProps['onLayout'], undefined>>((event) => {
    const { width, height } = event.nativeEvent.layout
    setSliderWidth(width)
    setSliderHeight(height)
  })

  const round = useRounding({ step, minimumValue, maximumValue })
  const marks = React.useMemo<JSX.Element[] | null>(() => {
    // We cannot render marks if there is no step as we cannot render an infinite amount of marks
    if (!StepMarker || !step) return null
    const markCount = Math.round((maximumValue - minimumValue) / step) + 1
    return Array(markCount).fill(0).map((_, index) => {
      const markValue = round(index * step + minimumValue)
      const advance = ((vertical ? sliderHeight : sliderWidth) - THUMB_SIZE) * (markValue - minimumValue) / ((maximumValue - minimumValue) || 1) + THUMB_SIZE / 2
      const padding = (vertical ? sliderWidth : sliderHeight) / 2
      const x = inverted ? (vertical ? sliderHeight : sliderWidth) - advance : advance
      const y = padding
      return <Mark
        key={markValue}
        StepMarker={StepMarker}
        stepMarked={Array.isArray(activeValue) ? activeValue.includes(markValue) : activeValue === markValue}
        currentValue={activeValue}
        markValue={markValue}
        index={index}
        min={minimumValue}
        max={maximumValue}
        top={vertical ? x : y}
        left={vertical ? y : x}
        />
    })
  }, [StepMarker, activeValue, inverted, maximumValue, minimumValue, round, sliderHeight, sliderWidth, step, vertical])

  return <View style={styleSheet.container} onLayout={onLayoutUpdateMarks}>{marks}</View>
}

export default Marks
