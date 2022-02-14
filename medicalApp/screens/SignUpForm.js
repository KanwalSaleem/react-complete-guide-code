import React, {useState, useRef, useEffect} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import {Controller, useForm} from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../constants/Colors'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {Profile, LoginManager} from 'react-native-fbsdk-next'
import {useSelector} from 'react-redux'

import {
  Modal,
  RadioButton,
  Portal,
  Button,
  Checkbox,
  ActivityIndicator,
} from 'react-native-paper'
import {Picker} from '@react-native-picker/picker'
import {useNavigation} from '@react-navigation/native'
import LocationEnabler from 'react-native-location-enabler'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import Input from '../components/Input'
import AuthButton from '../components/AuthButton'

const countryCodes = [
  '+01',
  '+93',
  '+355',
  '+213',
  '+684',
  '+376',
  '+61',
  '+67',
  '+91',
  '+92',
]

const SignUpForm = (props) => {
  const {params} = props.route

  const navigation = useNavigation()
  const [address1Focused, setAddress1Focused] = useState(false)
  const [address2Focused, setAddress2Focused] = useState(false)
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [isSelected, setSelection] = useState(false)
  const [loading, setLoading] = useState(false)
  const location = useSelector((state) => state.location)
  const [visible, setVisible] = useState(false)
  const photo = useRef()
  const [passwordVisibilty, setPasswordVisibility] = useState(true)
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const emailRef = useRef()
  const addressLine1Ref = useRef()
  const addressLine2Ref = useRef()
  const cityRef = useRef()
  const stateRef = useRef()
  const zipCodeRef = useRef()
  const phoneNumberRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()
  const referralRef = useRef()

  const [role, setRole] = useState('careGiver')
  const {
    PRIORITIES: {HIGH_ACCURACY},
    useLocationSettings,
  } = LocationEnabler

  const [enabled, requestResolution] = useLocationSettings(
    {
      priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
      alwaysShow: true, // default false
      needBle: true, // default false
    },
    false /* optional: default undefined */,
  )

  const {
    control,
    handleSubmit,

    register,
    setValue,

    formState: {errors},
  } = useForm({
    mode: 'all',
    defaultValues: {
      firstName: params?.firstName,
      lastName: params?.lastName,
      email: params?.email,
    },
  })
  // console.log(errors)

  const firstName = register('firstName')
  const lastName = register('lastName')
  const email = register('email')
  const addressLine1 = register('addressLine1', {
    required: true,
    minLength: 1,
    validate: (value) => value === address1 || 'This field is required',
  })
  const addressLine2 = register('addressLine2', {
    required: true,
    minLength: 1,
    validate: (value) => value === address2 || 'This field is required',
  })
  const city = register('city', {required: true})
  const state = register('state', {required: true})
  const zipCode = register('zipCode')
  const phoneNumber = register('phoneNumber')
  const password = register('password')
  const confirmPassword = register('confirmPassword')
  const referral = register('referral')

  const onSubmit = (data) => {
    if (data.password != data.confirmPassword) {
      Alert.alert('', 'Password does not match')
      return
    }

    console.log(data)

    if (role == 'physician') {
      props.navigation.navigate('physician', {
        roleId: 3,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        addressLine1: data.addressLine1,
        token: data.token,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phoneNumber,
        password: data.password,
        passwordConfirm: data.password,
        termsCondition: isSelected ? 1 : 0,
        photo: data.photo,
        location: data.location,
      })
    } else {
      props.navigation.navigate('caregiver', {
        roleId: 2,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        addressLine1: data.addressLine1,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phoneNumber,
        password: data.password,
        passwordConfirm: data.password,
        termsCondition: isSelected ? 1 : 0,
        referral: data.referral,
        photo: data.photo,
        location: data.location,
        token: data.token,
      })
    }
  }

  const accessCamera = () => {
    const options = {
      path: 'images',
      mediaType: 'photo',
    }

    launchCamera(options, (response) => {
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        )
      }

      register('photo', {value: photo.current, required: true})
      photo.current = response.assets ? response.assets[0] : undefined

      setValue('photo', photo.current, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setVisible(false)
    })
  }

  const accessGallery = () => {
    const options = {
      path: 'images',
      mediaType: 'photo',
    }

    launchImageLibrary(options, (response) => {
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
  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userDetails = await GoogleSignin.signIn()

      console.log(userDetails.user.email)
      setValue('email', userDetails.user.email)
      setValue('firstName', userDetails.user.givenName)
      setValue('lastName', userDetails.user.familyName)
    } catch (error) {
      console.log(error.code)
      console.log(error)
      Alert.alert(error.message)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        // Alert.alert('Play services not available or outdated')
      }
    }
  }

  useEffect(() => {
    register('photo', {value: photo.current, required: true})
    register('location', {required: true})
    setValue('location', {
      longitude: location.longitude,
      latitude: location.latitude,
    })

    if (errors.location) {
      Alert.alert('', 'Location is required to sign up.')
    }

    if (errors.photo) {
      Alert.alert('', 'Image is required')
    }
  }, [errors.location, errors.photo, register, setValue])

  const pickerHandler = () => {
    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}>
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
        </Modal>
      </Portal>
    )
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={30}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={styles.mainScreen}
            keyboardShouldPersistTaps={'handled'}>
            <View style={styles.screen}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setVisible(true)}
                style={{width: 100, alignSelf: 'center', marginTop: -70}}>
                {!photo.current ? (
                  <View
                    style={[
                      styles.imagePickerContainer,
                      {borderColor: errors.photo ? 'red' : '#fff'},
                    ]}>
                    <Icon
                      style={styles.inputIcon}
                      name="add-a-photo"
                      color="red"
                      size={35}
                    />
                  </View>
                ) : (
                  <Image
                    source={{uri: photo.current.uri}}
                    style={{
                      width: 120,
                      height: 120,
                      resizeMode: 'cover',
                      borderRadius: 70,
                      alignSelf: 'center',
                      marginTop: 10,
                      borderWidth: 10,
                      borderColor: 'white',
                    }}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.signUpTitle}>Sign up as</Text>
              <View style={styles.roleView}>
                <Text style={{fontFamily: 'OpenSans-Regular'}}>Role</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 30,
                  }}>
                  <RadioButton
                    onPress={() => setRole('careGiver')}
                    value="carGiver"
                    status={role === 'careGiver' ? 'checked' : 'unchecked'}
                    color={Colors.primary}
                  />

                  <Text style={{fontFamily: 'OpenSans-Regular'}}>
                    Care giver
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 30,
                  }}>
                  <RadioButton
                    onPress={() => setRole('physician')}
                    value="physician"
                    status={role === 'physician' ? 'checked' : 'unchecked'}
                    color={Colors.primary}
                  />

                  <Text style={{fontFamily: 'OpenSans-Regular'}}>
                    Physicisan
                  </Text>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldTitle}>Personal Information</Text>
                <View style={styles.fieldView}>
                  <Icon name="person" color="black" size={20} />

                  <Input
                    control={control}
                    name="firstName"
                    rules={{required: true, minLength: 3}}
                    placeholder="First name"
                    ref={(e) => {
                      firstName.ref(e)
                      firstNameRef.current = e
                    }}
                    onSubmitEditing={() => {
                      lastNameRef.current.focus()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholderTextColor="black"
                    style={styles.textInput}
                  />
                </View>
                {errors.firstName && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}

                <View style={styles.fieldView}>
                  <Icon name="person" color="black" size={20} />

                  <Input
                    control={control}
                    name="lastName"
                    rules={{required: true, minLength: 3}}
                    placeholder="Last name"
                    ref={(e) => {
                      lastName.ref(e)
                      lastNameRef.current = e
                    }}
                    onSubmitEditing={() => {
                      emailRef.current.focus()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholderTextColor="black"
                    style={styles.textInput}
                  />
                </View>
                {errors.lastName && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}

                <View style={styles.fieldView}>
                  <Icon name="email" color="black" size={20} />

                  <Input
                    control={control}
                    name="email"
                    rules={{
                      required: true,
                      pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    }}
                    placeholder="Email address"
                    ref={(e) => {
                      email.ref(e)
                      emailRef.current = e
                    }}
                    onSubmitEditing={() => {
                      addressLine1Ref.current.focus()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholderTextColor="black"
                    style={styles.textInput}
                  />
                </View>

                {errors.email && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}

                <View style={styles.fieldView}>
                  <Icon name="location-on" color="black" size={20} />

                  <TextInput
                    placeholderStyle={{color: 'red'}}
                    onBlur={() => setAddress1Focused(false)}
                    onFocus={() => setAddress1Focused(true)}
                    isFocused={address1Focused}
                    value={address1}
                    placeholder="Address Line 1"
                    onChangeText={(text) => {
                      setAddress1(text)
                      setValue('addressLine1', text)
                    }}
                    ref={(e) => {
                      addressLine1.ref(e)
                      addressLine1Ref.current = e
                    }}
                    onSubmitEditing={() => {
                      addressLine2Ref.current.focus()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholderTextColor="black"
                    style={[styles.textInput]}
                  />
                  {/* )}
                 /> */}
                </View>
                {/* {!address1Focused && !address1 && (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      top: -44,
                      marginLeft: 5,
                    }}
                    onPress={() => {
                      setAddress1Focused(true)
                      addressLine1Ref.current.focus()
                    }}>
                    <Text style={{left: window.width < 400 ? 18 : 0}}>
                      Address Line 1
                    </Text>
                    <Text
                      style={{
                        color: 'grey',
                        textAlign: 'right',
                        marginLeft: 20,

                        right: 0,
                        fontSize: 10,
                      }}>
                      Street address, R,O, box, Company name , c/o
                    </Text>
                  </TouchableOpacity>
                )} */}
                {errors.addressLine1 && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}

                <View style={styles.fieldView}>
                  <Icon name="location-on" color="black" size={20} />

                  <TextInput
                    isFocused={address2Focused}
                    onBlur={() => setAddress2Focused(false)}
                    onFocus={() => setAddress2Focused(true)}
                    value={address2}
                    onChangeText={(text) => {
                      setAddress2(text)
                      setValue('addressLine2', text)
                    }}
                    placeholder="Address Line 2"
                    ref={(e) => {
                      addressLine2.ref(e)
                      addressLine2Ref.current = e
                    }}
                    onSubmitEditing={() => {
                      cityRef.current.focus()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholderTextColor="black"
                    style={styles.textInput}
                  />
                </View>
                {/* {!address2Focused && !address2 && (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      top: -44,
                    }}
                    onPress={() => {
                      setAddress2Focused(true)
                      addressLine2Ref.current.focus()
                    }}>
                    <Text style={{left: window.width < 400 ? 10 : -10}}>
                      Address Line 2
                    </Text>
                    <Text
                      style={{
                        color: 'grey',
                        textAlign: 'right',
                        marginLeft: 20,

                        right: window.width < 400 ? -10 : -20,
                        fontSize: 10,
                      }}>
                      Apartment, suite, unit, building, floor, etc.
                    </Text>
                  </TouchableOpacity>
                )} */}
                {errors.addressLine2 && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}

                <View
                  style={styles.fieldView}
                  keyboardShouldPersistTaps={'always'}>
                  <Icon name="location-city" color="black" size={20} />

                  <ScrollView keyboardShouldPersistTaps={'always'}>
                    <GooglePlacesAutocomplete
                      nestedScrollEnabled={true}
                      autoFocus={false}
                      textInputProps={{
                        placeholderTextColor: 'black',
                        color: 'black',
                        returnKeyType: 'next',
                      }}
                      listViewDisplayed={false}
                      placeholder="City"
                      ref={(e) => {
                        city.ref(e)
                        cityRef.current = e
                      }}
                      onSubmitEditing={() => {
                        stateRef.current.focus()
                      }}
                      onPress={(data) => {
                        console.log(data)
                        setValue('city', data.description)
                      }}
                      query={{
                        key: 'AIzaSyCgSOrjZImgZJzMMbGXvbV8S36Tv4A_2us',
                        language: 'en',
                        type: '(cities)',
                        // components: 'country:us',
                      }}
                    />
                  </ScrollView>
                </View>

                {errors.city && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}

                <View style={styles.fieldView}>
                  <Icon name="business" color="black" size={20} />

                  <ScrollView
                    keyboardShouldPersistTaps={'always'}
                    contentContainerStyle={{flexDirection: 'row'}}>
                    <GooglePlacesAutocomplete
                      nestedScrollEnabled={true}
                      autoFocus={false}
                      listViewDisplayed={false}
                      textInputProps={{
                        placeholderTextColor: 'black',
                        color: 'black',
                        returnKeyType: 'next',
                      }}
                      placeholder="State/Province/Region"
                      onPress={(data, details = null) => {
                        console.log(data, details)
                        setValue('state', data.description)
                      }}
                      ref={(e) => {
                        state.ref(e)
                        stateRef.current = e
                      }}
                      onSubmitEditing={() => {
                        zipCodeRef.current.focus()
                      }}
                      query={{
                        key: 'AIzaSyCgSOrjZImgZJzMMbGXvbV8S36Tv4A_2us',
                        language: 'en',
                        type: '(regions)',
                        // components: 'country:us',
                      }}
                    />
                  </ScrollView>
                  <Icon name="expand-more" color="black" size={20} />
                </View>

                {errors.state && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}

                <View style={styles.fieldView}>
                  <Icon name="push-pin" color="black" size={20} />

                  <Input
                    control={control}
                    name="zipCode"
                    rules={{required: true, minLength: 5, maxLength: 6}}
                    keyboardAppearance={'dark'}
                    maxLength={6}
                    placeholder="Zip Code"
                    ref={(e) => {
                      zipCode.ref(e)
                      zipCodeRef.current = e
                    }}
                    onSubmitEditing={() => {
                      phoneNumberRef.current.focus()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholderTextColor="black"
                    keyboardType="number-pad"
                    style={styles.textInput}
                  />
                </View>

                {errors.zipCode && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}

                <View
                  style={{
                    width: '90%',
                    flexDirection: 'row',
                    alignItems: 'center',

                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 1.5,
                      borderBottomColor: 'grey',
                      width: '40%',
                      top: -2,
                    }}>
                    <Icon name="phone-android" color="black" size={20} />
                    <View style={{width: 120}}>
                      <Controller
                        control={control}
                        name="countryCode"
                        defaultValue={'+01'}
                        render={({field: {value, onChange}}) => (
                          <Picker
                            dropdownIconColor={'black'}
                            style={{
                              color: 'black',
                              fontFamily: 'OpenSans-Regular',
                            }}
                            selectedValue={value}
                            onValueChange={onChange}
                            mode="dropdown">
                            {countryCodes.map((item, index) => {
                              return (
                                <Picker.Item
                                  label={item}
                                  value={index}
                                  key={index}
                                />
                              )
                            })}
                          </Picker>
                        )}
                      />
                    </View>
                  </View>

                  <Input
                    control={control}
                    name="phoneNumber"
                    rules={{required: true, maxLength: 15, minLength: 8}}
                    maxLength={15}
                    placeholder="Phone Number"
                    placeholderTextColor="black"
                    ref={(e) => {
                      phoneNumber.ref(e)
                      phoneNumberRef.current = e
                    }}
                    onSubmitEditing={() => {
                      return role === 'careGiver'
                        ? referralRef.current.focus()
                        : passwordRef.current.focus()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    keyboardType="number-pad"
                    style={{
                      flexBasis: '55%',
                      borderBottomWidth: 1.5,
                      borderBottomColor: 'grey',
                      marginLeft: 10,
                      width: '55%',
                      color: 'black',
                    }}
                  />
                </View>
                {errors.phoneNumber && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}

                {role === 'careGiver' && (
                  <View style={styles.fieldView}>
                    <Icon
                      name="perm-contact-calendar"
                      color="black"
                      size={20}
                    />

                    <Input
                      control={control}
                      name="referral"
                      keyboardAppearance={'dark'}
                      maxLength={6}
                      placeholder="Referral (if any)"
                      ref={(e) => {
                        referral.ref(e)
                        referralRef.current = e
                      }}
                      onSubmitEditing={() => {
                        passwordRef.current.focus()
                      }}
                      blurOnSubmit={false}
                      returnKeyType="next"
                      placeholderTextColor="black"
                      keyboardType="number-pad"
                      style={styles.textInput}
                    />
                  </View>
                )}

                <View
                  style={[styles.fieldView, {justifyContent: 'space-between'}]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      name="lock"
                      color="black"
                      size={20}
                      style={styles.fieldIcon}
                    />

                    <Input
                      control={control}
                      name="password"
                      rules={{required: true, minLength: 6}}
                      placeholder="Password"
                      ref={(e) => {
                        password.ref(e)
                        passwordRef.current = e
                      }}
                      onSubmitEditing={() => {
                        confirmPasswordRef.current.focus()
                      }}
                      blurOnSubmit={false}
                      returnKeyType="next"
                      secureTextEntry={
                        passwordVisibilty === true ? true : false
                      }
                      placeholderTextColor="black"
                      style={styles.textInput}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => setPasswordVisibility((prev) => !prev)}>
                    <Icon
                      name={
                        passwordVisibilty === true
                          ? 'visibility-off'
                          : 'visibility'
                      }
                      color="black"
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}

                <View
                  style={[styles.fieldView, {justifyContent: 'space-between'}]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      style={styles.inputIcon}
                      name="lock"
                      color="black"
                      size={20}
                    />

                    <Input
                      control={control}
                      name="confirmPassword"
                      rules={{required: true, minLength: 6}}
                      placeholder="Confirm Password"
                      ref={(e) => {
                        confirmPassword.ref(e)
                        confirmPasswordRef.current = e
                      }}
                      onSubmitEditing={() => {
                        confirmPasswordRef.current.blur()
                      }}
                      blurOnSubmit={false}
                      returnKeyType="go"
                      secureTextEntry={
                        passwordVisibilty === true ? true : false
                      }
                      placeholderTextColor="black"
                      style={styles.textInput}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => setPasswordVisibility((prev) => !prev)}>
                    <Icon
                      name={
                        passwordVisibilty === true
                          ? 'visibility-off'
                          : 'visibility'
                      }
                      color="black"
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}
                <View style={styles.condtionsContainer}>
                  <View>
                    <Checkbox
                      color="black"
                      status={isSelected === false ? 'unchecked' : 'checked'}
                      onPress={() => {
                        setSelection((prev) => !prev)
                      }}
                    />
                  </View>
                  <View style={{paddingTop: 5}}>
                    <View style={styles.conditionsView}>
                      <Text style={{fontFamily: 'OpenSans-Regular'}}>
                        I agree with the{' '}
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('terms')}
                        activeOpacity={0.6}>
                        <Text
                          style={{
                            color: 'red',
                            fontFamily: 'OpenSans-Regular',
                          }}>
                          Term and Conditions{' '}
                        </Text>
                      </TouchableOpacity>
                      <Text style={{fontFamily: 'OpenSans-Regular'}}>and </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('policy')}
                      activeOpacity={0.6}>
                      <Text
                        style={{
                          color: 'red',
                          fontFamily: 'OpenSans-Regular',
                        }}>
                        Privacy Policy
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* </View> */}

              {loading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <AuthButton
                  onPress={handleSubmit(onSubmit)}
                  disabled={!isSelected}>
                  Continue
                </AuthButton>
              )}

              <View style={styles.socialContainer}>
                <Text style={styles.socialText}>
                  Connect with social account
                </Text>
                <View style={styles.socialAccountView}>
                  <TouchableOpacity
                    onPress={googleSignIn}
                    style={styles.socialIconView}>
                    <Image
                      source={require('../assets/google.png')}
                      style={styles.socialIcon}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      LoginManager.logInWithPermissions([
                        'public_profile',
                        'email',
                      ]).then(
                        function (result) {
                          if (result.isCancelled) {
                            console.log('Login cancelled')
                          } else {
                            console.log(
                              'Login success with permissions: ' +
                                result.grantedPermissions.toString(),
                            )
                          }
                        },
                        function (error) {
                          console.log('Login fail with error: ' + error)
                        },
                      )
                      Profile.getCurrentProfile().then(function (
                        currentProfile,
                      ) {
                        if (currentProfile) {
                          if (email !== null) {
                            setValue('email', currentProfile.email)
                          }
                          console.log(currentProfile)
                          setValue('lastName', currentProfile.lastName)
                          setValue('firstName', currentProfile.firstName)
                          currentProfile.email
                          console.log(
                            'The current logged user is: ' +
                              currentProfile.name +
                              '. His profile id is: ' +
                              currentProfile.userID,
                            'email' + currentProfile.email,
                          )
                        }
                      })
                    }}
                    style={[styles.socialIconView, {marginLeft: 10}]}>
                    <Image
                      source={require('../assets/facebook.png')}
                      style={styles.socialIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 10,
              }}>
              <Text style={styles.signInConditionText}>
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('signIn')
                }}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {pickerHandler()}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flexGrow: 1,

    backgroundColor: Colors.black,
    paddingHorizontal: 10,

    paddingVertical: 20,
  },
  screen: {
    marginTop: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 10,
  },
  container: {
    borderRadius: 10,

    paddingVertical: 20,
  },
  imagePickerContainer: {
    marginTop: 10,
    width: 120,
    height: 120,
    backgroundColor: 'black',

    borderRadius: 100,

    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',

    borderWidth: 10,

    // top: -40,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,

    width: '80%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  countryModalContainer: {
    backgroundColor: Colors.black,

    width: '100%',
    paddingHorizontal: 10,

    top: '20%',
  },
  countryModalView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  countryNameTitle: {
    fontSize: 16,

    marginTop: 10,
    fontFamily: 'OpenSans-Bold',
  },
  countryName: {},
  alertHeading: {
    fontSize: 20,
  },
  modalButtonsContainer: {
    marginTop: 20,
  },
  signUpTitle: {
    marginTop: 20,
    fontSize: 16,

    alignSelf: 'center',
    fontFamily: 'OpenSans-Bold',
  },
  fieldTitle: {
    fontSize: 16,

    alignSelf: 'flex-start',
    fontFamily: 'OpenSans-Bold',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  roleView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',

    marginVertical: 15,
  },
  fieldContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  fieldView: {
    width: '90%',
    flexDirection: 'row',

    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginBottom: 10,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontFamily: 'OpenSans-Regular',
  },
  condtionsContainer: {
    flexDirection: 'row',

    alignItems: 'flex-start',
  },
  conditionsView: {
    flexDirection: 'row',
  },

  buttonView: {
    width: '80%',
    height: 40,
    backgroundColor: 'red',
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    marginTop: 10,
  },
  countryNameButton: {
    width: '80%',
    height: 40,
    backgroundColor: 'red',
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',

    fontFamily: 'OpenSans-Bold',
  },
  infoContainer: {
    marginVertical: 10,

    alignItems: 'center',
    alignSelf: 'center',
  },
  infoImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 10,
  },
  documentContainer: {
    width: 300,
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dotted',
    borderColor: 'grey',
    backgroundColor: '#F7F2F5',
    paddingVertical: 20,
    marginVertical: 10,
    alignSelf: 'center',
  },
  fileImage: {
    width: 50,
    height: 50,
  },
  signInConditionText: {
    fontFamily: 'OpenSans-Regular',
    color: Colors.backgroundColor,
    fontSize: 16,
  },
  signInText: {
    paddingLeft: 5,
    color: Colors.primary,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  socialContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  socialAccountView: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  socialIconView: {
    borderWidth: 0.5,
    borderRadius: 50,

    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    fontFamily: 'OpenSans-Regular',
  },
  socialIcon: {
    width: 37,
    height: 37,
  },
  textInput: {
    color: 'black',
    flexBasis: '90%',
  },
})

export default SignUpForm
