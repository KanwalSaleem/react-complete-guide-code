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
  FlatList,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../constants/Colors'
import {useNavigation} from '@react-navigation/native'
import SwipeableRating from 'react-native-swipeable-rating'
import Header from '../../components/Header'
import BottomBar from '../../components/BottomBar'
import ServiceHistory from '../../components/ServiceHistory'
import AuthButton from '../../components/AuthButton'

const CaregiverServiceHistory = () => {
  const navigation = useNavigation()
  const [service, setService] = useState('completed')
  const [HistoryData, setHistoryData] = useState([
    {
      id: 1,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      date: 'July 31 2021',
      canceledServices: 'Canceled by Patient',
    },
    {
      id: 2,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      date: 'July 31 2021',
      canceledServices: 'Canceled by Caregiver',
    },
    {
      id: 3,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      date: 'July 31 2021',
      canceledServices: 'Canceled by Patient',
    },
    {
      id: 4,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      date: 'July 31 2021',
      canceledServices: 'Canceled by Caregiver',
    },
    {
      id: 5,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      date: 'July 31 2021',
      canceledServices: 'Canceled by Patient',
    },
    {
      id: 6,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      date: 'July 31 2021',
      canceledServices: 'Canceled by Caregiver',
    },
    {
      id: 7,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      date: 'July 31 2021',
      canceledServices: 'Canceled by Patient',
    },
    {
      id: 8,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      date: 'July 31 2021',
      canceledServices: 'Canceled by Caregiver',
    },
    {
      id: 9,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      date: 'July 31 2021',
      canceledServices: 'Canceled by Caregiver',
    },
    {
      id: 10,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      date: 'July 31 2021',
      canceledServices: 'Canceled by Patient',
    },
  ])

  return (
    <>
      <View style={styles.mainScreen}>
        <View style={styles.buttonConatiner}>
          <AuthButton
            style={{
              backgroundColor: service != 'canceled' ? '#444444' : Colors.red,
              width: '50%',
            }}
            onPress={() => setService('canceled')}>
            Canceled Services
          </AuthButton>

          <AuthButton
            onPress={() => setService('completed')}
            style={{
              backgroundColor: service != 'completed' ? '#444444' : Colors.red,
              width: '50%',
            }}>
            Completed Services
          </AuthButton>
        </View>
        <View style={styles.whiteContainer}>
          <ServiceHistory
            data={HistoryData}
            onPress={() => navigation.navigate('physicianServiceDetails')}
            serviceStatus={service}
          />
        </View>
      </View>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flexGrow: 1,
    backgroundColor: Colors.black,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  whiteContainer: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 20,
    marginTop: 20,
    height: '80%',
  },

  buttonConatiner: {
    flexDirection: 'row',
  },
})
export default CaregiverServiceHistory
