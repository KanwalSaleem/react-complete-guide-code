import React, {useRef, useState, useEffect} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import {useForm} from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {ActivityIndicator} from 'react-native-paper'
import {useNavigation} from '@react-navigation/native'

import AuthButton from '../../components/AuthButton'
import Input from '../../components/Input'

import Colors from '../../constants/Colors'

const ProfessionalInfo = (props) => {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [docData, setDocData] = useState()
  const typeRef = useRef()
  const makeRef = useRef()
  const modelRef = useRef()
  const yearRef = useRef()
  const occupationRef = useRef()
  const licenseNoRef = useRef()

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

  const driverLicenseNo = register('driverLicenseNo')
  const type = register('type')
  const make = register('make')
  const model = register('model')
  const year = register('year')

  const driverLicenseNoRef = useRef()

  const filePickerHandler = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
          DocumentPicker.types.doc,
        ],
      })
      console.log('response:', response)

      setDocData(response[0].uri)
      setValue('doc', response[0], {
        shouldValidate: true,
        shouldDirty: true,
      })
    } catch (e) {
      console.log(e)
    }
  }

  const onSubmit = async (data) => {
    // console.log(data.doc)
    props.navigation.navigate('bankingInfo', {
      ...props.route.params,
      occupation: data.occupation,
      licenseNumber: data.licenseNo,
      driverLicense: data.driverLicenseNo,
      type: data.type,
      make: data.make,
      model: data.model,
      year: data.year,
      image: data.doc,
    })
  }

  useEffect(() => {
    register('doc', {required: true})
    if (errors.doc) {
      Alert.alert('', 'Vehicle Photo is required')
    }
  }, [docData, errors.doc, register])

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={10}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.screen}>
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
            style={styles.infoImage}
          />
          <Text style={[styles.fieldTitle, {marginVertical: 10}]}>
            Professional Information
          </Text>
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
                driverLicenseNoRef.current.focus()
              }}
              blurOnSubmit={false}
              returnKeyType="go"
              placeholderTextColor="black"
              style={styles.textInput}
            />
          </View>
          {errors.licenseNo && (
            <Text style={styles.errorText}>This field is required</Text>
          )}
          <Text style={styles.fieldTitle}>Vehicle Details</Text>
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
            <View style={{alignItems: 'center'}}>
              <Icon name="publish" color="black" size={30} />
              <Text style={{fontFamily: 'OpenSans-Regular'}}>
                Add Vehicle Photo
              </Text>
            </View>
          </TouchableOpacity>
          {docData && (
            <Image source={{uri: docData}} style={styles.fileImage} />
          )}
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <AuthButton
              onPress={handleSubmit(onSubmit)}
              style={{marginTop: 20, elevation: 4}}>
              Continue
            </AuthButton>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,

    backgroundColor: Colors.black,
    paddingHorizontal: 10,
  },
  iconView: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    width: '12%',
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  infoImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: -60,
    borderWidth: 10,
    borderColor: 'white',
  },
  alertHeading: {
    fontSize: 20,
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
    marginBottom: 20,
  },

  fieldContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    marginBottom: 20,
    marginTop: 60,
    paddingBottom: 15,
  },
  fieldView: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
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

  buttonText: {
    color: 'white',

    fontFamily: 'OpenSans-Bold',
  },
  infoContainer: {
    marginVertical: 10,

    alignItems: 'center',
    alignSelf: 'center',
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
    marginTop: 10,
    borderRadius: 10,
    resizeMode: 'cover',
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

  textInput: {
    flexBasis: '90%',
    color: 'black',
    marginBottom: -5,
  },
})

export default ProfessionalInfo
