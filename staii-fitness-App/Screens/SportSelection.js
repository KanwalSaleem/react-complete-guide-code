import React, {useEffect, useState, useContext} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import ProgressDialog from 'react-native-progress-dialog'

import AppContext from '../Context/AppContext'
import PrimaryButton from '../Components/PrimaryButton'
import ApiUrl from '../Constants/ApiUrl'

const SportSelection = ({route, navigation}) => {
  const {user} = route.params
  // console.log(user)
  const [selectedSport, setSelectedSport] = useState({})
  const [sports, setSports] = useState([])
  // const {user, setUser, tempId} = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [sportsLoading, setSportsLoading] = useState(false)

  const addSport = (sportToAdd) => {
    setSelectedSport(sportToAdd)
  }

  useEffect(() => {
    const getSports = async () => {
      setSportsLoading(true)
      const formData = new FormData()
      formData.append('token', 'ZFSgldjzfnvzkjdfbzdzfvbzdbdjkgSGVFddzfv')
      formData.append('accadamy_id', user?.accadamy_id)
      try {
        const response = await fetch(`${ApiUrl}/fetchsports.php`, {
          method: 'POST',
          body: formData,
          'Content-type': 'application/json',
        })
        if (!response.ok) {
          throw new Error(resData.message)
        }
        const resData = await response.json()
        setSports(resData.Data)
        console.log(resData)
      } catch (e) {
        console.log(e)
      }
      setSportsLoading(false)
    }
    getSports()
  }, [user?.accadamy_id])

  // const data = {
  //   email: user.user_email,
  //   user_id: user.user_id,
  //   academy: user.academy,
  //   sports: selectedSport.Sport_Name ? selectedSport?.Sport_Name.trim() : '',
  //   mongo_userid: 'dsights',
  //   mongo_password: 'dsights',
  //   role: user.user_type === 'student' ? 'student' : 'expert',
  // }

  const sendSport = async () => {
    const formData = new FormData()

    formData.append('token', 'ZFSgldjzfnvzkjdfbzdzfvbzdbdjkgSGVFddzfv')
    formData.append('method_type', 'updateSports')
    formData.append('Sport_id', `${selectedSport.Sport_id}`)
    formData.append('user_id', user.user_id)
    setLoading(true)
    try {
      const response = await fetch(`${ApiUrl}/completeaccount.php`, {
        method: 'POST',
        body: formData,
        // 'Content-type': 'application/json',
      })
      const resData = await response.json()
      console.log(resData, 'resData')
      // console.log(data, 'data')
      navigation.navigate('selectAge', {
        user: resData.Data[0],
        sport: selectedSport.Sport_Name,
      })
      // console.log(data)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <ProgressDialog visible={sportsLoading} />
      <View
        style={{flexDirection: 'row', marginBottom: 30, alignSelf: 'center'}}>
        <View style={styles.stepIndicator} />
        <View style={[styles.stepIndicator, {backgroundColor: '#333333'}]} />
      </View>
      <Text style={styles.heading}>Select Your Sport</Text>
      {/* <View style={{padding: 30}}> */}
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          width: '80%',
          alignSelf: 'center',
          marginBottom: 30,
        }}>
        {sports.map((sport) => (
          <TouchableOpacity
            activeOpacity={0.5}
            key={sport.Sport_id}
            style={[
              styles.sport,
              selectedSport === sport && styles.selectedSport,
            ]}
            onPress={addSport.bind(this, sport)}>
            <Text
              style={[
                styles.sportText,
                selectedSport === sport && styles.selectedSportText,
              ]}>
              {sport.Sport_Name}
            </Text>
          </TouchableOpacity>
        ))}

        {/* <TouchableOpacity
            style={[
              styles.sport,
              sports.includes('Football') && styles.selectedSport,
            ]}
            onPress={addSport.bind(this, 'Football')}>
            <Text
              style={[
                styles.sportText,
                sports.includes('Football') && styles.selectedSportText,
              ]}>
              Football
            </Text>
          </TouchableOpacity> */}
      </ScrollView>
      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <PrimaryButton
          activeOpacity={0.6}
          onPress={sendSport}
          disabled={selectedSport.length === 0}>
          Next Step
        </PrimaryButton>
      )}
      {/* <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.replace('dashBoardStack')}>
        <Text style={styles.skipText}>Skip for Now</Text>
      </TouchableOpacity> */}
      {/* </View> */}
    </ScrollView>
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

export default SportSelection
