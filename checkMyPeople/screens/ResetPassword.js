import React, {useRef, useContext} from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import {Colors} from 'react-native/Libraries/NewAppScreen'
import AuthButton from '../components/AuthButton'
import Header from '../components/Header'
import Input from '../components/Input'
import {useForm} from 'react-hook-form'
import {CommonActions} from '@react-navigation/native'
import {AuthContext} from '../context/Auth'

const ResetPassword = ({navigation}) => {
  const {setLoggedIn} = useContext(AuthContext)

  const passwordRef = useRef()
  const confirmPasswordRef = useRef()

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    reset,
    watch,
    // setValue,
  } = useForm({
    mode: 'all',
  })

  const password = register('password')
  const confirmPassword = register('confirmPassword')

  const onSubmit = (data) => {
    console.log('data', data)
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'loginForm'}],
      }),
    )
  }

  console.log(errors)

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView>
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
            name="password"
            placeholder="Password"
            rules={{required: true, minLength: 6}}
            errors={errors.password}
            ref={(e) => {
              password.ref(e)
              passwordRef.current = e
            }}
            onSubmitEditing={() => {
              confirmPasswordRef.current.focus()
            }}
            blurOnSubmit={false}
            showPassword={true}
          />
          <Input
            style={styles.input}
            control={control}
            name="confirmPassword"
            placeholder="Confirm Password"
            rules={{
              required: true,
              minLength: 6,
              validate: {
                positive: (value) =>
                  value === watch('password') || 'The passwords do not match',
                // messages: (value) => !value && ['The passwords do not match'],
              },
            }}
            errors={errors.confirmPassword}
            ref={(e) => {
              confirmPassword.ref(e)
              confirmPasswordRef.current = e
            }}
            onSubmitEditing={() => {
              confirmPasswordRef.current.blur()
            }}
            blurOnSubmit={false}
            showPassword={true}
          />

          <AuthButton
            style={styles.buttonContainer}
            onPress={handleSubmit(onSubmit)}>
            Confirm
          </AuthButton>
          {/* <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('forgotPassword')}>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>
        <View style={styles.conditionContainer}>
          <Text style={styles.text}>Don’t have an account ?</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('signUpForm')}>
            <Text style={[styles.text, {color: Colors.primary}]}>
              Registration
            </Text>
          </TouchableOpacity>
        </View> */}
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
    marginBottom: 30,
    marginHorizontal: 20,
  },
  buttonContainer: {
    marginVertical: 10,
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

export default ResetPassword
