import React from 'react'
import { View, Text, StyleSheet, AppRegistry, Platform } from 'react-native'
import { Slider, RangeSlider } from './src'
import { name as appName } from './app.json'

const styles = StyleSheet.create({
  category: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  slider: {
    width: 200,
    height: 40,
    flexGrow: 0,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid'
  },
  verticalSlider: {
    height: 200,
    width: 40,
    flexGrow: 0,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid'
  },
  title: {
    fontSize: 28,
    margin: 20
  }
})

const App = () => {
  const [value, setValue] = React.useState(0)
  const [range, setRange] = React.useState<[number, number]>([0, 0])
  return <View>
    <Text style={styles.title}>Raw Slider</Text>
    <View style={styles.category}>
      <Slider
        onSlidingStart={value => console.log('start:', value)}
        onSlidingComplete={value => console.log('complete:', value)}
        onValueChange={value => console.log('change:', value)}
        style={styles.slider}
        inverted={true}
        slideOnTap={false}
        minimumValue={0}
        maximumValue={1}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        value={value}
        step={10}
        onValueChange={setValue}
        minimumTrackTintColor="blue"
        maximumTrackTintColor="red"
      />
      <Slider
        style={styles.verticalSlider}
        minimumValue={0}
        maximumValue={10}
        value={value}
        step={1}
        inverted={true}
        vertical={true}
        onValueChange={setValue}
        minimumTrackTintColor="blue"
        maximumTrackTintColor="red"
      />
      <Slider
        onSlidingStart={value => console.log('start:', value)}
        onSlidingComplete={value => console.log('complete:', value)}
        onValueChange={value => console.log('change:', value)}
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.1}
      />
    </View>
    <Text style={styles.title}>Range Slider</Text>
    <View style={styles.category}>
      <RangeSlider
        onSlidingStart={value => console.log('start:', value)}
        onSlidingComplete={value => console.log('complete:', value)}
        onValueChange={value => console.log('change:', value)}
        style={styles.slider}
        inverted={true}
        slideOnTap={false}
        minimumValue={0}
        maximumValue={1}
      />
      <RangeSlider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        range={range}
        step={1}
        onValueChange={setRange}
        outboundColor="blue"
        inboundColor="red"
      />
      <RangeSlider
        style={styles.verticalSlider}
        minimumValue={0}
        maximumValue={10}
        range={range}
        step={1}
        inverted={true}
        vertical={true}
        onValueChange={setRange}
        outboundColor="blue"
        inboundColor="red"
      />
      <RangeSlider
        onSlidingStart={value => console.log('start:', value)}
        onSlidingComplete={value => console.log('complete:', value)}
        onValueChange={value => console.log('change:', value)}
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.1}
      />
    </View>
  </View>
}

AppRegistry.registerComponent(appName, () => App)

if (Platform.OS === 'web') {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementsByTagName('body')[0]
  })
}
