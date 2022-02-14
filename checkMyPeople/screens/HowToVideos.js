import React, {useRef, useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native'

import Video from 'react-native-video'
import Colors from '../constants/Colors'

const HowToVideos = (props) => {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.sectionHeading} allowFontScaling={false}>
        App Overview
      </Text>
      <TouchableOpacity
        style={styles.imageButton}
        onPress={() => props.navigation.navigate('appOverview')}
        activeOpacity={0.6}>
        <Image
          // resizeMethod="scale"
          resizeMode="contain"
          style={styles.backgroundVideo}
          source={require('../assets/App-Overview.png')}
        />
      </TouchableOpacity>
      <Text style={styles.sectionHeading} allowFontScaling={false}>
        How To Verify
      </Text>

      <TouchableOpacity
        style={styles.imageButton}
        activeOpacity={0.6}
        onPress={() => props.navigation.navigate('howToVerify')}>
        <Image
          style={styles.backgroundVideo}
          resizeMethod="scale"
          resizeMode="contain"
          source={require('../assets/how-to-verify.png')}
        />
      </TouchableOpacity>

      <Text style={styles.sectionHeading} allowFontScaling={false}>
        How to Load Wallet
      </Text>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.imageButton}
        onPress={() => props.navigation.navigate('loadAccountBalance')}>
        <Image
          resizeMode="contain"
          style={styles.backgroundVideo}
          source={require('../assets/load-account-balance.png')}
        />
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  imageButton: {
    width: '100%',
    // elevation: 5,
    height: 220,
    // alignItems: 'center',
    // justifyContent: 'center',
    // borderWidth: 0.5,
    // borderWidth: 0.5,
    // overflow: 'hidden',
    borderColor: 'lightgrey',
    borderRadius: 10,
    overflow: 'hidden',
  },
  backgroundVideo: {
    // position: 'absolute',
    aspectRatio: 16 / 9,
    alignSelf: 'center',
    // left: 0,
    // bottom: 0,
    // resizeMode: 'center',
    // right: 0,
    borderRadius: 10,
    width: '100%',
    height: 220,

    // alignSelf: 'center',
  },
  sectionHeading: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginVertical: 10,

    color: 'black',
  },
})

export default HowToVideos
