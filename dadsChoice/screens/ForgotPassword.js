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
  ActivityIndicator,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {APIURL} from '../constants/url'

import fetch from 'node-fetch'

import {useForm} from 'react-hook-form'

import Input from '../components/Input'

import {setLang} from '../store/actions/language'

import Colors from '../constants/Colors'

import AuthButton from '../components/AuthButton'
import {useSelector} from 'react-redux'

const ForgotPassword = (props) => {
  const {
    handleSubmit,
    formState: {errors},
    control,
    register,
    // setValue,
  } = useForm({mode: 'all'})
  const [loading, setLoading] = useState(false)
  const {token} = useSelector((state) => state.auth)

  const emailRef = useRef()
  const email = register('email')

  const {language, 
          Enter_Email,
          Reset_Password,
          Dont_Have_Account,
          Sign_Up} = useSelector(
    (state) => {     
         return state.language
        }
  )

  const onSubmit = async (data) => {
    // eslint-disable-next-line no-undef
    const headers = new Headers()

    console.log(data)
    headers.append('Accept', 'application/json')

    // eslint-disable-next-line no-undef
    const formData = new FormData()
    formData.append('email', data.email)

    console.log(formData)
    try {
      setLoading(true)

      const response = await fetch(`${APIURL}/api/password-reset`, {
        method: 'POST',
        headers,
        body: formData,
      })
      console.log(response)
      const resData = await response.json()
      console.log(resData)

      if (!response.ok) {
        throw new Error(resData.message)
      }
      console.log(response.status)
      // if (resData.data)
      //   Alert.alert('Success', 'Password has been sent your Email Address', [
      //     {text: 'Okay', style: 'cancel'},
      //   ])

      // eslint-disable-next-line no-undef
    } catch (e) {
      console.log(e)
      Alert.alert('Error', e.message, [{text: 'Okay'}])
    }

    setLoading(false)
  }

  return (
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
                emailRef.current.blur()
              }}
              blurOnSubmit={false}
            />
          </View>
          {errors.email && (
            <Text style={styles.errorText}>This field is required</Text>
          )}
        </View>
        {loading ? (
          <ActivityIndicator style={{marginTop: 15}} color={Colors.primary} />
        ) : (
          <AuthButton style={{marginTop: 15}} onPress={handleSubmit(onSubmit)}>
            {Reset_Password}
          </AuthButton>
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
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  topImage: {},
  inputContainer: {
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
    padding: 5,
    minWidth: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,

    // height: 50,
    // minHeight: 50,
    // marginVertical: 10,
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

export default ForgotPassword
