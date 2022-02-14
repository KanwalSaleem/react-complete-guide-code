import React, {useEffect, useState} from 'react'

import {
  View,
  Text,
  Switch,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native'
import {ActivityIndicator, RadioButton} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AuthButton from '../components/AuthButton'
import Colors from '../constants/Colors'
import {APIURL} from '../constants/url'
import {useDispatch, useSelector} from 'react-redux'
import fetch from 'node-fetch'
import {setLang} from '../store/actions/language'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Settings = props => {
  const {token, pushId} = useSelector(state => state.auth)

  const [isEnabled, setIsEnabled] = useState(pushId ? true : false)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const {language, changeLanguage, accept} = useSelector(state => {
    return state.language
  })

  const toggleSwitch = async () => {
    // eslint-disable-next-line no-undef
    const headers = new Headers()

    headers.append('Accept', 'application/json')

    headers.append('Authorization', `Bearer ${token}`)

    // eslint-disable-next-line no-undef
    const formData = new FormData()
    formData.append('notification', isEnabled === false ? 1 : 0)
    const requestOptions = {
      method: 'POST',
      headers,
      body: formData,

      //   redirect: 'follow',
    }
    setIsLoading(true)
    try {
      const response = await fetch(`${APIURL}/api/notification`, requestOptions)
      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message)
      }
      AsyncStorage.setItem('notification', resData.data)

      setIsEnabled(prev => !prev)
    } catch (e) {
      Alert.alert('Error', e.message)
    }
    setIsLoading(false)
  }

  useEffect(
    () => {
      const unsubscribed = props.navigation.addListener('focus', async () => {
        // Screen was focused
        // Do something

        const notification = await AsyncStorage.getItem('notification')
        setIsEnabled(notification == 0 ? false : true)
      })

      return unsubscribed
    },
    [props.navigation],
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.text}>{changeLanguage}</Text>

        <View style={styles.items}>
          <View style={styles.country}>
            <View style={styles.countryOption}>
              <RadioButton
                color="grey"
                value="first"
                status={language === 'french' ? 'checked' : 'unchecked'}
                onPress={() => dispatch(setLang('FRENCH'))}
              />
              <Text style={styles.countrytext}>French </Text>
            </View>
            <Image
              style={styles.image}
              source={require('../assets/images/French.png')}
            />
          </View>

          <View style={styles.country}>
            <View style={styles.countryOption}>
              <RadioButton
                color="grey"
                value="second"
                status={language === 'english' ? 'checked' : 'unchecked'}
                onPress={() => dispatch(setLang('ENGLISH'))}
              />
              <Text style={styles.countrytext}>English</Text>
            </View>
            <Image
              style={styles.image}
              source={require('../assets/images/English.png')}
            />
          </View>

          <View style={styles.country}>
            <View style={styles.countryOption}>
              <RadioButton
                color="grey"
                value="third"
                status={language === 'turkish' ? 'checked' : 'unchecked'}
                onPress={() => dispatch(setLang('TURKISH'))}
              />

              <Text style={styles.countrytext}>Turkish</Text>
            </View>
            <Image
              style={styles.image}
              source={require('../assets/images/Turkish.png')}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => props.navigation.navigate('signin')}
          style={styles.nextBtn}>
          <Text style={styles.nexttext}>{accept}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageview}>
        <Image
          style={styles.image1}
          source={require('../assets/images/ftBg.png')}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  nexttext: {
    color: '#FFFF',
    fontSize: 17,
  },
  nextBtn: {
    marginTop: 30,
    marginLeft: '5%',
    width: '90%',
    height: 50,
    backgroundColor: '#00B6A8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
  },
  body: {
    paddingHorizontal: 20,
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
    alignItems: 'center',
  },
  items: {
    marginTop: 20,
  },
  country: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  countrytext: {
    color: 'black',
    fontSize: 14,
  },
  image: {
    width: '7%',
    height: 20,

    marginTop: 15,
    marginRight: 8,
  },
  notifications: {
    marginTop: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  switch: {
    //  marginTop: -17,
    // alignItems: 'center',
  },
  imageview: {
    justifyContent: 'flex-end',
    // height:200,
    flex: 1,
  },
  image1: {
    width: '100%',
    height: 162,
    // top: '100%',
  },
  editSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  editButton: {
    height: 45,
    width: 45,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default Settings
