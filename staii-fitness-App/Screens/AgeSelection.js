import React, {useCallback, useRef, useState, useContext} from 'react'
import {View, Text, StyleSheet, Alert, ActivityIndicator} from 'react-native'
import WheelPicker from 'react-native-wheely'
import PrimaryButton from '../Components/PrimaryButton'

import AppContext from '../Context/AppContext'

import AsyncStorage from '@react-native-async-storage/async-storage'
import ages from '../Constants/Ages'
import ApiUrl from '../Constants/ApiUrl'

const AgeSelection = ({route, navigation}) => {
  const {user, sport} = route.params
  const {setUser} = useContext(AppContext)

  const selected = useRef(1)
  const [loading, setLoading] = useState(false)
  const [pickerAges, setPickerAges] = useState(ages)

  const data = {
    email: user.user_email,
    user_id: user.user_id,
    academy: user.accadamy_id,
    sports: sport.trim(),
    mongo_userid: 'dsights',
    mongo_password: 'dsights',
    role: user.user_type === 'student' ? 'student' : 'expert',
  }
  console.log(data)
  const setSelected = useCallback((index) => {
    selected.current = index + 1
  }, [])

  const sendAge = async () => {
    setLoading(true)
    const formData = new FormData()

    formData.append('token', 'ZFSgldjzfnvzkjdfbzdzfvbzdbdjkgSGVFddzfv')
    // formData.append('user_email', user.email)
    formData.append('method_type', 'updateAge')
    formData.append('age', selected.current)
    formData.append('user_id', user.user_id)

    try {
      const response = await fetch(`${ApiUrl}/completeaccount.php`, {
        method: 'POST',
        body: formData,
        'Content-type': 'application/json',
      })
      const resData = await response.json()
      console.log(resData)
      try {
        const regResponse = await fetch(
          'https://regis.staiideploy.com/registration',
          {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data),
          },
        )
        console.log(regResponse)
        await regResponse.json()
        setLoading(false)
        // const jsonUser = JSON.stringify(user.email)
        // const jsonIntro = JSON.stringify(true)
        await AsyncStorage.setItem('email', user.user_email)
        await AsyncStorage.setItem('appIntro', 'true')
        setUser(resData.Data[0])
      } catch (e) {
        setLoading(false)
        return Alert.alert('', e.message)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={styles.screen}>
      <View
        style={{flexDirection: 'row', marginBottom: 30, alignSelf: 'center'}}>
        <View style={[styles.stepIndicator, {backgroundColor: '#333333'}]} />
        {/* <View style={[styles.stepIndicator, {backgroundColor: '#333333'}]} /> */}
        <View style={styles.stepIndicator} />
      </View>
      <Text style={styles.heading}>How old are you?</Text>
      {/* <View style={{padding: 30}}> */}
      <WheelPicker
        // updateCellsBatchingPeriod={10}
        // initialNumToRender={20}
        // selectedIndex={selected}
        decelerationRate="normal"
        onChange={setSelected}
        options={pickerAges}
        itemTextStyle={{
          color: 'white',
          fontSize: 50,
          fontFamily: 'DMSans-Bold',
        }}
        visibleRest={2}
        itemHeight={90}
        selectedIndicatorStyle={{backgroundColor: 'black'}}
        containerStyle={{marginBottom: 50}}
      />

      {loading ? (
        <ActivityIndicator color={'white'} size={'large'} />
      ) : (
        <PrimaryButton activeOpacity={0.6} onPress={sendAge}>
          Next Step
        </PrimaryButton>
      )}
      {/* <TouchableOpacity activeOpacity={0.6}>
        <Text
          style={styles.skipText}
          onPress={() => navigation.replace('dashBoardStack')}>
          Skip for Now
        </Text>
      </TouchableOpacity> */}
      {/* </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: 'black',
    // alignItems: 'center',
  },
  heading: {
    color: '#FFFFFF',
    fontFamily: 'DMSans-Bold',
    fontSize: 24,
    marginVertical: 10,
    alignSelf: 'center',
  },
  sportText: {
    color: '#ffff',
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
  },
  selectedSportText: {
    color: '#828282',
  },
  sport: {
    padding: 18,
    marginVertical: 10,

    paddingHorizontal: 28,
    elevation: 5,
    backgroundColor: '#2B2B2B',
    borderRadius: 15,
    marginRight: 12,
  },
  selectedSport: {
    backgroundColor: 'white',
  },
  stepIndicator: {
    height: 4,
    borderColor: 'white',
    width: 45,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 5,
  },
  skipText: {
    fontFamily: 'DMSans-Bold',
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
})

export default AgeSelection
