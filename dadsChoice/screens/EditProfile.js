import React, {useState, useEffect, useRef} from 'react'
import {
  View,
  Text,
  Alert,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {Controller, useForm} from 'react-hook-form'
import {Modal, Portal, Button} from 'react-native-paper'
import Input from '../components/Input'
import {APIURL} from '../constants/url'
import AuthButton from '../components/AuthButton'
import fetch from 'node-fetch'
import {Picker} from '@react-native-picker/picker'

import Colors from '../constants/Colors'
import {updateUser} from '../store/actions/user'

const countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antigua & Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia & Herzegovina',
  'Botswana',
  'Brazil',
  'British Virgin Islands',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Cape Verde',
  'Cayman Islands',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Congo',
  'Cook Islands',
  'Costa Rica',
  'Cote D Ivoire',
  'Croatia',
  'Cruise Ship',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Estonia',
  'Ethiopia',
  'Falkland Islands',
  'Faroe Islands',
  'Fiji',
  'Finland',
  'France',
  'French Polynesia',
  'French West Indies',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kuwait',
  'Kyrgyz Republic',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macau',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Nepal',
  'Netherlands',
  'Netherlands Antilles',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Reunion',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Pierre & Miquelon',
  'Samoa',
  'San Marino',
  'Satellite',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'St Kitts & Nevis',
  'St Lucia',
  'St Vincent',
  'St. Lucia',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  "Timor L'Este",
  'Togo',
  'Tonga',
  'Trinidad & Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks & Caicos',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'Uruguay',
  'Uzbekistan',
  'Venezuela',
  'Vietnam',
  'Virgin Islands (US)',
  'Yemen',
  'Zambia',
  'Zimbabwe',
]
const EditProfile = (props) => {
  const [selectedCounty, setSelectedCountry] = useState(
    user ? user.country : '',
  )
  const {
    firstNameText,
    lastNameText,
    emailAddressText,
    streetAddressText,
    cityText,
    postalCodeText,
    countryText,
    phoneNumberText,
    passwordText,
    submit,
    Country_Address,
    Region_Address,
  } = useSelector((state) => state.language)
  const user = useSelector((state) => state.user)
  const {img} = user
  const {token, roleId} = useSelector((state) => state.auth)
  const photoUrl =
    roleId == 3
      ? `${APIURL}/storage/uploads/specialist/img/`
      : `${APIURL}/storage/uploads/`

  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const photo = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const emailRef = useRef()
  const cityRef = useRef()
  const postalRef = useRef()
  const countryRef = useRef()
  const addressRef = useRef()
  const numberRef = useRef()
  const passwordRef = useRef()
  const regionRef = useRef()
  const {
    control,
    handleSubmit,
    setValue,
    register,
    reset,
    formState: {errors},
  } = useForm({
    mode: 'all',
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      city: user.city,
      country: user.country,
      number: user.phoneNumber,
      photo: img,
    },
  })

  useEffect(
    () => {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        city: user.city,
        country: user.country,
        number: user.phoneNumber,
        photo: img,
        address: user.address,
        postal: user.postal,
        region: user.region,
      })
    },
    [
      img,
      reset,
      user.address,
      user.city,
      user.country,
      user.email,
      user.firstName,
      user.lastName,
      user.phoneNumber,
      user.postal,
      user.region,
    ],
  )

  const firstName = register('firstName', {value: user.firstName})
  const lastName = register('lastName')
  const email = register('email')
  const city = register('city')
  const postal = register('postal')
  const country = register('country')
  const address = register('address')
  const number = register('number')
  const password = register('password')
  const region = register('region')
  const accessCamera = () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
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
      // images[index] = uri
      setValue('photo', photo.current, {
        shouldValidate: true,
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

      photo.current = response.assets ? response.assets[0] : undefined
      setValue('photo', photo.current)
      setVisible(false)
    })
  }

  const onSubmit = async (data) => {
    // eslint-disable-next-line no-undef
    const headers = new Headers()
    if (data.password != null) {
      console.log(data)
    }

    headers.append('Content-Type', 'multipart/form-data')

    headers.append('Authorization', `Bearer ${token}`)
    // eslint-disable-next-line no-undef
    const formData = new FormData()
    formData.append('email', data.email)
    if (
      data.password !== null &&
      data.password !== '' &&
      data.password !== undefined
    ) {
      formData.append('password', data.password)
    }
    formData.append('first_name', data.firstName)
    formData.append('last_name', data.lastName)
    formData.append('address', data.address)
    formData.append('street', 'asd')
    formData.append('city', data.city)
    formData.append('country', data.country)
    formData.append('phone_number', data.number)
    formData.append('Post_code', data.postal)
    formData.append('region', data.region)

    if (data.photo.uri != null) {
      formData.append('img', {
        uri: data.photo.uri,
        name: data.photo.fileName,
        type: data.photo.type,
      })
    }
    console.log(formData)

    const requestOptions = {
      method: 'POST',
      headers,
      body: formData,
    }

    console.log(formData)
    console.log(data)
    setLoading(true)
    try {
      const response = await fetch(`${APIURL}/api/edit-profile`, requestOptions)
      const resData = await response.json()
      console.log(response)

      if (!response.ok) {
        throw new Error(resData)
      }
      console.log(resData)
      console.log(data, 'userData')
      dispatch(
        updateUser({
          ...data,
          photo: data.photo !== undefined ? data.photo.uri : img,
        }),
      )
      Alert.alert('Success', 'Details updated Succesfully')
      props.navigation.goBack()
    } catch (e) {
      // Alert.alert('Error', e.message)
      console.log(e)
    }
    setLoading(false)
  }

  useEffect(
    () => {
      register('photo', {value: photo.current})
    },
    [register],
  )

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
    <ScrollView contentContainerStyle={styles.screen}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setVisible(true)}>
            {img || photo.current ? (
              <Image
                source={{
                  uri: !photo.current ? `${photoUrl}${img}` : photo.current.uri,
                }}
                style={{
                  width: 130,
                  height: 130,
                  resizeMode: 'cover',
                  borderRadius: 100,
                }}
              />
            ) : (
              <View style={styles.imagePickerContainer}>
                <Icon
                  style={styles.inputIcon}
                  name="photo-camera"
                  color="#4F8EF7"
                  size={30}
                />
              </View>
            )}
          </TouchableOpacity>

          {/* <Controller
              control={control}
              name="userType"
              defaultValue={'individualUser'}
              render={({value}) => (
                <View style={styles.typePicker}>
                  <Picker
                    selectedValue={value}
                    onValueChange={() => {
                      // setValue('userType', itemValue)
                      props.changeMode()
                      changeUserType('specialist')
                    }}
                    mode="dropdown">
                    <Picker.Item label="Individual User" value="individualUser" />
                    <Picker.Item label="Specialist User" value="specialistUser" />
                  </Picker>
                </View>
              )}
            /> */}
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Input
                control={control}
                name="firstName"
                placeholder={firstNameText}
                rules={{required: true, maxLength: 10}}
                ref={(e) => {
                  firstName.ref(e)
                  firstNameRef.current = e
                }}
                onSubmitEditing={() => {
                  lastNameRef.current.focus()
                }}
                blurOnSubmit={false}
                maxLength={10}
              />
            </View>
            {errors.firstName && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Input
                control={control}
                name="lastName"
                placeholder={lastNameText}
                rules={{required: true, maxLength: 10}}
                ref={(e) => {
                  lastName.ref(e)
                  lastNameRef.current = e
                }}
                onSubmitEditing={() => {
                  emailRef.current.focus()
                }}
                blurOnSubmit={false}
              />
            </View>
            {errors.lastName && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Input
                control={control}
                name="email"
                placeholder={emailAddressText}
                rules={{
                  required: true,
                  pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                }}
                ref={(e) => {
                  email.ref(e)
                  emailRef.current = e
                }}
                onSubmitEditing={() => {
                  addressRef.current.focus()
                }}
                blurOnSubmit={false}
                keyboardType="email-address"
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Input
                control={control}
                name="address"
                placeholder={streetAddressText}
                rules={{required: true}}
                multiline={true}
                style={{textAlignVertical: 'top', height: 100}}
                numberOfLines={5}
                ref={(e) => {
                  address.ref(e)
                  addressRef.current = e
                }}
                onSubmitEditing={() => {
                  cityRef.current.focus()
                }}
                blurOnSubmit={false}
              />
            </View>
            {errors.address && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Input
                control={control}
                name="city"
                placeholder={cityText}
                rules={{required: true}}
                ref={(e) => {
                  city.ref(e)
                  cityRef.current = e
                }}
                onSubmitEditing={() => {
                  postalRef.current.focus()
                }}
                blurOnSubmit={false}
              />
            </View>
            {errors.city && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          <View />
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Input
                control={control}
                name="postal"
                placeholder={postalCodeText}
                rules={{required: true}}
                ref={(e) => {
                  postal.ref(e)
                  postalRef.current = e
                }}
                onSubmitEditing={() => {
                  countryRef.current.focus()
                }}
                blurOnSubmit={false}
              />
            </View>
            {errors.postal && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Input
                control={control}
                name="region"
                placeholder={Region_Address}
                rules={{required: true}}
                ref={(e) => {
                  region.ref(e)
                  regionRef.current = e
                }}
                onSubmitEditing={() => {
                  regionRef.current.blur()
                  countryRef.current.focus()
                }}
                blurOnSubmit={false}
              />
            </View>
            {errors.region && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="country"
                render={({field: {value, onChange}}) => (
                  <Picker
                    // style={{width: '100%'}}
                    name="country"
                    placeholder={countryText}
                    ref={(e) => {
                      country.ref(e)
                      countryRef.current = e
                    }}
                    onSubmitEditing={() => {
                      numberRef.current.focus()
                    }}
                    blurOnSubmit={false}
                    selectedValue={value}
                    onValueChange={onChange}>
                    <Picker.Item
                      // enabled={false}
                      label={Country_Address}
                      color={Colors.darkGrey}
                    />
                    {countries.map((country) => (
                      <Picker.Item
                        key={country}
                        value={country}
                        label={country}
                      />
                    ))}
                  </Picker>
                )}
              />
            </View>
            {errors.country && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Input
                control={control}
                name="number"
                placeholder={phoneNumberText}
                rules={{required: true, type: 'number'}}
                keyboardType="number-pad"
                ref={(e) => {
                  number.ref(e)
                  numberRef.current = e
                }}
                onSubmitEditing={() => {
                  passwordRef.current.focus()
                }}
                blurOnSubmit={false}
              />
            </View>
            {errors.number && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Input
                control={control}
                name="password"
                placeholder={passwordText}
                // rules={{required: true}}
                secureTextEntry={true}
                ref={(e) => {
                  password.ref(e)
                  passwordRef.current = e
                }}
                onSubmitEditing={() => {
                  passwordRef.current.blur()
                }}
                blurOnSubmit={false}
                returnKeyType={'done'}
              />
            </View>
            {errors.password && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
          </View>
          {loading ? (
            <ActivityIndicator color={Colors.primary} size={'large'} />
          ) : (
            <AuthButton
              // disabled={!isValid}
              onPress={handleSubmit(onSubmit)}
              style={styles.button}>
              {submit}
            </AuthButton>
          )}
        </>
      </TouchableWithoutFeedback>
      {pickerHandler()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  fieldArea: {
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  typePicker: {
    width: '80%',
    backgroundColor: Colors.backgroundColor,
    marginVertical: 10,
    borderRadius: 10,
    padding: 5,
  },

  imagePickerContainer: {
    width: 130,
    height: 130,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputContainer: {
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
    padding: 5,
    minWidth: '80%',
    // minHeight: 50,
    // marginVertical: 10,
  },
  errorText: {
    color: 'red',
  },
  button: {
    marginTop: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
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
  disabledButton: {
    backgroundColor: Colors.backgroundColor,
    marginTop: 20,
  },
})

export default EditProfile
