import React, {useState, useRef} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ToastAndroid,
} from 'react-native'
import {Controller, useForm} from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../constants/Colors'

import {useNavigation} from '@react-navigation/native'
import {APIURL} from '../constants/url'

const ResetPassword = (props) => {
  const navigation = useNavigation()
  const [passwordVisibilty, setPasswordVisibility] = useState(true)

  const passwordRef = useRef()
  const confirmPasswordRef = useRef()

  const {
    control,
    handleSubmit,

    register,

    watch,
    formState: {errors},
  } = useForm({
    mode: 'all',
  })

  const password = register('password')
  const confirmPassword = register('confirmPassword', {
    validate: (value) => {
      return value === watch('password') || 'The passwords do not match'
    },
  })

  const onSubmit = async (data) => {
    console.log(data, 'data')

    const formData = new FormData()

    formData.append('OTP', props.route.params.otp)
    formData.append('password', data.password)

    const headers = new Headers()

    headers.append('Accept', 'Application/json')

    try {
      const response = await fetch(`${APIURL}/api/change-password`, {
        method: 'POST',
        body: formData,
        headers,
      })

      const resData = await response.json()
      if (!response.ok) {
        console.log(resData)
        throw new Error(resData.message)
      }
      console.log(resData)

      ToastAndroid.showWithGravity(
        resData.message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      )
      navigation.reset({
        index: 0,
        routes: [{name: 'signIn'}],
      })
    } catch (e) {
      ToastAndroid.showWithGravity(
        e.message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      )
    }
  }

  console.log(errors)

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.mainScreen}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('signIn')
          }}
          style={styles.iconView}>
          <Icon
            name="arrow-back-ios"
            color={Colors.backgroundColor}
            size={20}
            style={{paddingLeft: 5}}
          />
        </TouchableOpacity>
        <View style={styles.screen}>
          <Image
            source={require('../assets/signUpIcon.jpg')}
            style={styles.image}
          />
          <Text style={styles.signInTitle}>Reset Password</Text>
          <View style={styles.fieldContainer}>
            <View style={[styles.fieldView, {justifyContent: 'space-between'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="lock" color="black" size={20} />

                <Controller
                  control={control}
                  name="password"
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="New Password"
                      ref={(e) => {
                        password.ref(e)
                        passwordRef.current = e
                      }}
                      onSubmitEditing={() => {
                        confirmPasswordRef.current.focus()
                      }}
                      blurOnSubmit={false}
                      returnKeyType="next"
                      secureTextEntry={passwordVisibilty}
                      placeholderTextColor="black"
                      style={{flexBasis: '90%'}}
                    />
                  )}
                />
              </View>
              <TouchableOpacity onPress={() => setPasswordVisibility(false)}>
                <Icon name="visibility-off" color="black" size={20} />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>This field is required</Text>
            )}

            <View style={[styles.fieldView, {justifyContent: 'space-between'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  style={styles.inputIcon}
                  name="lock"
                  color="black"
                  size={20}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: true,
                    validate: (value) => {
                      return (
                        value === watch('password') ||
                        'The passwords do not match'
                      )
                    },
                  }}
                  render={({field: {value, onChange}}) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Confirm New Password"
                      ref={(e) => {
                        confirmPassword.ref(e)
                        confirmPasswordRef.current = e
                      }}
                      onSubmitEditing={() => {
                        confirmPasswordRef.current.blur()
                      }}
                      blurOnSubmit={false}
                      returnKeyType="go"
                      secureTextEntry={passwordVisibilty}
                      placeholderTextColor="black"
                      style={{flexBasis: '90%'}}
                    />
                  )}
                />
              </View>
              <TouchableOpacity onPress={() => setPasswordVisibility(false)}>
                <Icon name="visibility-off" color="black" size={20} />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>Password does not match</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.buttonView}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,

    backgroundColor: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  screen: {
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  iconView: {
    backgroundColor: Colors.primary,
    width: '12%',
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    marginBottom: 20,
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
    marginVertical: 30,
    fontSize: 18,

    fontFamily: 'OpenSans-Bold',
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
})
export default ResetPassword
