import React from 'react'
import {View, Image, StyleSheet, Text} from 'react-native'
import Colors from '../constants/Colors'

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Image
        style={styles.image}
        source={require('../assets/splashScreen.jpg')}
      /> */}
      <View style={styles.textView}>
        <Text style={styles.text}>
          Welcome to the World of MCQs A Virtual Book of MCQs For Preparation of
          One Paper MCQs / Screening Tests / Entry Tests / Lecturers{"'"} Tests
          / CSS / PMS / Competitive Exams {'&'} all other types of Jobs{'&'}{' '}
          Scholarships Tests
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#05a6d4',
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
  },

  image: {
    width: '80%',
    height: 200,
    resizeMode: 'cover',
  },
  textView: {
    width: '80%',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    fontSize: 20,
    color: Colors.secondary,
  },
})

export default SplashScreen
