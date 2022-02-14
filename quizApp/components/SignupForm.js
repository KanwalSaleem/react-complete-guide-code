import React, {useRef, useContext, useState, useEffect} from 'react'
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native'

import {useForm, Controller} from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Picker} from '@react-native-picker/picker'
import Input from '../components/Input'

import AuthButton from './AuthButton'
import {AuthContext} from '../context/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useNavigation} from '@react-navigation/native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {
  Modal,
  RadioButton,
  Portal,
  Button,
  Checkbox,
  ActivityIndicator,
  Alert,
} from 'react-native-paper'
import Colors from '../constants/Colors'

const SignUpForm = props => {
  const countryCodes = [
    '+01',
    '+92',
    '+93',
    '+355',
    '+213',
    '+684',
    '+376',
    '+61',
    '+67',
    '+91',
  ]

  const navigation = useNavigation()
  const [is_Registered, setIs_Registered] = useState()
  const [visible, setVisible] = useState(false)
  const emailRef = useRef()
  const passwordRef = useRef()
  const usernameRef = useRef()
  const phoneRef = useRef()
  // const {logins} = useContext(AuthContext)
  // const {isAuthenticated} = useContext(AuthContext)

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    setValue,
  } = useForm({
    mode: 'all',
  })
  // register('userType')

  const email = register('email')
  const password = register('password')
  const username = register('username')
  const phone = register('phone')

  const onSubmit = data => {
    props.onSubmit(data)
  }

  console.log(errors)

  return (
    <>
      <View style={styles.fieldArea}>
        <View style={styles.inputView}>
          <View style={styles.inputTextView}>
            <Icon style={styles.inputIcon} name="person" color="#4F8EF7" />
            <Input
              style={styles.input}
              control={control}
              name="username"
              placeholder="User Name"
              rules={{required: true, minLength: 3}}
              ref={e => {
                username.ref(e)
                usernameRef.current = e
              }}
              onSubmitEditing={() => {
                emailRef.current.focus()
              }}
              blurOnSubmit={false}
              returnKeyType="next"
            />
          </View>
        </View>
        <View>
          {errors.username && (
            <Text style={styles.errorText}>This field is required</Text>
          )}
        </View>
      </View>
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
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>
      </View>
      <View style={styles.fieldArea}>
        <View style={styles.inputView}>
          <View style={[styles.inputTextView]}>
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
            <Text style={styles.errorText}>This field is required</Text>
          )}
        </View>
      </View>
      <View style={styles.fieldArea}>
        <View style={styles.inputView}>
          <View style={[styles.inputTextView]}>
            <Icon style={styles.inputIcon} name="phone" color="#4F8EF7" />

            <View style={{width: '40%'}}>
              <Controller
                control={control}
                name="countryCode"
                defaultValue={'+01'}
                render={({field: {value, onChange}}) => (
                  <Picker
                    dropdownIconColor={'#4F8EF7'}
                    style={{
                      color: 'white',
                    }}
                    selectedValue={value}
                    onValueChange={onChange}
                    mode="dropdown">
                    {countryCodes.map((item, index) => {
                      return (
                        <Picker.Item label={item} value={item} key={item} />
                      )
                    })}
                  </Picker>
                )}
              />
            </View>
            <Input
              keyboardType={'number-pad'}
              maxLength={15}
              style={styles.input}
              control={control}
              name="phone"
              placeholder="Phone Number"
              rules={{
                required: true,
                maxLength: 15,
                minLength: 10,
              }}
              ref={e => {
                phone.ref(e)
                phoneRef.current = e
              }}
              onSubmitEditing={() => {
                phoneRef.current.blur()
              }}
              blurOnSubmit={false}
            />
          </View>
        </View>
        <View>
          {errors.phone && (
            <Text style={styles.errorText}>This field is required</Text>
          )}
        </View>
      </View>

      {/* <View style={styles.fieldArea}> */}
      {/* <View style={styles.pickerArea}>
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            marginLeft: 20,
            marginBottom: 5,
          }}>
          Select User Type
        </Text>

        <Controller
          control={control}
          name="userType"
          defaultValue={'contributor'}
          render={({field: {value, onChange}}) => (
            <View style={styles.picker}>
              <Picker
                dropdownIconColor={'white'}
                style={{color: 'white'}}
                selectedValue={value}
                onValueChange={onChange}
                mode="dropdown">
                <Picker.Item label="Contributor" value="contributor" />
                <Picker.Item label="User" value="user" />
                <Picker.Item label="Editor" value="editor" />
              </Picker>
            </View>
          )}
        />
        {errors.userType && (
          <Text style={styles.errorText}>This field is required</Text>
        )}
      </View> */}
      <AuthButton
        style={styles.buttonContainer}
        onPress={handleSubmit(onSubmit)}
        // onPress={() => {
        //   handleSubmit(onSubmit)
        // navigation.navigate('dashboard')
        // }}
      >
        Sign up
      </AuthButton>

      <View></View>
    </>
  )
}
// }

const styles = StyleSheet.create({
  fieldArea: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  inputView: {
    flexDirection: 'row',
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
    flexBasis: '90%',
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
  errorText: {
    color: Colors.secondary,
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
  },
  pickerArea: {
    width: '70%',
  },
  picker: {
    // width: '100%',
    color: 'white',

    backgroundColor: Colors.accent,
    borderRadius: 20,
  },
  imagePickerContainer: {
    // marginTop: 10,
    width: 120,
    height: 120,
    backgroundColor: 'black',
    borderRadius: 70,
    // borderWidth: 5,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 8,

    // top: -40,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    // marginHorizontal: 10,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  alertHeading: {
    fontSize: 20,
  },
  modalButtonsContainer: {
    marginTop: 20,
  },
})

export default SignUpForm
