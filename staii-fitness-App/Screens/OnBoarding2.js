import React, {useContext} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native'
import Colors from '../Constants/Colors'
import AppContext from '../Context/AppContext'

const OnBoarding2 = (props) => {
  const {setAppIntro} = useContext(AppContext)
  const skipIntro = () => setAppIntro(true)
  return (
    <ImageBackground
      style={styles.screen}
      source={require('../assets/backgroundImg.png')}
      resizeMode="cover">
      <View style={styles.dotContainer}>
        <Text style={styles.dot}>{'\u25CF'}</Text>
        <Text style={[styles.dot, {color: Colors.white}]}>{'\u25CF'}</Text>
        <Text style={styles.dot}>{'\u25CF'}</Text>
      </View>
      <View>
        <Text style={styles.heading}>Master</Text>
        <Text style={styles.heading}>your</Text>
        <Text style={styles.heading}>technique</Text>
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>Tempus consequat</Text>
        <Text style={styles.message}>pharetra metus volutpat.</Text>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={skipIntro}>
          <Text style={styles.bottomTitle}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.next}>
          <Image source={require('../assets/next.png')} style={styles.image} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1},
  screen: {
    padding: 10,
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'flex-end',
  },
  heading: {
    color: Colors.lightGrey,
    fontSize: 40,
    fontFamily: 'KronaOne-Regular',
  },
  messageContainer: {marginVertical: 30},
  message: {
    color: Colors.lightGrey,
    fontSize: 20,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  bottomTitle: {
    color: Colors.lightBlue,
    fontSize: 25,
    fontFamily: 'Inter-Bold',
    fontWeight: '600',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 96,
    height: 19,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    color: Colors.lightBlack,
    fontSize: 26,
    fontFamily: 'Roboto-Regular',
    marginHorizontal: 5,
  },
})
export default OnBoarding2
