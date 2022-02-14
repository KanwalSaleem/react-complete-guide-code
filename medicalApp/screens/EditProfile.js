import React, {useState, useRef, useEffect} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native'
import Colors from '../constants/Colors'
import {useSelector} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AuthButton from '../components/AuthButton'
import {useNavigation} from '@react-navigation/native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {Controller, useForm} from 'react-hook-form'
import {
  Modal,
  RadioButton,
  Portal,
  Button,
  Checkbox,
  ActivityIndicator,
} from 'react-native-paper'
import Input from '../components/Input'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import {Picker} from '@react-native-picker/picker'
import DocumentPicker from 'react-native-document-picker'

const EditProfile = () => {
  const defaultCountries = [
    {id: '1', name: 'Armenia', status: false},
    {id: '2', name: 'Australia', status: false},
    {id: '3', name: 'Australia', status: false},
    {id: '4', name: 'Bahrain', status: false},
    {id: '5', name: 'Bangladesh', status: false},
    {id: '6', name: 'Barbados', status: false},
    {id: '7', name: 'Cobo Verde', status: false},
    {id: '8', name: 'Cambodia', status: false},
    {id: '9', name: 'Camaroon', status: false},
    {id: '10', name: 'Canada', status: false},
    {id: '11', name: 'Denmark', status: false},
    {id: '12', name: 'Djibouti', status: false},
    {id: '13', name: 'Dominica', status: false},
    {id: '14', name: 'Cambodia', status: false},
    {id: '15', name: 'Camaroon', status: false},
    {id: '16', name: 'Canada', status: false},
    {id: '17', name: 'Denmark', status: false},
    {id: '18', name: 'Djibouti', status: false},
    {id: '19', name: 'Dominica', status: false},
  ]

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
  const navigation = useNavigation()
  const user = useSelector((state) => state.auth.user)
  const [visible, setVisible] = useState(false)
  const photo = useRef()

  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const emailRef = useRef()
  const addressLine1Ref = useRef()
  const addressLine2Ref = useRef()
  const stateRef = useRef()
  const cityRef = useRef()
  const zipCodeRef = useRef()
  const phoneNumberRef = useRef()
  const occupationRef = useRef()
  const licenseNoRef = useRef()
  const stateLicenseNoRef = useRef()
  const typeRef = useRef()
  const makeRef = useRef()
  const modelRef = useRef()
  const yearRef = useRef()
  const driverLicenseNoRef = useRef()
  const [stateName, setStateName] = useState('')
  const [countryModal, setCountryModal] = useState(false)
  const [selectedCountries, setSelectedCountries] = useState([])
  const [countryNames, setCountryNames] = useState(defaultCountries)
  const [docData, setDocData] = useState()
  let country

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: {errors},
  } = useForm({
    mode: 'all',
  })

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

  const pickerHandler = () => {
    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.alertHeading}>Choose an Option</Text>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity onPress={accessCamera}>
              <Text style={styles.photoButton}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={accessGallery} color={Colors.red}>
              <Text style={styles.photoButton}> Choose a Photo</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    )
  }
  const onSubmit = async (data) => {
    console.log(data)
  }
  const firstName = register('firstName')
  const lastName = register('lastName')
  const email = register('email')
  const addressLine1 = register('addressLine1')
  const addressLine2 = register('addressLine2')
  const city = register('city', {required: true})
  const state = register('state', {required: true})
  const zipCode = register('zipCode')
  const phoneNumber = register('phoneNumber')
  const occupation = register('occupation')
  const licenseNo = register('licenseNo')
  const stateLicenseNo = register('stateLicenseNo')
  const driverLicenseNo = register('driverLicenseNo')
  const type = register('type')
  const make = register('make')
  const model = register('model')
  const year = register('year')

  console.log(errors)

  const countryStatus = (id) => {
    const updatedCountries = countryNames.map((country) => {
      if (country.id === id) {
        return {...country, status: !country.status}
      }
      return country
    })
    setCountryNames(updatedCountries)
    console.log(updatedCountries)

    setSelectedCountries(
      updatedCountries.filter((country) => country.status === true),
    )
    setValue(
      'stateLicenseNo',
      updatedCountries.filter((country) => country.status === true),
    )

    country = ''
    selectedCountries.forEach((currentCounrty) => {
      country += currentCounrty.name + ','
    })
    setStateName(country)

    console.log(JSON.stringify(selectedCountries[selectedCountries.length - 1]))
  }

  const countryNamePicker = () => {
    return (
      <Portal style={{width: '100%'}}>
        <Modal
          dismissable={true}
          visible={countryModal}
          onDismiss={() => setCountryModal(false)}
          contentContainerStyle={styles.countryModalContainer}>
          <ScrollView
            contentContainerStyle={{
              backgroundColor: Colors.backgroundColor,
              paddingBottom: 150,
              borderRadius: 10,
              paddingHorizontal: 10,
            }}>
            <Text style={styles.countryNameTitle}>State Lisence Valid in</Text>
            <View>
              {countryNames.map((item) => (
                <View key={item.id} style={styles.countryModalView}>
                  <View>
                    <Checkbox
                      color="black"
                      status={item.status === false ? 'unchecked' : 'checked'}
                      onPress={() => {
                        countryStatus(item.id)
                      }}
                    />
                  </View>
                  <Text style={styles.countryName}>{item.name}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => setCountryModal(false)}
              style={styles.countryNameButton}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
      </Portal>
    )
  }

  const filePickerHandler = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
          DocumentPicker.types.doc,
          DocumentPicker.types.images,
        ],
      })
      console.log('response:', response)
      console.log(response[0].fileCopyUri, 'uri')
      setDocData(response[0].uri)
      setValue('doc', response[0])
    } catch (e) {
      console.log(e)
    }
  }

  console.log(user)

  useEffect(() => {
    reset({
      firstName: user?.first_name,
      lastName: user?.last_name,
      email: user?.email,
      addressLine1: user?.addressline_1,
      addressLine2: user?.addressline_2,
      city: user?.city,
      // state: user?.state,

      zipCode: user?.zipcode,
      phoneNumber: user?.phone,
      // occupation: user?.,
      // licenseNo: user?.,
      // stateLicenseNo :  user?.,
      // driverLicenseNo:user?. ,
      // type: user?.,
      // make: user?.,
      // model: user?.,
      // year: user?.,
    })
  }, [
    reset,
    setValue,
    user?.addressline_1,
    user?.addressline_2,
    user?.city,
    user?.email,
    user?.first_name,
    user?.last_name,
    user?.phone,
    user?.state,
    user?.zipcode,
  ])

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={30}
        style={styles.mainScreen}>
        <View style={styles.mainContainer}>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={[styles.whiteContainer, {marginTop: 50}]}>
              <View style={styles.mainDetailContainer}>
                <TouchableOpacity
                  style={styles.imageContainer}
                  activeOpacity={0.6}
                  onPress={() => setVisible(true)}>
                  {!photo.current ? (
                    <Image
                      source={require('../assets/physician_profile.png')}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Image
                      source={{uri: photo.current.uri}}
                      style={styles.profileImage}
                    />
                  )}
                  <View style={styles.inputIconContainer}>
                    <Icon
                      style={styles.inputIcon}
                      name="photo-camera"
                      color="white"
                      size={25}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.name,
                  {fontSize: 21, marginBottom: 30, marginTop: 10},
                ]}>
                Personal Information
              </Text>

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

                <Input
                  control={control}
                  name="addressLine1"
                  rules={{required: true, minLength: 1}}
                  placeholder="Address Line 1"
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
                  style={styles.textInput}
                />
              </View>

              {errors.addressLine1 && (
                <Text style={styles.errorText}>This field is required</Text>
              )}

              <View style={styles.fieldView}>
                <Icon name="location-on" color="black" size={20} />

                <Input
                  control={control}
                  name="addressLine2"
                  rules={{required: true, minLength: 1}}
                  placeholder="Address Line 2"
                  ref={(e) => {
                    addressLine2.ref(e)
                    addressLine2Ref.current = e
                  }}
                  onSubmitEditing={() => {
                    stateRef.current.focus()
                  }}
                  blurOnSubmit={false}
                  returnKeyType="next"
                  placeholderTextColor="black"
                  style={styles.textInput}
                />
              </View>

              {errors.addressLine2 && (
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
                      cityRef.current.focus()
                    }}
                    query={{
                      key: 'AIzaSyCgSOrjZImgZJzMMbGXvbV8S36Tv4A_2us',
                      language: 'en',
                      type: '(regions)',
                      // components: 'country:us',
                    }}
                  />
                </ScrollView>
              </View>

              {errors.state && (
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
                      zipCodeRef.current.focus()
                    }}
                    onPress={(data) => {
                      console.log(data)
                      setValue('city', data.description)
                    }}
                    query={{
                      key: 'AIzaSyCgSOrjZImgZJzMMbGXvbV8S36Tv4A_2us',
                      language: 'en',
                      type: '(cities)',
                    }}
                  />
                </ScrollView>
              </View>

              {errors.city && (
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
                            fontFamily: 'Roboto-Regular',
                            fontSize: 14,
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
                                style={{
                                  color: 'black',
                                  fontFamily: 'Roboto-Regular',
                                  fontSize: 14,
                                }}
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
                    occupationRef.current.focus()
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
            </View>
            {/* 2nd white Card */}
            <View style={styles.whiteContainer}>
              <View style={styles.headingContainer}>
                <Text style={[styles.name, {fontSize: 18}]}>
                  Professional Information
                </Text>
              </View>
              <View style={styles.fieldView}>
                <Input
                  control={control}
                  name="occupation"
                  rules={{required: true}}
                  placeholder="Occupation"
                  ref={(e) => {
                    occupation.ref(e)
                    occupationRef.current = e
                  }}
                  onSubmitEditing={() => {
                    licenseNoRef.current.focus()
                  }}
                  blurOnSubmit={false}
                  returnKeyType="next"
                  placeholderTextColor="black"
                  style={styles.textInput}
                />
              </View>
              {errors.occupation && (
                <Text style={styles.errorText}>This field is required</Text>
              )}

              <View style={styles.fieldView}>
                <View>
                  <Input
                    control={control}
                    name="licenseNo"
                    rules={{required: true, type: 'number'}}
                    placeholder="License Number"
                    ref={(e) => {
                      licenseNo.ref(e)
                      licenseNoRef.current = e
                    }}
                    keyboardType="number-pad"
                    // onSubmitEditing={() => {
                    //   stateLicenseNoRef.current.focus()
                    // }}
                    onSubmitEditing={() => {
                      return user.role_id === 3
                        ? stateLicenseNoRef.current.focus()
                        : driverLicenseNoRef.current.focus()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholderTextColor="black"
                    style={{color: 'black'}}
                  />
                </View>
              </View>
              {errors.licenseNo && (
                <Text style={styles.errorText}>This field is required</Text>
              )}

              {user.role_id === 3 && (
                <>
                  <TouchableOpacity
                    style={[
                      styles.fieldView,
                      {justifyContent: 'space-between'},
                    ]}
                    onPress={() => setCountryModal(true)}
                    activeOpacity={0.6}>
                    <TextInput
                      onPressIn={() => setCountryModal(true)}
                      value={
                        selectedCountries.length == 1
                          ? selectedCountries[0].name
                          : stateName
                      }
                      showSoftInputOnFocus={false}
                      selectTextOnFocus={false}
                      placeholder="State License Valid In"
                      ref={(e) => {
                        stateLicenseNo.ref(e)
                        stateLicenseNoRef.current = e
                      }}
                      onSubmitEditing={() => {
                        stateLicenseNoRef.current.blur()
                      }}
                      returnKeyType="go"
                      placeholderTextColor="black"
                    />

                    <Icon name="expand-more" color="black" size={20} />
                  </TouchableOpacity>
                  {errors.stateLicenseNo && (
                    <Text style={styles.errorText}>This field is required</Text>
                  )}

                  <TouchableOpacity
                    onPress={filePickerHandler}
                    style={styles.documentContainer}>
                    <Icon name="publish" color="black" size={30} />

                    <Text style={{fontFamily: 'Roboto-Regular', fontSize: 15}}>
                      Upload Document
                    </Text>
                  </TouchableOpacity>
                  {docData ? (
                    <ImageBackground
                      source={require('../assets/upload.png')}
                      style={styles.documentInnerContainer}
                      imageStyle={styles.documentImage}>
                      <View style={styles.iconView}>
                        <Icon name="close" size={10} color="white" />
                      </View>
                    </ImageBackground>
                  ) : (
                    <ImageBackground
                      source={require('../assets/upload.png')}
                      style={styles.documentInnerContainer}
                      imageStyle={styles.documentImage}>
                      <View style={styles.iconView}>
                        <Icon name="close" size={10} color="white" />
                      </View>
                    </ImageBackground>
                  )}
                </>
              )}
            </View>

            {/* 3rd white Card for Care Giver */}
            {user.role_id === 2 && (
              <View style={styles.whiteContainer}>
                <View style={styles.headingContainer}>
                  <Text style={[styles.name, {fontSize: 18}]}>
                    Vehicle Details
                  </Text>
                </View>
                <View style={styles.fieldView}>
                  <Input
                    control={control}
                    name="driverLicenseNo"
                    rules={{required: true, type: 'number'}}
                    placeholder="Driver License number"
                    ref={(e) => {
                      driverLicenseNo.ref(e)
                      driverLicenseNoRef.current = e
                    }}
                    keyboardType="number-pad"
                    onSubmitEditing={() => {
                      typeRef.current.focus()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholderTextColor="black"
                    style={styles.textInput}
                  />
                </View>
                {errors.driverLicenseNo && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}
                <View style={styles.fieldView}>
                  <Input
                    control={control}
                    name="type"
                    rules={{required: true}}
                    placeholder="Type"
                    ref={(e) => {
                      type.ref(e)
                      typeRef.current = e
                    }}
                    onSubmitEditing={() => {
                      makeRef.current.focus()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholderTextColor="black"
                    style={styles.textInput}
                  />
                </View>
                {errors.type && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}
                <View style={styles.fieldView}>
                  <Input
                    control={control}
                    name="make"
                    rules={{required: true}}
                    placeholder="Make"
                    ref={(e) => {
                      make.ref(e)
                      makeRef.current = e
                    }}
                    onSubmitEditing={() => {
                      modelRef.current.focus()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholderTextColor="black"
                    style={styles.textInput}
                  />
                </View>
                {errors.make && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}
                <View style={styles.fieldView}>
                  <Input
                    control={control}
                    name="model"
                    rules={{required: true}}
                    placeholder="Model"
                    ref={(e) => {
                      model.ref(e)
                      modelRef.current = e
                    }}
                    onSubmitEditing={() => {
                      yearRef.current.focus()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    placeholderTextColor="black"
                    style={styles.textInput}
                  />
                </View>
                {errors.modal && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}
                <View style={styles.fieldView}>
                  <Input
                    control={control}
                    name="year"
                    rules={{required: true}}
                    maxLength={4}
                    placeholder="Year"
                    ref={(e) => {
                      year.ref(e)
                      yearRef.current = e
                    }}
                    keyboardType="number-pad"
                    onSubmitEditing={() => {
                      yearRef.current.blur()
                    }}
                    blurOnSubmit={false}
                    returnKeyType="go"
                    placeholderTextColor="black"
                    style={styles.textInput}
                  />
                </View>
                {errors.year && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}
                <TouchableOpacity
                  onPress={filePickerHandler}
                  style={styles.documentContainer}>
                  <Icon name="publish" color="black" size={30} />

                  <Text style={{fontFamily: 'Roboto-Regular', fontSize: 15}}>
                    Upload Document
                  </Text>
                </TouchableOpacity>
                {docData ? (
                  <Image
                    source={require('../assets/vehicle.jpg')}
                    style={styles.fileImage}
                  />
                ) : (
                  <ImageBackground
                    source={require('../assets/vehicle.jpg')}
                    style={styles.documentInnerContainer}
                    imageStyle={styles.documentImage}>
                    <View style={styles.iconView}>
                      <Icon name="close" size={10} color="white" />
                    </View>
                  </ImageBackground>
                )}
              </View>
            )}
          </ScrollView>

          {pickerHandler()}
        </View>

        <AuthButton onPress={handleSubmit(onSubmit)}>Save Changes</AuthButton>
        {countryNamePicker()}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flexGrow: 1,
    backgroundColor: Colors.black,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  mainContainer: {height: '93%'},
  whiteContainer: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    paddingBottom: 10,
  },
  mainDetailContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imageContainer: {marginTop: -50, alignItems: 'center'},
  inputIcon: {},
  inputIconContainer: {
    marginTop: -20,
    backgroundColor: Colors.red,
    width: 48,
    height: 48,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 119,
    height: 119,
    borderRadius: 20,
  },
  name: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
  },
  email: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  rating: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  field: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    marginBottom: 2,
  },
  fieldDetail: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  headingContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    padding: 10,
    marginBottom: 20,
  },

  vehicleImage: {
    marginVertical: 10,
    width: '90%',
    height: 138,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,

    width: '80%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  modalButtonsContainer: {
    marginTop: 20,
  },
  alertHeading: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  photoButton: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: Colors.red,
    textAlign: 'center',
    marginVertical: 8,
  },
  fieldView: {
    width: '90%',
    flexDirection: 'row',

    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginBottom: 10,
    alignItems: 'center',
  },
  textInput: {
    flexBasis: '90%',
    color: 'black',
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
  errorText: {
    fontSize: 14,
    color: Colors.red,
    fontFamily: 'Roboto-Regular',
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
    fontFamily: 'Roboto-Bold',
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
  documentContainer: {
    width: '80%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 10,
    borderColor: 'grey',
    backgroundColor: '#F7F2F5',
    paddingVertical: 20,
    marginVertical: 10,
    alignSelf: 'center',
  },
  fileImage: {
    width: '80%',
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  documentInnerContainer: {
    width: '70%',
    height: 100,
    resizeMode: 'contain',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 3,
    marginVertical: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  documentImage: {
    width: '100%',
  },
  iconView: {
    backgroundColor: 'black',
    alignSelf: 'flex-end',
    width: 16,
    height: 16,
    marginTop: 5,
    marginRight: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default EditProfile
