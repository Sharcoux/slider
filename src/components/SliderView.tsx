import React from 'react'
import * as RN from 'react-native'

type Props = RN.ViewProps & {
  vertical: boolean;
  inverted: boolean;
  children?: React.ReactNode;
}

const styleSheet = RN.StyleSheet.create({
  view: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    alignItems: 'center',
    ...(RN.Platform.OS === 'web'
      ? {
          cursor: 'pointer',
          // This is for web
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          userSelect: 'none'
        }
      : {})
  },
  row: {
    flexDirection: 'row'
  },
  rowReverse: {
    flexDirection: 'row-reverse'
  },
  column: {
    flexDirection: 'column'
  },
  columnReverse: {
    flexDirection: 'column-reverse'
  }
})

const SliderView = React.forwardRef<RN.View, Props>(({
  vertical, inverted, style, ...props
}: Props, ref) => {
  const isVertical = React.useMemo(() => vertical || (style && (RN.StyleSheet.flatten(style).flexDirection || '').startsWith('column')), [vertical, style])
  const containerStyle = React.useMemo(() => ([
    styleSheet.view,
    styleSheet[(isVertical ? 'column' : 'row') + (inverted ? 'Reverse' : '') as 'row'],
    style
  ]), [style, isVertical, inverted])

  return <RN.View
    {...props}
    ref={ref}
    style={containerStyle}
  />
})

SliderView.displayName = 'SliderView'

export default React.memo(SliderView)
