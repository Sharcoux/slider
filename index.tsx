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
  mark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'grey'
  },
  mark2: {
    width: 2,
    height: 8,
    backgroundColor: 'grey',
    marginBottom: 10
  },
  markText: {
    position: 'absolute',
    left: '100%'
  },
  title: {
    fontSize: 28,
    margin: 20
  }
})

const CustomThumb = ({ value }: { value: number }) => {
  return <Text>{value}</Text>
}

const CustomMark = ({ value, active }: { value: number, active: boolean }) => {
  return <View style={styles.mark}>
    <Text style={[styles.markText, { color: active ? 'red' : 'black' }]}>{value}</Text>
  </View>
}

const CustomMark2 = () => {
  return <View style={styles.mark2} />
}

const App = () => {
  const [value, setValue] = React.useState(0)
  const [range, setRange] = React.useState<[number, number]>([0, 0])
  const [max, setMax] = React.useState(1)
  React.useEffect(() => { setInterval(() => setMax(max => max + 1), 2000) }, [])
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
        maximumValue={max}
      />
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={13}
        value={value}
        CustomThumb={CustomThumb}
        step={2}
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
        CustomMark={CustomMark}
        thumbSize={8}
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
        maximumValue={max}
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
        range={[...range]}
        minimumValue={0}
        maximumValue={1}
      />
      <RangeSlider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        crossingAllowed
        range={range}
        step={1}
        CustomThumb={CustomThumb}
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
        CustomMark={CustomMark2}
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
