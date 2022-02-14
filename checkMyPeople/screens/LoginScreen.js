import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native'
import {Colors} from 'react-native/Libraries/NewAppScreen'
import AuthButton from '../components/AuthButton'
import Header from '../components/Header'
import {useNavigation} from '@react-navigation/native'

const LoginScreen = () => {
  const navigation = useNavigation()
  return (
    // <View style={styles.screen}>
    <ScrollView
      contentContainerStyle={{
        backgroundColor: '#E5E5E5',
        flexGrow: 1,
        paddingBottom: 170,
        alignItems: 'center',
        paddingTop: 20,
      }}>
      <Header />
      <View style={styles.logo}>
        <Image
          style={styles.logoImage}
          source={require('../assets/logo.png')}
        />
      </View>
      <AuthButton
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('loginForm')}>
        Login
      </AuthButton>
      <AuthButton
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('verifynin')}>
        Verify NIN
      </AuthButton>
      <View style={styles.conditionContainer}>
        <Text style={styles.text} allowFontScaling={false}>
          Don’t have an account ?
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('signUpForm')}>
          <Text
            style={[styles.text, {color: Colors.primary}]}
            allowFontScaling={false}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.supportContainer}>
        <Text style={styles.supportTitle} allowFontScaling={false}>
          Supported by
        </Text>
        <Image
          style={styles.supportImage}
          source={require('../assets/IVS.png')}
        />
      </View>
      <View style={styles.privacyContainer}>
        <Text style={styles.privacyTitle} allowFontScaling={false}>
          I have read, understood, and agree to
        </Text>
        {/* <Text style={[styles.privacyTitle, {color: Colors.primary}]}>
          Check My People
        </Text> */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{marginBottom: 10}}
          onPress={() => {
            Linking.openURL('https://checkmypeople.com/terms/')
          }}>
          <Text
            style={[
              styles.privacyTitle,
              {color: Colors.primary, textDecorationLine: 'underline'},
            ]}
            allowFontScaling={false}>
            Check My People “Terms {'&'} Conditions”
          </Text>
        </TouchableOpacity>
        <Text style={styles.privacyTitle} allowFontScaling={false}>
          {' '}
          and
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Linking.openURL('https://checkmypeople.com/privacy/')
          }}>
          <Text
            style={[
              styles.privacyTitle,
              {color: Colors.primary, textDecorationLine: 'underline'},
            ]}
            allowFontScaling={false}>
            {'Privacy Policy'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    // </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    // flexGrow: 1,
    backgroundColor: '#E5E5E5',
    // alignItems: 'center',
  },
  logo: {
    height: '40%',
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginHorizontal: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  conditionContainer: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginHorizontal: 2,
  },
  supportContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter-Regular',
  },
  supportImage: {
    marginTop: 10,
    width: 43,
    height: 21,
  },
  logoImage: {
    width: '100%',
    height: 30,
  },
  privacyContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',

    marginLeft: 20,
  },
  privacyTitle: {
    fontSize: 13,
    color: Colors.black,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 4,
  },
})

export default LoginScreen
