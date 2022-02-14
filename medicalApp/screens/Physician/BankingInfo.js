import React, {useState, useRef, useLayoutEffect} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ToastAndroid,
  BackHandler,
} from 'react-native'

import {useForm} from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Modal, Portal, ActivityIndicator} from 'react-native-paper'
import AuthButton from '../../components/AuthButton'
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import Input from '../../components/Input'

import Colors from '../../constants/Colors'
import {APIURL} from '../../constants/url'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BankingInfo = (props) => {
  const {
    roleId,
    firstName,
    email,
    image,
    lastName,
    licenseNumber,
    occupation,
    password,
    passwordConfirm,
    driverLicense,
    phone,

    state,
    photo,
    statesValid,
    termsCondition,
    zipCode,
    city,
    addressLine1,
    location,
    type,
    make,
    model,
    year,
  } = props.route.params

  // console.log(props.route.params)

  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const holderNameRef = useRef()
  const accountNoRef = useRef()
  const routingNoRef = useRef()

  const {
    control,
    handleSubmit,

    register,

    formState: {errors},
  } = useForm({
    mode: 'all',
  })

  const holderName = register('holderName')
  const accountNo = register('accountNo')
  const routingNo = register('routingNo')

  const onSubmit = async (data) => {
    // console.log(data)
    // console.log(password, passwordConfirm)
    const form = new FormData()

    const pushId = await AsyncStorage.getItem('pushId')
    const pushToken = JSON.parse(pushId)

    //photo to be appended
    //states valid to be appended
    form.append('notification_token', pushToken)
    form.append('role_id', roleId)
    form.append('first_name', firstName)
    form.append('last_name', lastName)
    form.append('email', email)
    form.append('addressline_1', addressLine1)

    form.append('city', city)
    form.append('state', state)
    form.append('zipcode', zipCode)
    form.append('phone', phone)
    form.append('password', password)
    form.append('password_confirmation', password)
    form.append('terms_condition', termsCondition)
    form.append('dob', '1998')
    form.append('latitude', location.latitude)
    form.append('longitude', location.longitude)

    if (roleId == 3) {
      const validStates = statesValid.map((state) => state.name)
      validStates.forEach((state) => form.append('state_id[]', state))
    }

    // form.append('state_id[]', 'asd')

    form.append('image', {
      type: photo.type,
      uri: photo.uri,
      name: photo.fileName,
    })
    form.append('image1', {
      type: image.type,
      uri: image.uri,
      name: image.name,
    })
    // form.append(
    //   'image',
    //   'IMG-20211005-WA0001.jpeg',
    //   'content://com.android.providers.media.documents/document/image%3A60733',
    // )
    form.append('dob', '1998')
    form.append('occupation', occupation)
    form.append('license_number', licenseNumber)

    if (
      data.holderName == undefined ||
      data.accountNo == undefined ||
      data.routingNo == undefined
    ) {
      form.append('account_holder_name', null)
      form.append('bank_account_number', null)
      form.append('bank_routing_number', null)
    } else {
      form.append('account_holder_name', data.holderName)
      form.append('bank_account_number', data.accountNo)
      form.append('bank_routing_number', data.routingNo)
    }

    const headers = new Headers()
    headers.append('Content-Type', 'multipart/form-data')
    if (roleId === 2) {
      form.append('driving_license_number', driverLicense)
      form.append('type', type)
      form.append('make', make)
      form.append('model', model)
      form.append('year', year)
    }
    setLoading(true)
    try {
      const response = await fetch(`${APIURL}/api/signup`, {
        method: 'POST',
        body: form,
        headers,
        redirect: 'follow',
      })
      console.log(response, 'response')

      const resData = await response.json()
      console.log(resData)
      console.log(resData, 'resData')
      if (!response.ok) {
        throw new Error(resData.message)
      }
      if (resData.success) {
        ToastAndroid.showWithGravity(
          resData.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
        props.navigation.navigate('otp', {
          token: resData.data.token,
          user: resData.data['user-data'],
        })
      }

      if (!resData.success) {
        throw new Error(resData.message)
      }
    } catch (e) {
      if (e.message === 'Validation Error!') {
        ToastAndroid.showWithGravity(
          'The email has already been taken.',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      } else {
        ToastAndroid.showWithGravity(
          e.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      }
    }

    setLoading(false)
    console.log(form)
    // console.log(form.image)
    console.log(photo)
  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (loading) {
          return true
        } else {
          return false
        }

        // CommonActions.reset({
        //   index: 4,
        //   routes: [{name: 'signUp'}],
        // });

        // if (visible === true) {
        // const pushAction = StackActions.push('signUp');
        // navigation.dispatch(pushAction);
        // setVisible(false);
        // return true;
        // } else {
        // return false;
        // }
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [loading]),
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <></>,
    })
  })

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            style={{paddingLeft: 5}}
          />
        </TouchableOpacity>
        <View style={styles.fieldContainer}>
          <Image
            source={require('../../assets/signUpIcon.jpg')}
            style={styles.image}
          />
          <Text style={styles.fieldTitle}>Add Banking Information </Text>
          <View style={styles.fieldView}>
            <Input
              control={control}
              name="holderName"
              rules={{
                // required: true,
                pattern: {
                  value: /^([\w]{3,})+\s+([\w\s]{3,})+$/i,
                  message: 'Enter you Full Name with spaces',
                },
              }}
              autoCapitalize="characters"
              placeholder="Account Holder Name (Optional)"
              ref={(e) => {
                holderName.ref(e)
                holderNameRef.current = e
              }}
              onSubmitEditing={() => {
                accountNoRef.current.focus()
              }}
              blurOnSubmit={false}
              returnKeyType="next"
              placeholderTextColor="black"
              style={styles.textInput}
            />
          </View>
          {errors.holderName && (
            <Text style={styles.errorText}>{errors.holderName.message}</Text>
          )}

          <View style={styles.fieldView}>
            <Input
              control={control}
              name="accountNo"
              rules={{
                pattern: {
                  value: /^[0-9]*$/,
                  message:
                    'Enter a 6 digits minimum or 16 digits maximum Number ',
                },
                // required: {value: false, message: 'Enter a 16 digit number'},
                type: 'number',
                minLength: 6,
                maxLength: 16,
              }}
              maxLength={16}
              placeholder="Bank Account Number (Optional)"
              ref={(e) => {
                accountNo.ref(e)
                accountNoRef.current = e
              }}
              keyboardType="number-pad"
              onSubmitEditing={() => {
                routingNoRef.current.focus()
              }}
              blurOnSubmit={false}
              returnKeyType="next"
              placeholderTextColor="black"
              style={{color: 'black'}}
            />
          </View>

          {errors.accountNo && (
            <Text style={styles.errorText}>{'Enter 6 minimum digits!'}</Text>
          )}

          <View style={styles.fieldView}>
            <Input
              control={control}
              name="routingNo"
              rules={{
                // required: true,
                type: 'number',
                // minLength: 9,
                // maxLength: 30,
              }}
              // maxLength={30}
              placeholder="Bank Routing Number (Optional)"
              ref={(e) => {
                routingNo.ref(e)
                routingNoRef.current = e
              }}
              keyboardType="number-pad"
              onSubmitEditing={() => {
                routingNoRef.current.blur()
              }}
              returnKeyType="go"
              placeholderTextColor="black"
              style={{color: 'black'}}
            />
          </View>
          {/* {errors.routingNo && (
            <Text style={styles.errorText}>This field is required</Text>
          )} */}
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <AuthButton style={styles.button} onPress={handleSubmit(onSubmit)}>
              Continue
            </AuthButton>
          )}
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
    marginTop: -50,
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
    paddingBottom: 30,
    borderRadius: 20,
    marginTop: 30,
    backgroundColor: 'white',
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
  },

  modalContainer: {
    marginHorizontal: 10,

    alignItems: 'center',
    paddingVertical: 40,
    paddingBottom: 30,
    borderRadius: 20,
    marginTop: 30,
    backgroundColor: 'white',
  },

  doneView: {
    backgroundColor: '#4BAD26',
    width: '18%',
    height: 60,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  textView: {
    width: '80%',
    marginVertical: 30,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
  },
  button: {
    marginTop: 25,
  },
})

export default BankingInfo
