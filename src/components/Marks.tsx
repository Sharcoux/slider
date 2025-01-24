import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import useRounding from '../hooks/useRounding'
import { useEvent } from '../hooks/useEvent'
import { THUMB_SIZE } from './Thumb'

export type CustomMarkType = React.ComponentType<{ value: number; active: boolean }>

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
  CustomMark?: CustomMarkType
  minimumValue: number
  maximumValue: number
  step: number
  activeValues: number[]
  inverted: boolean
  vertical: boolean
}
const Marks = ({ CustomMark, step, minimumValue, maximumValue, activeValues, inverted, vertical }: CustomMarksProps) => {
  const [sliderWidth, setSliderWidth] = React.useState(0)
  const [sliderHeight, setSliderHeight] = React.useState(0)
  const onLayoutUpdateMarks = useEvent<Exclude<ViewProps['onLayout'], undefined>>((event) => {
    const { width, height } = event.nativeEvent.layout
    setSliderWidth(width)
    setSliderHeight(height)
  })

  const round = useRounding({ step, minimumValue, maximumValue })
  const marks = React.useMemo<JSX.Element[] | null>(() => {
    if (!CustomMark) return null
    const markCount = Math.round((maximumValue - minimumValue) / (step || 1)) + 1
    return Array(markCount).fill(0).map((_, index) => {
      const markValue = round(index * step + minimumValue)
      const advance = ((vertical ? sliderHeight : sliderWidth) - THUMB_SIZE) * (markValue - minimumValue) / ((maximumValue - minimumValue) || 1) + THUMB_SIZE / 2
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
  }, [CustomMark, activeValues, inverted, maximumValue, minimumValue, round, sliderHeight, sliderWidth, step, vertical])

  return <View style={styleSheet.container} onLayout={onLayoutUpdateMarks}>{marks}</View>
}

export default Marks
