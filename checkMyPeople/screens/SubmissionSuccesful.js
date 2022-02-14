import React from 'react'
import {
  View,
  Image,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import AuthButton from '../components/AuthButton'
import fonts from '../constants/fonts'

const SubmissionSuccessful = (props) => {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        <Image
          source={require('../assets/checked.png')}
          style={styles.checked}
        />
        <Text style={styles.greetHeading} allowFontScaling={false}>
          Welcome To CheckMyPeople
        </Text>
        <Text style={fonts.paragraph} allowFontScaling={false}>
          Your submission was successful. An email has been sent to you, please
          check your email to complete your registration.
        </Text>
        <Text style={fonts.paragraph} allowFontScaling={false}>
          Please make sure you find the email sent to you and click on the
          Verify link.
        </Text>
        <Text style={fonts.paragraph} allowFontScaling={false}>
          Failing to do so will not grant you access to the app.
        </Text>
        <Text style={fonts.paragraph} allowFontScaling={false}>
          If you do not find an email from Checkmypeople in your inbox, look in
          the Junk Folder.
        </Text>

        <AuthButton
          style={[styles.button, {marginTop: 40}]}
          onPress={() => props.navigation.navigate('profile')}>
          Go To Profile
        </AuthButton>
        <AuthButton
          style={styles.button}
          onPress={() => props.navigation.navigate('verifynin')}>
          Verify NIN
        </AuthButton>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#E5E5E5',
  },
  checked: {
    width: 82,
    height: 82,
  },
  greetHeading: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: 'black',
    textAlign: 'center',
    marginVertical: 30,
  },
  button: {
    marginTop: 20,
  },
})

export default SubmissionSuccessful
