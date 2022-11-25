import React from 'react'
import * as RN from 'react-native'

export type ThumbProps = {
  style?: RN.StyleProp<RN.ViewStyle>;
  color?: RN.ColorValue;
  size?: number;
  trackHeight: number;
  thumbImage?: RN.ImageURISource
}

function getContainerStyle (trackHeight: number) {
  return RN.StyleSheet.create({
    container: {
      width: trackHeight,
      height: trackHeight,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1
    }
  }).container
}

function getThumbStyle (size: number, color: RN.ColorValue) {
  return RN.StyleSheet.create({
    thumb: {
      width: size,
      height: size,
      backgroundColor: color,
      zIndex: 1,
      borderRadius: size / 2,
      overflow: 'hidden'
    }
  }).thumb
}

const Thumb = ({ color = 'darkcyan', trackHeight, size = 15, style, thumbImage }: ThumbProps) => {
  const thumbContainerStyle: RN.ViewStyle = React.useMemo(() => getContainerStyle(trackHeight), [trackHeight])

  /** We want to cover the end of the track */
  const thumbViewStyle = React.useMemo(() => [getThumbStyle(size, color), style], [style, size, color])

  return <RN.View style={thumbContainerStyle}>
    {thumbImage ? <RN.Image source={thumbImage} style={thumbViewStyle as RN.ImageStyle} /> : <RN.View style={thumbViewStyle} />}
  </RN.View>
}

export default React.memo(Thumb)
