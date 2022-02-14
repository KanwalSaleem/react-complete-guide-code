import React, {useRef, useState, useEffect, useContext} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useForm, Controller} from 'react-hook-form'
import {useNavigation} from '@react-navigation/core'
import Input from '../components/Input'
import AuthButton from '../components/AuthButton'
import Colors from '../constants/Colors'
import {AuthContext} from '../context/auth'
import {Picker} from '@react-native-picker/picker'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {
  Modal,
  RadioButton,
  Portal,
  Button,
  Checkbox,
  ActivityIndicator,
} from 'react-native-paper'
import {set} from 'react-native-reanimated'
import AsyncStorage from '@react-native-async-storage/async-storage'

const EditProfile = () => {
  const {userDetails, setUserDetails} = useContext(AuthContext)

  const usernameRef = useRef()
  const emailRef = useRef()
  const phoneRef = useRef()
  const passwordRef = useRef()
  const navigation = useNavigation()
  const [visible, setVisible] = useState(false)
  const photo = useRef()
  const [isLoading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    setValue,
    reset,
  } = useForm({
    mode: 'all',
  })
  const username = register('username')
  const email = register('email')
  const phone = register('phone')
  const password = register('password')

  useEffect(() => {
    reset({
      username: userDetails?.user_name,
      phone: userDetails?.user_phone,
      email: userDetails?.user_email,
    })
  }, [
    reset,
    userDetails?.user_name,
    userDetails?.profilepic,
    userDetails?.user_email,
    userDetails?.user_phone,
  ])

  const onSubmit = async data => {
    setLoading(true)

    try {
      let base_url = 'https://www.worldmcqs.org/Admin/API/postdata.php'
      let uploadData = new FormData()
      if (data.photo != undefined) {
        uploadData.append('fileToUpload', {
          uri: data.photo.uri,
          name: data.photo.fileName,
          type: data.photo.type,
        })
      }
      uploadData.append('request_name', 'updateProfile')
      uploadData.append('username', data.username)
      uploadData.append('email', data.email)
      uploadData.append('user_id', userDetails.User_id)
      uploadData.append('phone', data.phone)

      if (data.password != null) {
        uploadData.append('password', data.password)
      } else {
        uploadData.append('password', ' ')
      }

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message)
      }

      if (responseData.isUpdated === false) {
        Alert.alert(responseData.Message)
      } else {
        Alert.alert('Success', responseData.Message)
        setUserDetails(prev => ({
          ...prev,
          user_name: data.username,
          user_phone: data.phone,
          user_email: data.email,
          profilepic:
            data.photo !== undefined ? data.photo.uri : userDetails.profilepic,
        }))

        console.log(userDetails.profilepic)

        const userDetailsJson = JSON.stringify(userDetails)
        AsyncStorage.setItem('User_Details', userDetailsJson)

        navigation.goBack()
      }
    } catch (error) {
      Alert.alert(error.message)
    }
    setLoading(false)

    // navigation.goBack()
  }

  const accessCamera = () => {
    const options = {
      // storageOptions: {
      path: 'images',
      mediaType: 'photo',
      // },
    }

    launchCamera(options, response => {
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        )
      }

      register('photo', {value: photo.current, required: true})
      photo.current = response.assets ? response.assets[0] : undefined
      // images[index] = uri
      setValue('photo', photo.current, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setVisible(false)
    })
  }

  const accessGallery = () => {
    const options = {
      // storageOptions: {
      path: 'images',
      mediaType: 'photo',
      // },
    }

    launchImageLibrary(options, response => {
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        )
      }
      console.log(response.assets)

      photo.current = response.assets ? response.assets[0] : undefined
      setValue('photo', photo.current)
      setVisible(false)
    })
  }

  const pickerHandler = () => {
    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          {/* <View> */}
          <Text style={styles.alertHeading}>Choose an Option</Text>
          <View style={styles.modalButtonsContainer}>
            <Button onPress={accessCamera} color={Colors.primary}>
              Take a Photo
            </Button>
            <Button
              onPress={accessGallery}
              color={Colors.primary}
              style={{
                fontSize: 16,
              }}>
              Choose a Photo
            </Button>
          </View>
          {/* </View> */}
        </Modal>
      </Portal>
    )
  }

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <KeyboardAvoidingView style={styles.screen}>
      <Text style={styles.heading}>World MCQs</Text>
      <Text style={styles.passwordHeading}>Edit Profile</Text>

      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => setVisible(true)}
        style={{
          // width: 100,
          alignSelf: 'center',
          marginBottom: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {userDetails?.profilepic || photo.current ? (
          <Image
            source={{
              uri: !photo.current
                ? userDetails?.profilepic
                : // userDetails?.profilepic
                  photo.current.uri,
            }}
            style={{
              width: 120,
              height: 120,
              resizeMode: 'cover',
              borderRadius: 70,
              alignSelf: 'center',
              // marginTop: 10,
              // borderWidth: 10,
              // borderColor: 'white',
            }}></Image>
        ) : (
          <View style={styles.imagePickerContainer}>
            <Icon name="photo-camera" color="white" size={40} />
          </View>
        )}
      </TouchableOpacity>

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
                phoneRef.current.focus()
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
            <Icon style={styles.inputIcon} name="phone" color="#4F8EF7" />

            <Input
              keyboardType={'phone-pad'}
              maxLength={15}
              style={styles.input}
              control={control}
              name="phone"
              placeholder="Phone Number"
              rules={{required: true, maxLength: 15, minLength: 10}}
              ref={e => {
                phone.ref(e)
                phoneRef.current = e
              }}
              onSubmitEditing={() => {
                passwordRef.current.blur()
              }}
              returnKeyType="next"
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

      <View style={styles.fieldArea}>
        <View style={styles.inputView}>
          <View style={styles.inputTextView}>
            <Icon style={styles.inputIcon} name="person" color="#4F8EF7" />
            <Input
              style={styles.input}
              control={control}
              name="password"
              placeholder="Password"
              rules={{minLength: 6}}
              ref={e => {
                password.ref(e)
                passwordRef.current = e
              }}
              secureTextEntry={true}
              onSubmitEditing={() => {
                passwordRef.current.focus()
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

      <AuthButton
        style={styles.buttonContainer}
        onPress={handleSubmit(onSubmit)}>
        Confirm
      </AuthButton>

      {pickerHandler()}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 46,
    color: Colors.secondary,
    marginBottom: 40,
  },
  passwordHeading: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
  },
  fieldArea: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  inputView: {
    flexDirection: 'row',

    // justifyContent: 'center',
  },
  inputTextView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 20,
    height: 50,
    // justifyContent: 'center',
    padding: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderRadius: 10,
    height: 80,
    color: 'white',
    flexBasis: '94%',
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  buttonContainer: {
    width: '80%',

    marginLeft: 10,
    marginTop: 10,
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

export default EditProfile
