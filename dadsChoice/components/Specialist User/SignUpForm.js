import React, {useState, useRef, useContext, useEffect} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {Picker} from '@react-native-picker/picker'
import {useDispatch, useSelector} from 'react-redux'
import DocumentPicker from 'react-native-document-picker'
import {useForm, Controller} from 'react-hook-form'
import {Portal, Modal, Button, ActivityIndicator} from 'react-native-paper'
import {setLang} from '../store/actions/language'

import Input from '../Input'
import AuthButton from '../AuthButton'

import Colors from '../../constants/Colors'
import StepIndicator from 'react-native-step-indicator'
import {AuthContext} from '../../context/auth'

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
// let index = 0
const images = []
const SignUpForm = (props) => {
  // const {changeUserType, login} = useContext(AuthContext)
  const [fileIndex, setFileIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [cameraModalVisible, setCameraModalVisible] = useState(false)
  const photo = useRef()
  const [selectedCounty, setSelectedCountry] = useState('')

  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const cityRef = useRef()
  const postalRef = useRef()
  const countryRef = useRef()
  const addressRef = useRef()
  const emailRef = useRef()
  const numberRef = useRef()
  const siretNumberRef = useRef()
  const regionRef = useRef()

  const {
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
    numberSiret,
    Sign_Up,

    Next,
    Diploma,
    Identity,
    Identity_Back,
    Driver_License,
    Driver_License_Back,
    RIB,
    KIB,
    Password,
    Region_Address,
  } = useSelector((state) => {
    return state.language
  })

  const {
    handleSubmit,
    formState: {isValid, errors},
    control,
    register,
    setValue,
  } = useForm({mode: 'all'})
  const [formStep, setFormStep] = React.useState(1)
  const firstName = register('firstName')
  const lastName = register('lastName')
  const city = register('city')
  const postal = register('postal')
  const country = register('country', {required: true})
  const address = register('address')
  const email = register('email')
  const number = register('number')
  const siretNumber = register('siretNumber')
  const password = register('password')
  const region = register('region')

  const onSubmit = (data) => {
    props.onSubmit(data)
  }
  const handleStepCompletion = () => {
    isValid && setFormStep((cur) => cur + 1)
  }

  // {Function to launchCamera for other files}
  const fileCameraHandler = () => {
    // index = attr
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

      // photo.current = response.assets ? response.assets[0].uri : undefined
      images[fileIndex] = response.assets
        ? {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            fileName: response.assets[0].fileName,
          }
        : undefined

      setValue('files', images)
      setVisible(false)
    })
  }

  // {Function to choose files for others}

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

      images[fileIndex] = {
        uri: response.uri,
        type: response.type,
        fileName: response.name,
      }

      setValue('files', images)
      setVisible(false)
    } catch (e) {
      setVisible(false)
    }
  }
  console.log(errors)

  // {Function to launch camera for main photo}
  const accessCamera = () => {
    const options = {
      path: 'images',
      mediaType: 'photo',
      skipBackup: true,
    }

    launchCamera(options, (response) => {
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        )
      }

      photo.current = response.assets ? response.assets[0] : undefined
      // images[index] = uri
      setCameraModalVisible(false)
      setValue('photo', photo.current)
    })
  }

  // {Function to launch gallery for main photo}

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

      setCameraModalVisible(false)
    })
  }

  useEffect(() => {
    return () => (images.length = 0)
  }, [])

  const formButton = () => {
    if (formStep > 2) return undefined
    else if (formStep === 2) {
      return (
        <AuthButton
          // disable={!isValid}
          onPress={handleSubmit(onSubmit)}
          style={styles.button}>
          {Sign_Up}
        </AuthButton>
      )
    } else {
      return (
        <AuthButton
          disabled={!isValid}
          onPress={formStep === 2 ? undefined : handleStepCompletion}
          style={styles.button}>
          {Next}
        </AuthButton>
      )
    }
  }

  // {Modal to pick files for second form stage}

  const filePickModal = () => {
    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          {/* <View> */}
          <Text style={styles.alertHeading}>Choose an Option</Text>
          <View style={styles.modalButtonsContainer}>
            <Button onPress={fileCameraHandler} color={Colors.primary}>
              Take a Photo
            </Button>
            <Button
              onPress={filePickerHandler}
              color={Colors.primary}
              style={{
                fontSize: 16,
              }}>
              Choose from Files
            </Button>
          </View>
          {/* </View> */}
        </Modal>
      </Portal>
    )
  }

  // {Modal to Pick image for first form stage}

  const imagePickModal = () => {
    return (
      <Portal>
        <Modal
          visible={cameraModalVisible}
          onDismiss={() => setCameraModalVisible(false)}
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
        <View style={{width: '80%'}}>
          <View style={{marginVertical: 20}}>
            <StepIndicator
              onPress={(position) => {
                setFormStep((prev) => {
                  if (prev === 1) {
                    setFormStep(position + 1)
                  } else if (prev === 2) {
                    setFormStep(1)
                  } else if (prev === 0) {
                    setFormStep(position + 1)
                  }
                })
              }}
              currentPosition={formStep - 1}
              stepCount={2}
              customStyles={{
                labelColor: Colors.secondGreen,
                stepStrokeCurrentColor: Colors.secondGreen,
                currentStepLabelColor: Colors.secondGreen,
                separatorUnFinishedColor: Colors.grey,
                separatorFinishedColor: Colors.secondGreen,
                stepIndicatorFinishedColor: Colors.secondGreen,
                stepIndicatorUnFinishedColor: Colors.grey,
                stepIndicatorLabelFontSize: 10,
                currentStepStrokeWidth: 3,
                stepIndicatorLabelCurrentColor: Colors.secondGreen,
                currentStepIndicatorSize: 30,
              }}
            />
          </View>
          {formStep >= 1 && (
            <View style={{display: formStep === 1 ? 'flex' : 'none'}}>
              <View style={styles.subContainer}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setCameraModalVisible(true)}>
                  <View style={styles.imagePickerContainer}>
                    {photo.current ? (
                      <Image
                        source={{uri: photo.current.uri}}
                        style={{
                          width: 130,
                          height: 130,
                          resizeMode: 'cover',
                          borderRadius: 100,
                        }}
                      />
                    ) : (
                      <Icon
                        style={styles.inputIcon}
                        name="photo-camera"
                        color="#4F8EF7"
                        size={30}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <Controller
                control={control}
                name="userType"
                defaultValue={'specialistUser'}
                render={({value}) => (
                  <View style={styles.typePicker}>
                    <Picker
                      selectedValue={value}
                      onValueChange={() => {
                        // setValue('userType', itemValue)
                        props.changeMode()
                        // changeUserType('individual')
                      }}
                      mode="dropdown">
                      <Picker.Item
                        label={Specialist_User}
                        value="specialistUser"
                      />
                      <Picker.Item
                        label={Individual_User}
                        value="individualUser"
                      />
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
                    color={'black'}
                    onSubmitEditing={() => {
                      lastNameRef.current.focus()
                    }}
                    blurOnSubmit={false}
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
                      addressRef.current.focus()
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
                    name="address"
                    style={{textAlignVertical: 'top', height: 100}}
                    placeholder={Street_Address}
                    rules={{required: true}}
                    multiline={true}
                    numberOfLines={4}
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
                      postalRef.current.blur()
                      regionRef.current.focus()
                    }}
                    // blurOnSubmit={false}
                  />
                </View>
                {errors.postal && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}
              </View>
              <View />
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
                  <Picker
                    style={{width: '100%'}}
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
                      />
                    ))}
                  </Picker>
                </View>
                {errors.country && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}
              </View>

              <View style={styles.fieldArea}>
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
                        emailRef.current.blur()
                      }}
                      blurOnSubmit={false}
                      returnKeyType="done"
                      keyboardType="email-address"
                    />
                  </View>
                  {errors.email && (
                    <Text style={styles.errorText}>This field is required</Text>
                  )}
                </View>
              </View>
            </View>
          )}
          {/* <View style={styles.subContainer}> */}
          {formStep >= 2 && (
            <View style={{display: formStep === 2 ? 'flex' : 'none'}}>
              <View style={styles.fieldArea}>
                <View style={styles.inputContainer}>
                  <Input
                    control={control}
                    name="number"
                    placeholder={Phone_Number}
                    rules={{required: true, type: 'number'}}
                    keyboardType="phone-pad"
                    ref={(e) => {
                      number.ref(e)
                      numberRef.current = e
                    }}
                    onSubmitEditing={() => {
                      siretNumberRef.current.focus()
                    }}
                    blurOnSubmit={false}
                  />
                </View>
                {errors.number && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}
              </View>
              <View style={styles.pickerArea}>
                <Text style={styles.pickerText}>{Diploma}</Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      setVisible(true)
                      setFileIndex(0)
                    }}>
                    <View style={styles.filePickerContainer}>
                      {images[0] ? (
                        <Image
                          // source={require('../../assets/document-icon.jpg')}
                          source={
                            images[0].type.includes('image')
                              ? {uri: images[0].uri}
                              : require('../../assets/document-icon.jpg')
                          }
                          style={styles.fileImage}
                        />
                      ) : (
                        <Icon
                          style={styles.inputIcon}
                          name="photo-camera"
                          color="#4F8EF7"
                          size={30}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{marginLeft: 20}}
                    activeOpacity={0.6}
                    onPress={() => {
                      setVisible(true)
                      setFileIndex(7)
                    }}>
                    <View style={styles.filePickerContainer}>
                      {images[7] ? (
                        <Image
                          // source={require('../../assets/document-icon.jpg')}
                          source={
                            images[7].type.includes('image')
                              ? {uri: images[7].uri}
                              : require('../../assets/document-icon.jpg')
                          }
                          style={styles.fileImage}
                        />
                      ) : (
                        <Icon
                          style={styles.inputIcon}
                          name="photo-camera"
                          color="#4F8EF7"
                          size={30}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.pickerArea}>
                <Text style={styles.pickerText}>{Identity}</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setVisible(true)
                    setFileIndex(1)
                  }}>
                  <View style={styles.filePickerContainer}>
                    {images[1] ? (
                      <Image
                        source={
                          images[1].type.includes('image')
                            ? {uri: images[1].uri}
                            : require('../../assets/document-icon.jpg')
                        }
                        style={styles.fileImage}
                      />
                    ) : (
                      <Icon
                        style={styles.inputIcon}
                        name="photo-camera"
                        color="#4F8EF7"
                        size={30}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerArea}>
                <Text style={styles.pickerText}>{Identity_Back}</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setVisible(true)
                    setFileIndex(6)
                  }}>
                  <View style={styles.filePickerContainer}>
                    {images[6] ? (
                      <Image
                        source={
                          images[6].type.includes('image')
                            ? {uri: images[6].uri}
                            : require('../../assets/document-icon.jpg')
                        }
                        style={styles.fileImage}
                      />
                    ) : (
                      <Icon
                        style={styles.inputIcon}
                        name="photo-camera"
                        color="#4F8EF7"
                        size={30}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.pickerArea}>
                <Text style={styles.pickerText}>{Driver_License}</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setVisible(true)
                    setFileIndex(2)
                  }}>
                  <View style={styles.filePickerContainer}>
                    {images[2] ? (
                      <Image
                        source={
                          images[2].type.includes('image')
                            ? {uri: images[2].uri}
                            : require('../../assets/document-icon.jpg')
                        }
                        style={styles.fileImage}
                      />
                    ) : (
                      <Icon
                        style={styles.inputIcon}
                        name="photo-camera"
                        color="#4F8EF7"
                        size={30}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerArea}>
                <Text style={styles.pickerText}>{Driver_License_Back}</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setVisible(true)
                    setFileIndex(5)
                  }}>
                  <View style={styles.filePickerContainer}>
                    {images[5] ? (
                      <Image
                        source={
                          images[5].type.includes('image')
                            ? {uri: images[5].uri}
                            : require('../../assets/document-icon.jpg')
                        }
                        style={styles.fileImage}
                      />
                    ) : (
                      <Icon
                        style={styles.inputIcon}
                        name="photo-camera"
                        color="#4F8EF7"
                        size={30}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerArea}>
                <Text style={styles.pickerText}>{RIB}</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setVisible(true)
                    setFileIndex(3)
                  }}>
                  <View style={styles.filePickerContainer}>
                    {images[3] ? (
                      <Image
                        source={
                          images[3].type.includes('image')
                            ? {uri: images[3].uri}
                            : require('../../assets/document-icon.jpg')
                        }
                        style={styles.fileImage}
                      />
                    ) : (
                      <Icon
                        style={styles.inputIcon}
                        name="photo-camera"
                        color="#4F8EF7"
                        size={30}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.pickerArea}>
                <Text style={styles.pickerText}>{KIB}</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setVisible(true)
                    setFileIndex(4)
                  }}>
                  <View style={styles.filePickerContainer}>
                    {images[4] ? (
                      <Image
                        source={
                          images[4].type.includes('image')
                            ? {uri: images[4].uri}
                            : require('../../assets/document-icon.jpg')
                        }
                        style={styles.fileImage}
                      />
                    ) : (
                      <Icon
                        style={styles.inputIcon}
                        name="photo-camera"
                        color="#4F8EF7"
                        size={30}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.fieldArea}>
                <View style={styles.inputContainer}>
                  <Input
                    control={control}
                    name="siretNumber"
                    placeholder={numberSiret}
                    keyboardType={'phone-pad'}
                    rules={{required: true}}
                    ref={(e) => {
                      siretNumber.ref(e)
                      siretNumberRef.current = e
                    }}
                    onSubmitEditing={() => {
                      password.current.focus()
                    }}
                    blurOnSubmit={false}
                  />
                </View>
                {errors.siretNumber && (
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
                    returnKeyType="done"
                    ref={(e) => {
                      password.ref(e)
                      password.current = e
                    }}
                    onSubmitEditing={() => {
                      password.current.focus()
                    }}
                    blurOnSubmit={false}
                  />
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>This field is required</Text>
                )}
              </View>
            </View>
          )}
          {props.loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            formButton()
          )}
          {/* </View> */}
          {/* <Text>{JSON.stringify(watch())}</Text> */}
        </View>
      </TouchableWithoutFeedback>
      {filePickModal()}
      {imagePickModal()}
    </>
  )
}

const styles = StyleSheet.create({
  subContainer: {
    alignItems: 'center',
    width: '100%',
  },
  fieldArea: {
    marginVertical: 10,
  },
  typePicker: {
    // width: 200,
    backgroundColor: Colors.backgroundColor,
    marginVertical: 10,
    borderRadius: 10,
  },
  image: {
    width: 350,
    height: 150,
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
    minWidth: '75%',
    // minHeight: 50,
    // marginVertical: 10,
  },
  errorText: {
    color: 'red',
  },
  button: {
    marginTop: 20,
    minWidth: '100%',
  },
  disabledButton: {
    backgroundColor: Colors.backgroundColor,
    width: '100%',
    marginTop: 20,
  },
  filePickerContainer: {
    width: 130,
    height: 130,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerArea: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  pickerText: {
    color: Colors.grey,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 5,
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
  fileImage: {
    width: '100%',
    height: '100%',
    // resizeMode: 'center',
    borderRadius: 20,
  },
})

export default SignUpForm
