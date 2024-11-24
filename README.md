# React Native Slider

This lightweight version of a slider is fully compatible with React-Native and React-Native-Web.
It also provides support for Range slider (with 2 thumbs) and custom thumb rendering.

 * **Same API** as @react-native-community/slider (with some more features of course!)
 * **lightweight**
 * **Range slider** for sliders with min and max values
 * Supports for **React-Native-Web**
 * **No extra dependencies!**

![](slider.gif)

Try it [here](https://codesandbox.io/s/sharcoux-slider-demo-7fqnk8?file=/src/App.js)!

Have a look at the troubleshooting section if you encounter any issue, or open an issue.

## Install

```
npm i -S @react-native-assets/slider
```

## Usage

### Slider

You can see below the available props with their respective default values.

```javascript
import { Slider } from '@react-native-assets/slider'

<Slider
  value={0}                         // set the current slider's value
  minimumValue={0}                  // Minimum value (defaults as 0)
  maximumValue={0}                  // Maximum value (defaults as minimumValue + step)
  step={0}                          // The step for the slider (0 means that the slider will handle any decimal value within the range [min, max])
  minimumTrackTintColor='grey'      // The track color before the current value
  maximumTrackTintColor='grey'      // The track color after the current value
  thumbTintColor='darkcyan'         // The color of the slider's thumb
  thumbStyle={undefined}            // Override the thumb's style
  trackStyle={undefined}            // Override the tracks' style
  minTrackStyle={undefined}         // Override the tracks' style for the minimum range
  maxTrackStyle={undefined}         // Override the tracks' style for the maximum range
  vertical={false}                  // If true, the slider will be drawn vertically
  inverted={false}                  // If true, min value will be on the right, and max on the left
  enabled={true}                    // If false, the slider won't respond to touches anymore
  trackHeight={4}                   // The track's height in pixel
  thumbSize={15}                    // The thumb's size in pixel
  thumbImage={undefined}            // An image that would represent the thumb
  slideOnTap={true}                 // If true, touching the slider will update it's value. No need to slide the thumb.
  onValueChange={undefined}         // Called each time the value changed. Return false to prevent the value from being updated. The type is (value: number) => boolean | void
  onSlidingStart={undefined}        // Called when the slider is pressed. The type is (value: number) => void
  onSlidingComplete={undefined}     // Called when the press is released. The type is (value: number) => void
  CustomThumb={undefined}           // Provide your own component to render the thumb. The type is a component: ({ value: number }) => JSX.Element
  CustomMark={undefined}            // Provide your own component to render the marks. The type is a component: ({ value: number; active: boolean }) => JSX.Element ; value indicates the value represented by the mark, while active indicates wether a thumb is currently standing on the mark
  {...props}                        // Add any View Props that will be applied to the container (style, ref, etc)
/>
```

### **Range Slider**

You can see below the available props with their respective default values

```javascript
import { RangeSlider } from '@react-native-assets/slider'

<RangeSlider
  range={[0, 0]}                    // set the current slider's value
  step={0}                          // The step for the slider (0 means that the slider will handle any decimal value within the range [min, max])
  minimumRange={0}                  // Minimum range between the two thumbs (defaults as "step")
  minimumValue={0}                  // Minimum value (defaults as 0)
  maximumValue={0}                  // Maximum value (defaults as minimumValue + minimumRange)
  crossingAllowed={false}           // If true, the user can make one thumb cross over the second thumb
  outboundColor='grey'              // The track color outside the current range value
  inboundColor='grey'               // The track color inside the current range value
  thumbTintColor='darkcyan'         // The color of the slider's thumb
  thumbStyle={undefined}            // Override the thumb's style
  trackStyle={undefined}            // Override the tracks' style
  minTrackStyle={undefined}         // Override the tracks' style for the minimum range
  midTrackStyle={undefined}         // Override the tracks' style for the middle range
  maxTrackStyle={undefined}         // Override the tracks' style for the maximum range
  vertical={false}                  // If true, the slider will be drawn vertically
  inverted={false}                  // If true, min value will be on the right, and max on the left
  enabled={true}                    // If false, the slider won't respond to touches anymore
  trackHeight={4}                   // The track's height in pixel
  thumbSize={15}                    // The thumb's size in pixel
  thumbImage={undefined}            // An image that would represent the thumb
  slideOnTap={true}                 // If true, touching the slider will update it's value. No need to slide the thumb.
  onValueChange={undefined}         // Called each time the value changed. Return false to prevent the value from being updated. The type is (range: [number, number]) => boolean | void
  onSlidingStart={undefined}        // Called when the slider is pressed. The type is (range: [number, number]) => void
  onSlidingComplete={undefined}     // Called when the press is released. The type is (range: [number, number]) => void
  CustomThumb={undefined}           // Provide your own component to render the thumb. The type is a component: ({ value: number, thumb: 'min' | 'max' }) => JSX.Element
  CustomMark={undefined}            // Provide your own component to render the marks. The type is a component: ({ value: number; active: boolean }) => JSX.Element ; value indicates the value represented by the mark, while active indicates wether a thumb is currently standing on the mark
  {...props}                        // Add any View Props that will be applied to the container (style, ref, etc)
/>
```

## Troubleshooting

- *The slider is hard to move around*

The component is probably too narrow. Increase the height of the component to ensure a correct touch area

## Slider V9

### Changelog V 9.1.0:

 * It is now possible to provide a custom `CustomTrack` component to render the track

### Changelog V 9.0.0:

 * You can prevent the slider from updating its value by returning false from the `onValueChange` callback
 * The default values have been changed for the `RangeSlider` component

### Changelog V 8.0.0:

 * Wrapped the slider in a ResponderView to enable touch events on the padding area

### Changelog V 7.2.0:

 * Improve key navigation and accessibility on range slider
 * Move the focusable area on the Thumb instead of the ResponderView

### Changelog V 7.1.0:

 * Fix the slider value when using step > 1 and minimumValue != 0
 * Prevent rerenders in the RangeSlider if the provided value prop has the same bounds as the current range

### Changelog V 7.0.0:

 * Add CustomMark prop to provide your own component to render the places where the thumb can stop
 * Wrap the Responder view inside a wrapper to provide more accurate control over the component

### Changelog V 6.0.0:

 * Call prevent default on mouse events to avoid weird interactions
 * Improve performances
 * Add a padding around the RangeSlider too

### Changelog V 5.6.3:

 * Fix Slider value not updating when provided through props
 * Fix a performance issue

### Changelog V 5.5.1:

 * Fix usage step with minimumValue or maximumValue that don't match the step decimal precision
 * Increase the tolerance when using slideOnTap={false}
 * Fix value not updating when providing new data to `range` prop in `RangeSlider`

### Changelog V 5.4.0:

 * Adding support for `thumbImage` prop (please report if you encounter an issue with it)
 * Fix slider breaking when providing your own `onLayout` callback

### Changelog V 5.3.0:

 * new `minTrackStyle` prop on Slider and RangeSlider
 * new `maxTrackStyle` prop on Slider and RangeSlider
 * new `midTrackStyle` prop on RangeSlider

### Changelog V 5.2.0:

 * Adding a default padding of 10 on the ResponderView so that the touches events are more easily catched by the slider.

### Changelog V 5.1.0:

 * new `crossingAllowed` prop on RangeSlider
 * new `minimumRange` prop on RangeSlider

### Changelog V 5.0.0:

 * Remove `AnimatedSlider` and `AnimatedRangeSlider`
 * new `slideOnTap` prop
 * performance boost

If you have any issue, please fill an issue [on our repo](https://github.com/Sharcoux/slider/issues)
