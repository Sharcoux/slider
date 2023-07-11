import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import useRounding from './useRounding'

export type CustomMarkType = React.ComponentType<{ value: number; active: boolean }>

const styleSheet = StyleSheet.create({
  mark: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 0,
    height: 0,
    pointerEvents: 'none',
    zIndex: 1,
    overflow: 'visible'
  }
})

type MarkProps = {
  CustomMark: CustomMarkType
  value: number
  active: boolean
  left: number
  top: number
}
const Mark = ({ CustomMark, left, top, ...props }: MarkProps) => {
  const style = React.useMemo(() => ([styleSheet.mark, { top, left }]), [top, left])
  return <View style={style}>
    <CustomMark {...props} />
  </View>
}

type CustomMarksProps = {
  minimumValue: number
  maximumValue: number
  step: number
  trackHeight: number
  activeValues: number[]
  inverted: boolean
  vertical: boolean
}
const useCustomMarks = (CustomMark: CustomMarkType | undefined, { step, minimumValue, maximumValue, activeValues, trackHeight, inverted, vertical }: CustomMarksProps) => {
  const [sliderWidth, setSliderWidth] = React.useState(0)
  const [sliderHeight, setSliderHeight] = React.useState(0)
  const onLayoutUpdateMarks = React.useCallback<Exclude<ViewProps['onLayout'], undefined>>((event) => {
    const { width, height } = event.nativeEvent.layout
    setSliderWidth(width)
    setSliderHeight(height)
  }, [])

  const round = useRounding({ step, minimumValue, maximumValue })
  const marks = React.useMemo<JSX.Element[]>(() => {
    if (!CustomMark) return []
    const markCount = Math.round((maximumValue - minimumValue) / (step || 1)) + 1
    return Array(markCount).fill(0).map((_, index) => {
      const markValue = round(index * step + minimumValue)
      const advance = ((vertical ? sliderHeight : sliderWidth) - trackHeight) * (markValue - minimumValue) / ((maximumValue - minimumValue) || 1) + trackHeight / 2
      const padding = (vertical ? sliderWidth : sliderHeight) / 2
      const x = inverted ? (vertical ? sliderHeight : sliderWidth) - advance : advance
      const y = padding
      return <Mark
        key={markValue}
        CustomMark={CustomMark}
        value={markValue}
        active={activeValues.includes(markValue)}
        top={vertical ? x : y}
        left={vertical ? y : x}
      />
    })
  }, [CustomMark, activeValues, inverted, maximumValue, minimumValue, round, sliderHeight, sliderWidth, step, trackHeight, vertical])

  return { marks, onLayoutUpdateMarks }
}

export default useCustomMarks
