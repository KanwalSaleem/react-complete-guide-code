import React, {useState, useContext} from 'react'
import {
  StyleSheet,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
  Image,
} from 'react-native'
import FormData from 'form-data'
import {GoogleSigninButton} from '@react-native-google-signin/google-signin'

import {LoginManager, AccessToken} from 'react-native-fbsdk-next'
import AsyncStorage from '@react-native-async-storage/async-storage'

import LoginForm from '../components/LoginForm'
import SignUpForm from '../components/SignupForm'
import {AuthContext} from '../context/auth'
import Colors from '../constants/Colors'

// import LoginApi from './LoginApi'

const LoginScreen = () => {
  const [loginMode, setLoginMode] = useState(true)
  const {login, signupApi, isLoading, googleSignIn, facebookSignIn} =
    useContext(AuthContext)
  // const {login} = useContext(AuthContext)
  const [data, setData] = useState([])
  const [is_Registered, setIs_Registered] = useState()
  const [isError, setIsError] = useState('')

  const onSubmit = data => {
    {
      loginMode ? login(data) : signupApi(data)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {isLoading === true ? (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.screen}>
          <Text style={styles.heading}>World MCQs</Text>

          {loginMode ? (
            <LoginForm onSubmit={onSubmit} />
          ) : (
            <SignUpForm onSubmit={onSubmit} />
          )}

          <TouchableOpacity onPress={onSubmit} activeOpacity={0.8}>
            {loginMode ? (
              <View style={styles.conditionContainer}>
                <Text style={styles.conditionText}>
                  Don{"'"}t have an account?
                </Text>
                <TouchableOpacity onPress={() => setLoginMode(prev => !prev)}>
                  <Text style={styles.signUpText}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.conditionContainer}>
                <Text style={styles.conditionText}>
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => setLoginMode(prev => !prev)}>
                  <Text style={styles.signUpText}> Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
          <View style={{paddingTop: 20}} activeOpacity={0.8}>
            {loginMode ? (
              <View style={styles.socialContainer}>
                <Text style={styles.conditionText}>Login with</Text>
                <View style={styles.socialView}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={googleSignIn}
                    style={{marginHorizontal: 10}}>
                    <Image
                      source={require('../assets/google.png')}
                      style={styles.socialIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={facebookSignIn}
                    style={{marginHorizontal: 10}}>
                    <Image
                      source={require('../assets/facebook.png')}
                      style={styles.socialIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      )}
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 46,
    color: '#fb5b5a',
    marginBottom: 40,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  inputTextView: {
    width: '70%',
    backgroundColor: '#465881',
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderRadius: 10,
    height: 50,
    color: 'white',
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  buttonContainer: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
  socialContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  socialView: {
    marginTop: 10,
    flexDirection: 'row',
  },
  socialAccountView: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  socialIcon: {
    width: 55,
    height: 55,
  },
  conditionContainer: {
    flexDirection: 'row',
  },
  conditionText: {
    color: 'white',
    fontSize: 16,
  },
  signUpText: {
    color: '#fb5b5a',
    fontWeight: '700',
    fontSize: 16,
  },
})

export default LoginScreen
