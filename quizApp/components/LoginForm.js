import React, {useRef, useContext, ActivityIndicator} from 'react'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {useForm} from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {AuthContext} from '../context/auth'
import Input from './Input'
import AuthButton from './AuthButton'
import Colors from '../constants/Colors'

const LoginForm = props => {
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigation = useNavigation()

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    // setValue,
  } = useForm({
    mode: 'all',
  })

  const email = register('email')
  const password = register('password')

  const onSubmit = data => {
    props.onSubmit(data)
  }
  return (
    <>
      <View style={styles.fieldArea}>
        <View style={styles.inputView}>
          <View style={styles.inputTextView}>
            <Icon style={styles.inputIcon} name="email" color="#4F8EF7" />
            <Input
              style={styles.input}
              control={control}
              name="email"
              placeholder="E-mail"
              rules={{
                required: 'This field is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Enter a valid email address',
                },
              }}
              ref={e => {
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
          </View>
        </View>
        <View>
          {errors.email && (
            <Text
              style={{
                color: Colors.secondary,
                fontSize: 14,
                marginTop: 10,
                marginLeft: 10,
              }}>
              {errors.email.message}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.fieldArea}>
        <View style={styles.inputView}>
          <View style={styles.inputTextView}>
            <Icon style={styles.inputIcon} name="vpn-key" color="#4F8EF7" />
            <Input
              style={styles.input}
              control={control}
              name="password"
              placeholder="Password"
              secureTextEntry={true}
              rules={{required: true, minLength: 6}}
              ref={e => {
                password.ref(e)
                passwordRef.current = e
              }}
              onSubmitEditing={() => {
                passwordRef.current.blur()
              }}
              blurOnSubmit={false}
            />
          </View>
        </View>
        <View>
          {errors.password && (
            <Text
              style={{
                color: Colors.secondary,
                fontSize: 14,
                marginTop: 10,
                marginLeft: 10,
              }}>
              This field is required
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate('forgotPassword')}>
        <Text style={styles.buttonText}>Forgot Password ?</Text>
      </TouchableOpacity>

      <AuthButton
        style={styles.buttonContainer}
        onPress={handleSubmit(onSubmit)}>
        LOGIN
      </AuthButton>

      {/* )}  */}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  fieldArea: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  inputView: {
    flexDirection: 'row',
    // alignItems: 'center',

    // justifyContent: 'center',
  },
  inputTextView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 20,
    height: 50,
    padding: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderRadius: 10,
    height: 50,
    color: 'white',
    flexBasis: '94%',
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  buttonContainer: {
    marginTop: 40,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fb5b5a',
    fontWeight: 'bold',
  },
})

export default LoginForm
