import React, {useState, useRef} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
import {add} from 'react-native-reanimated'
import Input from '../components/Input'
import {useNavigation} from '@react-navigation/native'

const EditAddress = () => {
  // const navigation = useNavigation()
  const [fullName, setFullName] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [alternatePhone, setAlternatePhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [landmark, setLandmark] = useState('')
  const [locality, setLocality] = useState('')
  const [pinCode, setpinCode] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')

  const [nameValid, setNameValid] = useState('')
  const [mobileNoValid, setMobileNoValid] = useState('')
  const [alternatePhoneValid, setAlternatePhoneVaild] = useState('')
  const [addressValid, setAddressValid] = useState('')
  const [cityValid, setCityValid] = useState('')
  const [landmarkValid, setLandmarkValid] = useState('')
  const [localityValid, setLocalityValid] = useState('')
  const [pinCodeValid, setPinCodeValid] = useState('')
  const [stateValid, setStateValid] = useState('')
  const [countryValid, setCountryValid] = useState('')

  const updateFullName = (text) => {
    setFullName(text)
  }

  const updateMobileNo = (text) => {
    setMobileNo(text)
  }

  const updateAlternatePhone = (text) => {
    setAlternatePhone(text)
  }

  const updateAddress = (text) => {
    setAddress(text)
  }

  const updateCity = (text) => {
    setCity(text)
  }

  const updateLandmark = (text) => {
    setLandmark(text)
  }

  const updateLocality = (text) => {
    setLocality(text)
  }

  const updatePinCode = (text) => {
    setpinCode(text)
  }

  const updateState = (text) => {
    setState(text)
  }

  const updateCountry = (text) => {
    setCountry(text)
  }

  const proceedNext = () => {
    if (fullName === '') {
      setNameValid(true)
    } else {
      setNameValid(false)
    }

    if (mobileNo === '') {
      setMobileNoValid(true)
    } else {
      setMobileNoValid(false)
    }

    if (alternatePhone === '') {
      setAlternatePhoneVaild(true)
    } else {
      setAlternatePhoneVaild(false)
    }

    if (address === '') {
      setAddressValid(true)
    } else {
      setAddressValid(false)
    }

    if (city === '') {
      setCityValid(true)
    } else {
      setCityValid(false)
    }

    if (landmark === '') {
      setLandmarkValid(true)
    } else {
      setLandmarkValid(false)
    }

    if (locality === '') {
      setLocalityValid(true)
    } else {
      setLocalityValid(false)
    }

    if (pinCode === '') {
      setPinCodeValid(true)
    } else {
      setPinCodeValid(false)
    }

    if (state === '') {
      setStateValid(true)
    } else {
      setStateValid(false)
    }

    if (country === '') {
      setCountryValid(true)
    } else {
      setCountryValid(false)
    }

    if (
      (nameValid,
      mobileNoValid,
      alternatePhoneValid,
      addressValid,
      cityValid,
      landmarkValid,
      localityValid,
      pinCodeValid,
      stateValid === false)
    ) {
      // navigation.navigate('addAddress')
    }
  }

  return (
    <View style={styles.screen}>
      <Image
        style={{marginBottom: 30}}
        source={require('../assets/signupImage.png')}
      />
      <ScrollView contentContainerStyle={styles.fieldsContainer}>
        <View style={styles.fieldView}>
          <TextInput
            placeholder={'Full Name'}
            style={styles.input}
            placeholderTextColor="#2699FB"
            value={fullName}
            onChangeText={updateFullName}
          />
        </View>

        {nameValid === true ? (
          <Text style={styles.errorText}>Please Fill It</Text>
        ) : null}

        <View style={styles.fieldView}>
          <TextInput
            placeholder={'Mobile No'}
            style={styles.input}
            placeholderTextColor="#2699FB"
            value={mobileNo}
            onChangeText={updateMobileNo}
            keyboardType="numeric"
            maxLength={12}
          />
        </View>

        {mobileNoValid === true ? (
          <Text style={styles.errorText}>Please Fill It</Text>
        ) : null}

        <View style={styles.fieldView}>
          <TextInput
            placeholder={'Alternate Phone No.'}
            style={styles.input}
            placeholderTextColor="#2699FB"
            value={alternatePhone}
            onChangeText={updateAlternatePhone}
            keyboardType="numeric"
            maxLength={12}
          />
        </View>

        {alternatePhoneValid === true ? (
          <Text style={styles.errorText}>Please Fill It</Text>
        ) : null}

        <View style={[styles.fieldView, {height: '20%'}]}>
          <TextInput
            placeholder={'Address'}
            style={styles.input}
            placeholderTextColor="#2699FB"
            value={address}
            multiline={true}
            onChangeText={updateAddress}
          />
        </View>

        {addressValid === true ? (
          <Text style={styles.errorText}>Please Fill It</Text>
        ) : null}

        <View style={styles.fieldView}>
          <TextInput
            placeholder={'City'}
            style={styles.input}
            placeholderTextColor="#2699FB"
            value={city}
            onChangeText={updateCity}
          />
        </View>

        {cityValid === true ? (
          <Text style={styles.errorText}>Please Fill It</Text>
        ) : null}

        <View style={styles.fieldView}>
          <TextInput
            placeholder={'Landmark'}
            style={styles.input}
            placeholderTextColor="#2699FB"
            value={landmark}
            onChangeText={updateLandmark}
          />
        </View>

        {landmarkValid === true ? (
          <Text style={styles.errorText}>Please Fill It</Text>
        ) : null}

        <View style={styles.fieldView}>
          <TextInput
            placeholder={'Locality'}
            style={styles.input}
            placeholderTextColor="#2699FB"
            value={locality}
            onChangeText={updateLocality}
          />
        </View>

        {localityValid === true ? (
          <Text style={styles.errorText}>Please Fill It</Text>
        ) : null}

        <View style={styles.fieldView}>
          <TextInput
            placeholder={'Pin Code'}
            style={styles.input}
            placeholderTextColor="#2699FB"
            value={pinCode}
            keyboardType="numeric"
            maxLength={4}
            onChangeText={updatePinCode}
          />
        </View>

        {pinCodeValid === true ? (
          <Text style={styles.errorText}>Please Fill It</Text>
        ) : null}

        <View style={styles.fieldView}>
          <TextInput
            placeholder={'State'}
            style={styles.input}
            placeholderTextColor="#2699FB"
            value={state}
            onChangeText={updateState}
          />
        </View>

        {stateValid === true ? (
          <Text style={styles.errorText}>Please Fill It</Text>
        ) : null}

        <View style={styles.fieldView}>
          <TextInput
            placeholder={'Country'}
            style={styles.input}
            placeholderTextColor="#2699FB"
            value={country}
            onChangeText={updateCountry}
          />
        </View>

        {countryValid === true ? (
          <Text style={styles.errorText}>Please Fill It</Text>
        ) : null}
      </ScrollView>
      <View style={styles.options}>
        <TouchableOpacity onPress={proceedNext}>
          <LinearGradient
            colors={['#336CF9', '#1BE6D6']}
            style={styles.optionsView}
            start={{x: 0, y: 0}}
            end={{x: 1.2, y: 0}}>
            <Text style={styles.optionText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity>
          <LinearGradient
            colors={['#336CF9', '#F64BBD']}
            style={styles.optionsView}
            start={{x: 0.1, y: 0.1}}
            end={{x: 1, y: -0.1}}>
            <Text style={styles.optionText}>Cancel</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: '#F6F6FA',
    backgroundColor: '#F8FAFF',
  },
  fieldsContainer: {
    alignItems: 'center',
    // marginVertical: 10,
    // paddingTop: 30,
    paddingBottom: 170,
  },
  fieldView: {
    borderColor: '#BCE0FD',
    borderWidth: 1,
    width: '80%',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 30,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#2699FB',
  },
  errorText: {
    paddingTop: 5,
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // paddingTop: 40,
    // paddingHorizontal: 30,
    // width: '60%',
    alignContent: 'center',
    // alignSelf: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  optionsView: {
    textAlign: 'center',
    width: 120,
    // height: 200,
    paddingLeft: 5,
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#1BE6D6',
  },
  optionText: {
    color: 'white',
  },
})
export default EditAddress
