import React from 'react'
import { View, StyleSheet, AppRegistry, Platform } from 'react-native'
import Slider from './src'
import { name as appName } from './app.json'

const App = () => {
  return <View>
    <Slider
      onSlidingStart={value => console.log('start:', value)}
      onSlidingComplete={value => console.log('complete:', value)}
      onValueChange={value => console.log('change:', value)}
      style={styles.slider}
      minimumValue={0}
      maximumValue={1}
    />
    <Slider
      style={styles.slider}
      minimumValue={0}
      maximumValue={10}
      value={4}
      step={1}
      minimumTrackTintColor="blue"
      maximumTrackTintColor="red"
    />
    <Slider
      onSlidingStart={value => console.log('start:', value)}
      onSlidingComplete={value => console.log('complete:', value)}
      onValueChange={value => console.log('change:', value)}
      style={styles.slider}
      minimumValue={0}
      maximumValue={10}
      step={1}
    />
  </View>
}

const styles = StyleSheet.create({
  slider: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid'
  }
})

AppRegistry.registerComponent(appName, () => App)

if (Platform.OS === 'web') {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementsByTagName('body')[0]
  })
}
