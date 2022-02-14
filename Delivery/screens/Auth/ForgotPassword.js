import React, {useRef, useContext, useEffect} from 'react'
import {useForm} from 'react-hook-form'

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
} from 'react-native'

import {Card} from 'react-native-paper'

import AuthButton from '../../components/AuthButton'
import Input from '../../components/Input'
import {useHttpClient} from '../../hooks/http-hook'
import {AppContext} from '../../context/auth'

import Colors from '../../constants/colors'
import {SafeAreaView} from 'react-native-safe-area-context'
import colors from '../../constants/colors'

const ForgotPassword = (props) => {
  const emailRef = useRef()

  // const window = useWindowDimensions()

  const {login, userForgotPassword} = useContext(AppContext)

  const {sendRequest, clearError, error, isLoading} = useHttpClient()

  const {
    control,
    handleSubmit,
    register,
    formState: {errors},
  } = useForm({mode: 'onSubmit'})

  const email = register('email')

  const onSubmit = async (data) => {
    const {email} = data

    try {
      const responseData = await sendRequest(
        'https://deliverypay.in/api/sendUserForgotPassOTP',
        'POST',
        JSON.stringify({phone: email}),
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      )
      console.log(responseData)
      login(null, email)
      if (responseData) {
        userForgotPassword()
        props.navigation.navigate('otp')
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
    // if (error) {
    //   Alert.alert('Error', error, [{text: 'Okay', onPress: () => clearError()}])
    // }
  }
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{text: 'Okay', onPress: () => clearError()}])
    }
  }, [error])

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={{backgroundColor: colors.commonBackgroundColor, flex: 1}}>
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
            <Card style={[styles.card, {marginTop: '55%'}]}>
              <Text style={styles.loginHeading}>Login Account</Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.email && styles.redBorder,
                ]}>
                <Input
                  name="email"
                  control={control}
                  rules={{
                    required: true,
                    // pattern: [
                    //   {value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/},
                    //   {value: /^[789]\d{9,9}$/g},
                    // ],
                    pattern:
                      // eslint-disable-next-line no-useless-escape
                      /^([0-9]{10})|([A-Za-z0-9._%\+\-]+@[a-z0-9.\-]+\.[a-z]{2,3})$/,
                  }}
                  keyboardType="email-address"
                  placeholder="Email or Phone No"
                  ref={(e) => {
                    email.ref(e)
                    emailRef.current = e
                  }}
                  onSubmitEditing={() => {
                    emailRef.current.dismiss()
                  }}
                  blurOnSubmit={false}
                  returnKeyType="next"
                  placeholderTextColor={errors.email ? '#b55151' : '#53aefc'}
                />
              </View>
              {/* <View
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
            </View> */}
              {/* <TouchableOpacity onPress={() => {}} activeOpacity={0.6}>
              <Text style={styles.forgetPassword}>Forget Password ?</Text>
            </TouchableOpacity> */}

              {isLoading ? (
                <ActivityIndicator
                  size="large"
                  color={Colors.primary}
                  style={{marginTop: 35}}
                />
              ) : (
                <AuthButton
                  style={{alignSelf: 'center'}}
                  authButton={{width: 200, marginTop: 30}}
                  onPress={handleSubmit(onSubmit)}>
                  Send Password
                </AuthButton>
              )}
            </Card>

            <View style={[styles.whiteBackground, {paddingTop: 80}]}>
              <Text
                style={[
                  styles.loginHeading,
                  {fontFamily: 'Poppins-Regular', marginTop: 30},
                ]}>{`Already have an account?`}</Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('login')
                }}
                activeOpacity={0.6}>
                <Text style={styles.registerText}>Login</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
    paddingTop: 40,
    // paddingBottom: 40,
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
    flexGrow: 1,
    // justifyContent: 'center',
    // backgroundColor: '#ffff',
    alignItems: 'center',
  },
  registerText: {
    color: Colors.accent,
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },
})

export default ForgotPassword
