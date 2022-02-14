import React, {useState, useEffect} from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native'

import fetch from 'node-fetch'
import {useDispatch, useSelector} from 'react-redux'
import IndividualUserFrom from '../components/Individual User/SignUpForm'
import SpecialistFrom from '../components/Specialist User/SignUpForm'

import {login} from '../store/actions/auth'

import {APIURL} from '../constants/url'
import Colors from '../constants/Colors'
import {setLang} from '../store/actions/language'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SignUpScreen = (props) => {
  const [specialistMode, setSpecialistMode] = useState(false)
  const [error, setError] = useState()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const changeMode = () => {
    setSpecialistMode((prev) => !prev)
  }

  const {language, Already_Account, Sign_Up, SignIn} = useSelector((state) => {
    return state.language
  })

  const onSubmit = async (data) => {
    if (specialistMode) {
      // eslint-disable-next-line no-undef
      let uploadData = new FormData()
      const roleId = 3

      uploadData.append('role_id', roleId)
      uploadData.append('first_name', data.firstName)
      uploadData.append('last_name', data.lastName)
      uploadData.append('password', data.password)
      uploadData.append('email', data.email)
      uploadData.append('street', data.postal)
      uploadData.append('address', data.address)
      uploadData.append('city', data.city)
      uploadData.append('country', data.country)
      uploadData.append('phone_number', data.number)
      uploadData.append('number_siret', data.siretNumber)
      uploadData.append('Post_code', data.postal)
      uploadData.append('region', data.region)
      if (data.photo != null) {
        uploadData.append('img', {
          uri: data.photo.uri,
          name: data.photo.fileName,
          type: data.photo.type,
        })
      }
      uploadData.append('diploma', {
        uri: data.files[0].uri,
        name: data.files[0].fileName,
        type: data.files[0].type,
      })
      uploadData.append('cv', {
        uri: data.files[7].uri,
        name: data.files[7].fileName,
        type: data.files[7].type,
      })
      uploadData.append('identity_card', {
        uri: data.files[1].uri,
        name: data.files[1].fileName,
        type: data.files[1].type,
      })
      uploadData.append('identity_card_back', {
        uri: data.files[6].uri,
        name: data.files[6].fileName,
        type: data.files[6].type,
      })
      uploadData.append('driving_license', {
        uri: data.files[2].uri,
        name: data.files[2].fileName,
        type: data.files[2].type,
      })
      uploadData.append('driving_license_back', {
        uri: data.files[5].uri,
        name: data.files[5].fileName,
        type: data.files[5].type,
      })
      uploadData.append('rib', {
        uri: data.files[3].uri,
        name: data.files[3].fileName,
        type: data.files[3].type,
      })
      uploadData.append('kbis', {
        uri: data.files[4].uri,
        name: data.files[4].fileName,
        type: data.files[4].type,
      })

      // eslint-disable-next-line no-undef
      const headers = new Headers()
      headers.append('Content-Type', 'multipart/form-data')

      try {
        setLoading(true)
        const response = await fetch(`${APIURL}/api/register`, {
          method: 'POST',
          body: uploadData,
          headers,
        })

        console.log(response)
        const resData = await response.json()
        console.log(resData)
        if (!response.ok) {
          throw new Error(resData.message)
        }

        // dispatch(
        //   login(
        //     resData.data.user_data.id,
        //     resData.data.token,
        //     resData.data.user_data.role_id,
        //   ),
        // )
        props.navigation.replace('notActivated')
        AsyncStorage.setItem('notification', 1)
      } catch (e) {
        setError(e.message)

        setLoading(false)
      }
    } else {
      // eslint-disable-next-line no-undef
      const uploadData = new FormData()

      const roleId = 2

      uploadData.append('role_id', roleId)
      uploadData.append('first_name', data.firstName)
      uploadData.append('last_name', data.lastName)
      uploadData.append('password', data.password)
      uploadData.append('email', data.email)
      uploadData.append('street', data.postal)
      uploadData.append('address', data.address)
      uploadData.append('city', data.city)
      uploadData.append('country', data.country)
      uploadData.append('phone_number', data.number)
      uploadData.append('number_siret', data.siretNumber)
      uploadData.append('Post_code', data.postal)
      // uploadData.append('img', {
      //   uri: data.photo.uri,
      //   name: data.photo.fileName,
      //   type: data.photo.type,
      // })

      // eslint-disable-next-line no-undef
      const headers = new Headers()
      headers.append('Content-Type', 'multipart/form-data')
      setLoading(true)
      try {
        const response = await fetch(`${APIURL}/api/register`, {
          method: 'POST',
          body: uploadData,
          headers,
        })

        const resData = await response.json()
        console.log(resData)

        if (!response.ok) {
          throw new Error(resData.message)
        }
        dispatch(
          login(
            resData.data.user_data.id,
            resData.data.token,
            resData.data.user_data.role_id,
          ),
        )
      } catch (e) {
        console.log(e)
        setError(e.message)
      }
      setLoading(false)
    }
  }

  useEffect(
    () => {
      if (error) {
        Alert.alert('Error', error, [
          {text: 'Okay', onPress: () => setError(null), style: 'cancel'},
        ])
      }
    },
    [error],
  )

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={50}>
        <ScrollView contentContainerStyle={styles.screen}>
          <Image
            resizeMode="contain"
            source={require('../assets/logo.png')}
            style={{width: 350, height: 150, marginBottom: 10}}
          />
          {specialistMode ? (
            <SpecialistFrom
              changeMode={changeMode}
              onSubmit={onSubmit}
              loading={loading}
            />
          ) : (
            <IndividualUserFrom
              changeMode={changeMode}
              onSubmit={onSubmit}
              loading={loading}
            />
          )}
          <View style={{alignItems: 'center', marginTop: 10}}>
            <Text>{Already_Account}</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => props.navigation.navigate('signin')}>
              <Text
                style={{
                  color: Colors.primary,
                  marginVertical: 10,
                  fontSize: 16,
                }}>
                {SignIn}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 20,
  },
})

export default SignUpScreen
