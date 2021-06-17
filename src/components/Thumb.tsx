import React from 'react'
import * as RN from 'react-native'

type Props = {
  style?: RN.StyleProp<RN.ViewStyle>;
  color?: RN.ColorValue;
  size?: number;
  trackHeight: number;
  thumbImage?: RN.ImageURISource
}

const Thumb = ({ color = 'darkcyan', trackHeight, size = 15, style, thumbImage }: Props) => {
  const thumbContainerStyle: RN.ViewStyle = React.useMemo(() => ({
    width: trackHeight,
    height: trackHeight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  }), [trackHeight])

  /** We want to cover the end of the track */
  const thumbViewStyle = React.useMemo(() => RN.StyleSheet.compose(
    {
      width: size,
      height: size,
      backgroundColor: color,
      zIndex: 1,
      borderRadius: size / 2,
      overflow: 'hidden',
      // This is for web
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userSelect: 'none'
    },
    style
  ), [style, size, color])

  return <RN.View pointerEvents="none" style={thumbContainerStyle}>
    {thumbImage ? <RN.Image source={thumbImage} style={thumbViewStyle as RN.ImageStyle} /> : <RN.View style={thumbViewStyle} />}
  </RN.View>
}

export default React.memo(Thumb)
