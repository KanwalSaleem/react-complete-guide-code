import React, {useRef, useState, useEffect} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import {useForm} from 'react-hook-form'
import {Checkbox} from 'react-native-paper'

import AuthButton from '../../components/AuthButton'
import Input from '../../components/Input'

import {useHttpClient} from '../../hooks/http-hook'

import Colors from '../../constants/colors'

const SignUp = (props) => {
  const [checked, setChecked] = useState(false)
  const fullNameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const phoneNumberRef = useRef()
  const confirmPasswordRef = useRef()
  const {sendRequest, clearError, error, isLoading} = useHttpClient()

  const {
    control,
    handleSubmit,
    register,
    watch,

    formState: {errors},
  } = useForm({mode: 'onSubmit'})
  const fullName = register('fullName', {minLength: 8})
  const email = register('email')
  const phoneNumber = register('phoneNumber')
  const password = register('password')
  const confirmPassword = register('confirmPassword')

  const onSubmit = (data) => {
    const [firstName, lastName] = data.fullName.split(' ')

    const userData = {
      firstName,
      lastName,
      phone: data.phoneNumber,
      email: data.email,
      password: data.password,
    }

    // sendRequest(
    //   'https://deliverypay.in/api/registerUser',
    //   'POST',
    //   JSON.stringify(userData),
    //   {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // )
    //   .then((response) => {
    //     console.log(response, 'response')
    //     props.navigation.navigate('otp')
    //   })
    //   .catch((e) => {})

    console.log(userData)
    sendRequest(
      'https://deliverypay.in/api/sendPhoneVerificationCode',
      'POST',
      JSON.stringify({
        phone: userData.phone,
      }),
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    )
      .then((response) => {
        if (error) {
          return Alert.alert('Error', error, [
            {text: 'Okay', onPress: () => clearError()},
          ])
        }
        console.log(response)
        if (!error) {
          props.navigation.navigate('otp', {
            userData,
          })
        }
      })
      .catch((e) => e)
  }

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{text: 'Okay', onPress: () => clearError()}])
    }
  }, [error])

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={styles.screen}>
        <Image source={require('../../assets/signupImage.png')} />
        <Text style={styles.loginHeading}>Create ur Account </Text>

        <View
          style={[styles.inputContainer, errors.fullName && styles.redBorder]}>
          <Input
            name="fullName"
            control={control}
            rules={{
              required: true,
              pattern: /^([\w]{3,})+\s+([\w\s]{3,})+$/i,
            }}
            placeholder="Full Name"
            ref={(e) => {
              fullName.ref(e)

              fullNameRef.current = e
            }}
            onSubmitEditing={() => {
              emailRef.current.focus()
            }}
            blurOnSubmit={false}
            returnKeyType="next"
            placeholderTextColor={errors.fullName ? '#b55151' : '#53aefc'}
          />
        </View>
        <View style={[styles.inputContainer, errors.email && styles.redBorder]}>
          <Input
            name="email"
            control={control}
            rules={{
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            }}
            placeholder="Email"
            ref={(e) => {
              email.ref(e)
              emailRef.current = e
            }}
            onSubmitEditing={() => {
              phoneNumberRef.current.focus()
            }}
            keyboardType="email-address"
            blurOnSubmit={false}
            returnKeyType="next"
            placeholderTextColor={errors.email ? '#b55151' : '#53aefc'}
          />
        </View>
        <View
          style={[
            styles.inputContainer,
            errors.phoneNumber && styles.redBorder,
          ]}>
          <Input
            name="phoneNumber"
            control={control}
            rules={{
              required: true,
              // pattern: /^[789]\d{9,9}$/g,
            }}
            placeholder="Phone No."
            ref={(e) => {
              phoneNumber.ref(e)
              phoneNumberRef.current = e
            }}
            onSubmitEditing={() => {
              passwordRef.current.focus()
            }}
            keyboardType="phone-pad"
            blurOnSubmit={false}
            returnKeyType="next"
            placeholderTextColor={
              errors.phoneNumber ? Colors.errorColor : '#53aefc'
            }
          />
        </View>
        <View
          style={[styles.inputContainer, errors.password && styles.redBorder]}>
          <Input
            name="password"
            control={control}
            rules={{
              required: true,
            }}
            placeholder="Password"
            ref={(e) => {
              password.ref(e)
              passwordRef.current = e
            }}
            onSubmitEditing={() => {
              confirmPasswordRef.current.focus()
            }}
            secureTextEntry={true}
            blurOnSubmit={false}
            returnKeyType="next"
            placeholderTextColor={errors.password ? '#b55151' : '#53aefc'}
          />
        </View>
        <View
          style={[
            styles.inputContainer,
            errors.confirmPassword && styles.redBorder,
          ]}>
          <Input
            name="confirmPassword"
            control={control}
            rules={{
              required: true,
              validate: (value) =>
                value === watch('password') || 'The passwords do not match',
            }}
            placeholder="Confirm Password"
            secureTextEntry={true}
            ref={(e) => {
              confirmPassword.ref(e)
              confirmPasswordRef.current = e
            }}
            onSubmitEditing={() => {
              confirmPasswordRef.current.blur()
            }}
            blurOnSubmit={false}
            returnKeyType="go"
            placeholderTextColor={
              errors.confirmPassword ? '#b55151' : '#53aefc'
            }
          />
        </View>
        <View style={styles.agreementContainer}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked((prev) => !prev)
            }}
            color={'#53aefc'}
            uncheckedColor={'#53aefc'}
          />
          <View style={styles.agreeTextContainer}>
            <Text style={styles.agreeText}>I accept to the terms and</Text>
            <Text
              style={styles.agreeText}>{`conditions & privacy policy`}</Text>
          </View>
        </View>
        {!isLoading ? (
          <AuthButton
            style={{width: '70%', alignSelf: 'center'}}
            authButton={styles.authButton}
            authButtonText={{fontSize: 16}}
            onPress={handleSubmit(onSubmit)}
            disabled={!checked}>
            Register
          </AuthButton>
        ) : (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{marginTop: 35}}
          />
        )}
        <View style={styles.loginSection}>
          <Text style={styles.alreadyAccountText}>
            Already have an account?
          </Text>
          <TouchableOpacity
            style={{marginLeft: -20}}
            onPress={() => props.navigation.navigate('login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8faff',
    // alignItems: 'center',
  },
  loginHeading: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    // fontWeight: '800',
    marginBottom: 25,
    // marginTop: 25,
  },
  inputContainer: {
    borderRadius: 30,
    borderColor: Colors.lightBlue,
    borderWidth: 2,
    width: '70%',
    alignSelf: 'center',
    paddingLeft: 20,
    marginBottom: 20,
  },
  redBorder: {
    borderColor: Colors.errorColor,
  },
  agreementContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: -30,
    alignSelf: 'center',
  },
  agreeText: {
    color: '#53aefc',
    textAlign: 'left',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  authButton: {
    width: 200,
    padding: 15,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
  },
  alreadyAccountText: {
    fontSize: 22,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: Colors.accent,
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },
})

export default SignUp
