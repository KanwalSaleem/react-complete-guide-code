import React, {useRef} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native'
import {Controller, useForm} from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../constants/Colors'

import {useNavigation} from '@react-navigation/native'

const ForgotPassword = (props) => {
  const navigation = useNavigation()
  const emailRef = useRef()

  const {
    control,
    handleSubmit,
    register,
    formState: {errors},
  } = useForm({
    mode: 'all',
  })

  const email = register('email')

  const onSubmit = async (data) => {
    props.navigation.navigate('otp', {
      forgotPassword: true,
      email: data.email,
    })

    console.log(data, 'data')
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.mainScreen}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          style={styles.iconView}>
          <Icon
            name="arrow-back-ios"
            color={Colors.backgroundColor}
            size={20}
          />
        </TouchableOpacity>
        <View style={styles.screen}>
          <Image
            source={require('../assets/signUpIcon.jpg')}
            style={styles.image}
          />
          <Text style={styles.signInTitle}>Forgot Password</Text>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldView}>
              <Icon name="person" color="black" size={20} />

              <Controller
                control={control}
                name="email"
                rules={{
                  required: true,
                  pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                }}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Email ID/ Phone Number"
                    ref={(e) => {
                      email.ref(e)
                      emailRef.current = e
                    }}
                    onSubmitEditing={() => {
                      emailRef.current.blur()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholderTextColor="black"
                    style={{flexBasis: '90%', marginLeft: 10}}
                  />
                )}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.buttonView}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Continue</Text>
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
    paddingTop: 30,
  },
  screen: {
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 30,
  },
  iconView: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',

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
export default ForgotPassword
