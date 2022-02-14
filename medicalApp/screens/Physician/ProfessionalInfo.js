import React, {useState, useRef, useEffect, useContext} from 'react'
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
} from 'react-native'

import {useForm, Controller} from 'react-hook-form'
import DocumentPicker from 'react-native-document-picker'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Modal, Portal, Checkbox, ActivityIndicator} from 'react-native-paper'
import {useNavigation} from '@react-navigation/native'

import AuthButton from '../../components/AuthButton'
import Input from '../../components/Input'

import Colors from '../../constants/Colors'

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

const ProfessionalInfo = (props) => {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [countryNames, setCountryNames] = useState(defaultCountries)
  const [countryModal, setCountryModal] = useState(false)
  const [selectedCountries, setSelectedCountries] = useState([])
  const [docData, setDocData] = useState()
  const occupationRef = useRef()
  const licenseNoRef = useRef()
  const stateLicenseNoRef = useRef()
  const [stateName, setStateName] = useState('')

  let country
  const {
    control,
    handleSubmit,

    register,
    setValue,

    formState: {errors},
  } = useForm({
    mode: 'all',
  })

  const occupation = register('occupation')
  const licenseNo = register('licenseNo')
  const stateLicenseNo = register('stateLicenseNo')

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

  const onSubmit = async (data) => {
    props.navigation.navigate('bankingInfo', {
      ...props.route.params,
      occupation: data.occupation,
      licenseNumber: data.licenseNo,
      image: data.doc,
      statesValid: data.stateLicenseNo,
    })
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

  useEffect(() => {
    register('doc', {required: true})
    if (errors.doc) {
      Alert.alert('', 'Documents are required')
    }
  }, [errors.doc, register])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.mainScreen}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('signUp')
          }}
          style={styles.iconView}>
          <Icon
            name="arrow-back-ios"
            color={Colors.backgroundColor}
            size={20}
            style={{paddingLeft: 5}}
          />
        </TouchableOpacity>
        <View style={styles.fieldContainer}>
          <Image
            source={require('../../assets/signUpIcon.jpg')}
            style={styles.image}
          />
          <Text style={styles.fieldTitle}>Professional Information</Text>
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
                onSubmitEditing={() => {
                  stateLicenseNoRef.current.focus()
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
          <TouchableOpacity
            style={[styles.fieldView, {justifyContent: 'space-between'}]}
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

            <Text style={{fontFamily: 'OpenSans-Regular'}}>
              Upload Document
            </Text>
          </TouchableOpacity>
          {docData && (
            <Image
              source={require('../../assets/upload.png')}
              style={styles.fileImage}
            />
          )}
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <AuthButton onPress={handleSubmit(onSubmit)}>Continue</AuthButton>
          )}
          {countryNamePicker()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    width: '100%',

    backgroundColor: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  iconView: {
    backgroundColor: Colors.primary,
    width: '12%',
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginTop: -70,
    borderWidth: 10,
    borderColor: 'white',
  },
  screen: {
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
    width: 100,
    height: 100,
    backgroundColor: 'black',
    borderRadius: 50,

    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
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
    marginTop: 40,
    fontSize: 16,

    alignSelf: 'flex-start',
    fontFamily: 'OpenSans-Bold',
    paddingHorizontal: 20,
    marginVertical: 12,
    marginBottom: 20,
  },

  fieldContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 30,
    borderRadius: 20,
    marginTop: 30,
    backgroundColor: 'white',
  },
  fieldView: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: 'grey',
    marginBottom: 10,
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
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    borderColor: 'grey',
    alignItems: 'center',
  },
  socialText: {
    fontFamily: 'OpenSans-Regular',
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  textInput: {
    flexBasis: '90%',
    color: 'black',
    marginBottom: -5,
  },
})

export default ProfessionalInfo
