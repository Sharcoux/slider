# React Native Slider

This Implementation of a slider is fully compatible with React-Native and React-Native-Web.

## Install

```
npm i -S @sharcoux/slider
```

## Usage

You can see below the available props with their respective default values

```javascript
import Slider from '@sharcoux/slider'

<Slider
  value={0}                         // set the current slider's value
  minimumValue={0}                  // Minimum value
  maximumValue={1}                  // Maximum value
  step={0}                          // The step for the slider (0 means that the slider will handle any decimal value within the range [min, max])
  minimumTrackTintColor='grey'      // The track color before the current value
  maximumTrackTintColor='grey'      // The track color after the current value
  thumbTintColor='darkcyan'         // The color of the slider's thumb
  thumbStyle={undefined}            // Override the thumb's style
  inverted={false}                  // If true, min value will be on the right, and max on the left
  enabled={true}                    // If false, the slider won't respond to touches anymore
  trackHeight={4}                   // The track's height in pixel
  thumbSize={15}                    // The thumb's size in pixel
  onValueChange={undefined}         // Called each time the value changed
  onSlidingStart={undefined}        // Called when the slider is pressed
  onSlidingComplete={undefined}     // Called when the press is released
  {...props}                        // Add any View Props that will be applied to the container (style, ref, etc)
/>
```

If you have any issue, please fill an issue [on our repo](https://github.com/Sharcoux/slider/issues)
