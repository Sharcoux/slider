import React from 'react'
import * as RN from 'react-native'

export type ThumbProps = {
  style?: RN.StyleProp<RN.ViewStyle>;
  color?: RN.ColorValue;
  size: number;
  thumbRadius?: number
  thumbImage?: RN.ImageURISource;
  thumb?: 'min' | 'max'
  value: number
  CustomThumb?: React.ComponentType<{ value: number; thumb?: 'min' | 'max' }>;
}

function getContainerStyle (thumbRadius: number) {
  return RN.StyleSheet.create({
    container: {
      width: thumbRadius,
      height: thumbRadius,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'visible',
      zIndex: 2
    }
  }).container
}

function getThumbStyle (size: number, color: RN.ColorValue) {
  return RN.StyleSheet.create({
    thumb: {
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: size / 2,
      overflow: 'hidden'
    }
  }).thumb
}

const Thumb = ({ color = 'darkcyan', CustomThumb, size = 15, thumbRadius = 0, style, thumbImage, thumb, value }: ThumbProps) => {
  const thumbContainerStyle: RN.ViewStyle = React.useMemo(() => getContainerStyle(thumbRadius), [thumbRadius])

  /** We want to cover the end of the track */
  const thumbViewStyle = React.useMemo(() => [getThumbStyle(size, color), style], [style, size, color])

  return <RN.View style={thumbContainerStyle}>
    {thumbImage ? <RN.Image source={thumbImage} style={thumbViewStyle as RN.ImageStyle} /> : CustomThumb ? <CustomThumb value={value} thumb={thumb} /> : <RN.View style={thumbViewStyle} />}
  </RN.View>
}

export default React.memo(Thumb)
