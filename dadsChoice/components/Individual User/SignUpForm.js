import React, {useRef, useState, useEffect} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  Alert,
  Image,
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'
import {useDispatch, useSelector} from 'react-redux'
import {Picker} from '@react-native-picker/picker'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {useForm, Controller} from 'react-hook-form'
import {setLang} from '../store/actions/language'
import {Modal, Portal, Button, ActivityIndicator} from 'react-native-paper'

import Input from '../Input'
import AuthButton from '../AuthButton'

import Colors from '../../constants/Colors'

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
const SignUpForm = (props) => {
  const [selectedCounty, setSelectedCountry] = useState('')
  const [visible, setVisible] = useState(false)

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
    language,
    Individual_User,
    Specialist_User,
    First_Name,
    Last_Name,
    Email_Address,
    Street_Address,
    City_Address,
    Postal_Code,
    Country_Address,
    Phone_Number,
    Already_Account,
    Sign_Up,
    SignIn,
    Password,
    Region_Address,
  } = useSelector((state) => {
    return state.language
  })

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: {isValid, errors},
  } = useForm({
    mode: 'all',
    defaultValues: {photo: ''},
  })

  const firstName = register('firstName')
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

      register('photo', {value: photo.current})
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
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
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

  const onSubmit = (data) => {
    props.onSubmit(data)
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

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setVisible(true)}>
            {!photo.current ? (
              <View style={styles.imagePickerContainer}>
                <Icon
                  style={styles.inputIcon}
                  name="photo-camera"
                  color="#4F8EF7"
                  size={30}
                />
              </View>
            ) : (
              <Image
                source={{uri: photo.current.uri}}
                style={{
                  width: 130,
                  height: 130,
                  resizeMode: 'cover',
                  borderRadius: 100,
                }}
              />
            )}
          </TouchableOpacity>

          <Controller
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
                  }}
                  mode="dropdown">
                  <Picker.Item label={Individual_User} value="individualUser" />
                  <Picker.Item label={Specialist_User} value="specialistUser" />
                </Picker>
              </View>
            )}
          />
          <View style={styles.fieldArea}>
            <View style={styles.inputContainer}>
              <Input
                control={control}
                name="firstName"
                placeholder={First_Name}
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
                placeholder={Last_Name}
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
                placeholder={Email_Address}
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
                placeholder={Street_Address}
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
                placeholder={City_Address}
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
                placeholder={Postal_Code}
                rules={{required: true}}
                ref={(e) => {
                  postal.ref(e)
                  postalRef.current = e
                }}
                onSubmitEditing={() => {
                  regionRef.current.focus()
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
              <Picker
                // style={{width: '100%'}}
                name="country"
                placeholder={Country_Address}
                rules={{required: true}}
                ref={(e) => {
                  country.ref(e)
                  countryRef.current = e
                }}
                onSubmitEditing={() => {
                  emailRef.current.focus()
                }}
                blurOnSubmit={false}
                selectedValue={selectedCounty}
                onValueChange={(itemValue) => {
                  setSelectedCountry(itemValue)
                  setValue('country', itemValue)
                }}>
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
                    color={'black'}
                  />
                ))}
              </Picker>
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
                placeholder={Phone_Number}
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
                placeholder={Password}
                rules={{required: true}}
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
          {props.loading ? (
            <ActivityIndicator size={'large'} color={Colors.primary} />
          ) : (
            <AuthButton
              // disabled={!isValid}
              onPress={handleSubmit(onSubmit)}
              style={styles.button}>
              {Sign_Up}
            </AuthButton>
          )}
        </>
      </TouchableWithoutFeedback>
      {pickerHandler()}
    </>
  )
}

const styles = StyleSheet.create({
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

export default SignUpForm
