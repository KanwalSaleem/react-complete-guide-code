import React, {useRef, useState} from 'react'
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'
import fetch from 'node-fetch'

import {useForm} from 'react-hook-form'
import {useDispatch, useSelector} from 'react-redux'

import {login} from '../store/actions/auth'
import Input from '../components/Input'
import Colors from '../constants/Colors'
import {APIURL} from '../constants/url'
import AuthButton from '../components/AuthButton'
import {setUserPushId} from '../store/actions/user'
import {setLang} from '../store/actions/language'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SignInScreen = (props) => {
  const [loading, setLoading] = useState(false)
  const {
    language,
    changeLanguage,
    notification,
    editProfile,
    Enter_Email,
    Enter_Password,
    Forget_Password,
    SignIn,
    Dont_Have_Account,
    Sign_Up,
  } = useSelector((state) => {
    return state.language
  })
  const {
    handleSubmit,
    formState: {errors},
    control,
    register,
  } = useForm({mode: 'all'})
  const dispatch = useDispatch()

  const emailRef = useRef()
  const passwordRef = useRef()

  const email = register('email')
  const password = register('password')

  const onSubmit = async (data) => {
    // eslint-disable-next-line no-undef
    const headers = new Headers()

    headers.append('Accept', 'application/json')

    // eslint-disable-next-line no-undef
    const formData = new FormData()

    formData.append('email', data.email)
    formData.append('password', data.password)

    const requestOptions = {
      method: 'POST',
      headers,
      body: formData,
      redirect: 'follow',
    }

    try {
      setLoading(true)
      // eslint-disable-next-line no-undef
      const response = await fetch(`${APIURL}/api/login`, requestOptions)

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message)
      }

      const {
        data: {token, user_data},
      } = resData

      if (user_data.role_id === 3 && user_data.status === 'inactive') {
        setLoading(false)
        props.navigation.navigate('notActivated')
      } else {
        dispatch(login(user_data.id, token, user_data.role_id))
        sendToken(token)
      }

      // eslint-disable-next-line no-undef
    } catch (e) {
      Alert.alert('Error', e.message, [{text: 'Okay'}])
    }

    setLoading(false)
  }

  const sendToken = async (token) => {
    try {
      // eslint-disable-next-line no-undef
      const headers = new Headers()

      headers.append('Authorization', `Bearer ${token}`)
      headers.append('Accept', 'application/json')

      // eslint-disable-next-line no-undef
      const formData = new FormData()
      const pushToken = await AsyncStorage.getItem('pushId')

      // const parsedToken = JSON.parse(pushToken)
      formData.append('device_token', pushToken)

      const response = await fetch(`${APIURL}/api/device-token`, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        console.log(response)
        // throw new Error(resData.message)
      }
      const resData = await response.json()

      console.log(resData)
      dispatch(setUserPushId(pushToken))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.screen}>
          <Image
            source={require('../assets/images/img_bg.png')}
            style={styles.topImage}
          />
          <Image
            source={require('../assets/logo.png')}
            resizeMode="contain"
            style={{width: 350, height: 150, marginBottom: 10}}
          />
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Icon name="email" size={25} style={styles.inputIcon} />
              <Input
                control={control}
                name="email"
                placeholder={Enter_Email}
                style={styles.input}
                rules={{
                  required: true,
                  pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                }}
                keyboardType="email-address"
                ref={(e) => {
                  email.ref(e)
                  emailRef.current = e
                }}
                onSubmitEditing={() => {
                  passwordRef.current.focus()
                }}
                blurOnSubmit={false}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Icon name="lock" size={25} style={styles.inputIcon} />
              <Input
                control={control}
                name="password"
                placeholder={Enter_Password}
                style={styles.input}
                rules={{
                  required: true,
                }}
                secureTextEntry={true}
                ref={(e) => {
                  password.ref(e)
                  passwordRef.current = e
                }}
                onSubmitEditing={() => {
                  passwordRef.current.focus()
                }}
                blurOnSubmit={false}
              />
            </View>
            {errors.password && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.forgotButton}
            activeOpacity={0.6}
            onPress={() => props.navigation.navigate('forgotPassword')}>
            <Text style={styles.forgotText}>{Forget_Password}</Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator color={Colors.primary} size={'large'} />
          ) : (
            <AuthButton onPress={handleSubmit(onSubmit)}>{SignIn}</AuthButton>
          )}
          <View style={styles.optionSection}>
            <Text style={styles.forgotText}>{Dont_Have_Account}</Text>
            <TouchableOpacity
              style={styles.forgotButton}
              activeOpacity={0.6}
              onPress={() => props.navigation.navigate('signup')}>
              <Text style={styles.signUpText}>{Sign_Up}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
  },
  topImage: {
    width: '100%',
  },
  inputContainer: {
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
    padding: 5,
    minWidth: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  input: {
    fontSize: 16,
    flexBasis: '66%',
  },
  inputIcon: {
    color: Colors.darkGrey,
    marginRight: 10,
  },
  fieldArea: {
    marginVertical: 10,
    alignItems: 'flex-start',
  },
  errorText: {
    color: 'red',
  },
  forgotButton: {
    marginTop: 15,
    marginBottom: 22,
  },
  forgotText: {
    color: Colors.darkGrey,
    fontSize: 15,
  },
  optionSection: {
    marginTop: 25,
    alignItems: 'center',
  },
  signUpText: {
    color: Colors.secondGreen,
    fontSize: 16,
  },
})

export default SignInScreen
