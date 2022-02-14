import React, {useRef, useContext, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import fetch from 'node-fetch'

import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ActivityIndicator,
  ScrollView,
  BackHandler,
} from 'react-native'

import {Card} from 'react-native-paper'

import AuthButton from '../../components/AuthButton'
import Input from '../../components/Input'
import {useHttpClient} from '../../hooks/http-hook'
import {AppContext} from '../../context/auth'

import Colors from '../../constants/colors'

const Login = (props) => {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [isLoading, setIsLoading] = useState(false)
  // const window = useWindowDimensions()

  const {login} = useContext(AppContext)

  // const {sendRequest, clearError, error, isLoading} = useHttpClient()

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: {errors},
  } = useForm({mode: 'onSubmit'})

  const email = register('email')
  const password = register('password')

  const onSubmit = async (data) => {
    const {email, password} = data

    setIsLoading(true)
    try {
      const response = await fetch('https://deliverypay.in/api/userLogin', {
        method: 'POST',
        body: JSON.stringify({username: email, password}),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      const responseData = await response.json()
      console.log(response)

      if (!response.ok) {
        throw new Error(responseData.message)
      }
      const accessToken = response.headers.map['set-cookie']

      const regEx = accessToken.split(' ')

      // console.log(regEx[0])
      const cookie = regEx[0].replace('access_token=', '').replace(';', '')

      const {user} = responseData
      console.log(user)

      login({
        userId: user._id,
        deliverypayId: user.userId,
        userPhone: user.phone,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.profileImg,
        paymentMethods: user.paymentMethods,
        balance: user.balance,
        cookie,
        shopInfo: user.shopInfo,
        gst: user.gst,
        fbMarket: user.fbMarket,
      })
    } catch (e) {
      Alert.alert('Error', e.message)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    reset({
      email: `+913422396644`,
      password: '12345',
    })
  }, [reset])

  // useEffect(() => {
  //   if (error) {
  //     Alert.alert('Error', error, [{text: 'Okay', onPress: () => clearError()}])
  //   }
  // }, [error])

  // .then((response) => {
  //   login(response.user.userId, response.user.phone)

  //   props.navigation.navigate('otp')
  // })

  // console.log(data)
  // const fetchData = async () => {
  //   setIsLoading(true)
  //   try {
  //     const response = await fetch('https://deliverypay.in/api/userLogin', {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         username: email,
  //         password,
  //       }),
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //     })

  //     const resData = await response.json()
  //     console.log(resData)
  //   } catch (e) {
  //     console.log(e)
  //     setError(e)
  //   }
  //   setIsLoading(false)
  // }
  // fetchData()

  // if (error) {

  //   console.log(error)
  // }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.screen}>
        <ImageBackground
          source={require('../../assets/loginBackground.png')}
          style={{width: '100%', alignItems: 'center'}}>
          <View style={styles.blueBackground}>
            <Text style={styles.mainHeading}>Ensure the best and</Text>
            <Text style={styles.mainHeading}>secure transaction</Text>
            <Text style={styles.subHeading}>
              We ensure buyer and seller happiness
            </Text>
          </View>
          <Card style={[styles.card, {top: '25%'}]}>
            <Text style={styles.loginHeading}>Login Account</Text>
            <View
              style={[styles.inputContainer, errors.email && styles.redBorder]}>
              <Input
                name="email"
                control={control}
                rules={{
                  required: true,
                  // pattern: [
                  //   {value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/},
                  //   {value: /^[789]\d{9,9}$/g},
                  // ],
                  // pattern:
                  // eslint-disable-next-line no-useless-escape
                  // /^([0-9]{10})|([A-Za-z0-9._%\+\-]+@[a-z0-9.\-]+\.[a-z]{2,3})$/,
                }}
                keyboardType="email-address"
                placeholder="Email or Phone No"
                ref={(e) => {
                  email.ref(e)
                  emailRef.current = e
                }}
                onSubmitEditing={() => {
                  passwordRef.current.focus()
                }}
                blurOnSubmit={false}
                returnKeyType="next"
                placeholderTextColor={errors.email ? '#b55151' : '#53aefc'}
              />
            </View>
            <View
              style={[
                styles.inputContainer,
                errors.password && styles.redBorder,
              ]}>
              <Input
                name="password"
                control={control}
                rules={{
                  required: true,
                  // pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                }}
                secureTextEntry={true}
                placeholder="Password"
                ref={(e) => {
                  password.ref(e)
                  passwordRef.current = e
                }}
                onSubmitEditing={() => {
                  passwordRef.current.blur()
                  // Keyboard.dismiss()
                }}
                blurOnSubmit={false}
                returnKeyType="go"
                placeholderTextColor={errors.password ? '#b55151' : '#53aefc'}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('forgotPassword')
              }}
              activeOpacity={0.6}>
              <Text style={styles.forgetPassword}>Forget Password ?</Text>
            </TouchableOpacity>

            {isLoading ? (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={{marginTop: 35}}
              />
            ) : (
              <AuthButton
                style={{alignSelf: 'center'}}
                authButton={{width: 180}}
                onPress={handleSubmit(onSubmit)}>
                Log in
              </AuthButton>
            )}
          </Card>

          <View style={[styles.whiteBackground, {paddingTop: 80}]}>
            <Text
              style={[
                styles.loginHeading,
                {fontFamily: 'Poppins-Regular'},
              ]}>{`Don't Have an account?`}</Text>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('signup')
              }}
              activeOpacity={0.6}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    // alignItems: 'center',
  },
  mainHeading: {
    fontSize: 28,
    fontFamily: 'Poppins-Regular',
  },

  blueBackground: {
    paddingTop: 20,
    // backgroundColor: '#bce0fd',
    alignItems: 'center',
    // zIndex: -1,

    width: '100%',
    height: '65%',
    // top: 0,
  },
  subHeading: {
    color: '#8d949a',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginTop: 10,
  },
  card: {
    width: '75%',
    position: 'absolute',
    // top: window.height <= 700 ?  ,
    borderRadius: 35,
    paddingTop: 25,
    paddingBottom: 40,
    backgroundColor: 'white',
    // alignItems: 'center',
  },
  loginHeading: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    // fontWeight: '800',
    marginBottom: 20,
  },
  inputContainer: {
    borderRadius: 30,
    borderColor: Colors.lightBlue,
    borderWidth: 2,
    width: '80%',
    alignSelf: 'center',
    paddingLeft: 20,
    marginBottom: 20,
  },
  redBorder: {
    borderColor: '#c12323',
  },
  forgetPassword: {
    color: '#62b5fc',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },

  whiteBackground: {
    width: '100%',
    height: '35%',
    justifyContent: 'center',
    // backgroundColor: '#ffff',
    alignItems: 'center',
  },
  registerText: {
    color: Colors.accent,
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },
})

export default Login
