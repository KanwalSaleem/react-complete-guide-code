import React, {useState, useRef, useEffect} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native'
import {useForm} from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import {Profile, LoginManager} from 'react-native-fbsdk-next'

import {ActivityIndicator} from 'react-native-paper'

import {useNavigation} from '@react-navigation/native'
import Input from '../components/Input'
import AuthButton from '../components/AuthButton'

import Colors from '../constants/Colors'
import {APIURL} from '../constants/url'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useDispatch, useSelector} from 'react-redux'
import {login} from '../store/actions/auth'

import {getLocation} from '../store/actions/location'

const SignIn = () => {
  const location = useSelector((state) => state.location)
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const emailRef = useRef()
  const passwordRef = useRef()
  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,

    register,
    setValue,
    formState: {errors},
  } = useForm({
    mode: 'all',
  })

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userDetails = await GoogleSignin.signIn()
      navigation.navigate('signUp', {
        firstName: userDetails.user.givenName,
        lastName: userDetails.user.familyName,
        email: userDetails.user.email,
      })

      console.log(userDetails.user.email)
    } catch (error) {
      console.log(error.code)
      console.log(error)
      Alert.alert(error.message)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        // Alert.alert('Play services not available or outdated')
      }
    }
  }
  const facebookSignIn = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled')
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          )
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error)
      },
    )
    Profile.getCurrentProfile().then(function (currentProfile) {
      if (currentProfile) {
        navigation.navigate('signUp', {
          email: currentProfile.email,
          firstName: currentProfile.firstName,
          lastName: currentProfile.lastName,
        })
        currentProfile.email
        console.log(
          'The current logged user is: ' +
            currentProfile.name +
            '. His profile id is: ' +
            currentProfile.userID,
          'email' + currentProfile.email,
        )
      }
    })
  }

  const email = register('email')
  const password = register('password')

  const onSubmit = async (data) => {
    const formData = new FormData()

    const pushToken = await AsyncStorage.getItem('pushId')
    const token = JSON.parse(pushToken)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('notification_token', token)
    setLoading(true)
    try {
      const response = await fetch(`${APIURL}/api/login`, {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      })

      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.message)
      }
      console.log(resData)

      ToastAndroid.showWithGravity(
        resData.message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      )
      dispatch(login(resData.data['user-data'], resData.data.token))
      // setUser(resData.data['user-data'])
    } catch (e) {
      if (e.message === 'Unauthenticate!') {
        ToastAndroid.showWithGravity(
          'E-mail or Password is not correct',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      }
    }
    setLoading(false)
  }

  // useEffect(() => {
  //   register('location', {required: true})

  //   if (errors.location) {
  //     Alert.alert('', 'Location is required to sign up.')
  //   }
  // }, [errors.location, register])

  useEffect(() => {
    setValue('location', {
      longitude: location.longitude,
      latitude: location.latitude,
    })
  }, [location.latitude, location.longitude, setValue])

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.mainScreen}>
        <View style={styles.screen}>
          <Image
            source={require('../assets/signUpIcon.jpg')}
            style={styles.image}
          />
          <Text style={styles.signInTitle}>Welcome Back!</Text>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldView}>
              <Icon name="person" color="black" size={20} />

              <Input
                control={control}
                name="email"
                rules={{
                  required: true,
                  pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                }}
                keyboardType="email-address"
                placeholder="Email ID"
                ref={(e) => {
                  email.ref(e)
                  emailRef.current = e
                }}
                onSubmitEditing={() => {
                  passwordRef.current.focus()
                }}
                blurOnSubmit={false}
                returnKeyType="next"
                placeholderTextColor="black"
                style={{flexBasis: '90%', marginLeft: 10}}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>This field is required</Text>
            )}

            <View style={[styles.fieldView, {justifyContent: 'space-between'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="lock" color="black" size={20} />

                <Input
                  control={control}
                  name="password"
                  rules={{required: true}}
                  placeholder="Password"
                  ref={(e) => {
                    password.ref(e)
                    passwordRef.current = e
                  }}
                  onSubmitEditing={() => {
                    passwordRef.current.blur()
                  }}
                  blurOnSubmit={false}
                  returnKeyType="go"
                  secureTextEntry={true}
                  placeholderTextColor="black"
                  style={{flexBasis: '90%', marginLeft: 10}}
                />
              </View>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          {loading ? (
            <ActivityIndicator
              color={Colors.primary}
              style={{marginVertical: 20, height: 40}}
            />
          ) : (
            <AuthButton
              style={styles.buttonView}
              onPress={handleSubmit(onSubmit)}>
              Sign In
            </AuthButton>
          )}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => navigation.navigate('forgetPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={styles.socialContainer}>
            <Text style={styles.socialText}>Connect with social account</Text>
            <View style={styles.socialAccountView}>
              <TouchableOpacity
                onPress={googleSignIn}
                style={styles.socialIconView}>
                <Image
                  source={require('../assets/google.png')}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={facebookSignIn}
                style={[styles.socialIconView, {marginLeft: 10}]}>
                <Image
                  source={require('../assets/facebook.png')}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',

            marginTop: 10,
          }}>
          <Text style={styles.signInConditionText}>Dont have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('signUp')
            }}>
            <Text style={styles.signInText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flexGrow: 1,

    backgroundColor: Colors.black,
    paddingHorizontal: 10,

    paddingTop: 30,
    justifyContent: 'space-evenly',
  },
  screen: {
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginTop: -50,
    borderWidth: 10,
    borderColor: 'white',
  },
  signInTitle: {
    marginVertical: 18,
    fontSize: 26,

    fontFamily: 'Roboto-Medium',
  },
  fieldContainer: {},
  fieldView: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: 'grey',
    marginBottom: 20,
  },
  errorText: {
    color: Colors.primary,
    fontFamily: 'OpenSans-Regular',
  },
  buttonView: {
    marginVertical: 20,
    width: '80%',
    height: 40,
    backgroundColor: 'red',
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  buttonText: {
    color: 'white',

    fontFamily: 'OpenSans-Bold',
  },
  forgotPasswordContainer: {
    marginVertical: 30,
  },
  forgotPasswordText: {
    color: Colors.primary,

    fontFamily: 'Roboto-Bold',
  },

  signInConditionText: {
    fontFamily: 'OpenSans-Regular',
    color: Colors.backgroundColor,
    fontSize: 16,
  },
  signInText: {
    paddingLeft: 5,
    color: Colors.primary,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  socialContainer: {
    alignItems: 'center',
  },
  socialAccountView: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  socialIconView: {
    borderWidth: 0.5,
    borderRadius: 50,

    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 37,
    height: 37,
  },
  socialText: {
    fontFamily: 'OpenSans-Regular',
  },
})
export default SignIn
