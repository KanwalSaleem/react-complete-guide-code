import React, {useState, useRef, useEffect, useContext} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native'

import AuthButton from '../components/AuthButton'
import Header from '../components/Header'
import Input from '../components/Input'
import {useForm} from 'react-hook-form'
import {CommonActions} from '@react-navigation/native'

import {AuthContext} from '../context/Auth'
import Colors from '../constants/Colors'

const ForgotPassword = ({navigation}) => {
  const emailRef = useRef()
  const passwordRef = useRef()

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    reset,
    // setValue,
  } = useForm({
    mode: 'all',
  })

  const email = register('email')

  const onSubmit = (data) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'otp'}],
      }),
    )
  }

  console.log(errors)

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={{backgroundColor: Colors.background}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.screen}>
          <Header />
          <View style={styles.logo}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
            />
          </View>

          <Input
            style={styles.input}
            control={control}
            rules={{
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            }}
            errors={errors.email}
            name="email"
            placeholder="Email"
            ref={(e) => {
              email.ref(e)
              emailRef.current = e
            }}
            onSubmitEditing={() => {
              passwordRef.current.focus()
            }}
            blurOnSubmit={false}
            returnKeyType="next"
            keyboardType="email-address"
          />

          <AuthButton
            style={styles.buttonContainer}
            onPress={handleSubmit(onSubmit)}>
            Proceed
          </AuthButton>

          <View style={styles.conditionContainer}>
            <Text style={styles.text} allowFontScaling={false}>
              Don’t have an account ?
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('signUpForm')}>
              <Text style={[styles.text, {color: Colors.primary}]}>
                Registration
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    marginHorizontal: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    marginTop: 20,
  },
  conditionContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    marginHorizontal: 2,
  },
  forgotText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: 'Inter-Regular',
    marginVertical: 10,
  },
  logoImage: {
    width: '100%',
    height: 30,
    marginTop: 20,
  },
})

export default ForgotPassword
