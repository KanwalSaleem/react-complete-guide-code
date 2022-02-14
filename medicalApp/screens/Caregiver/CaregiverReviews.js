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
import {Picker} from '@react-native-picker/picker'
import {useNavigation} from '@react-navigation/native'
import SwipeableRating from 'react-native-swipeable-rating'
import AuthButton from '../../components/AuthButton'
// import Header from '../../components/Caregiver/Header';
import Reviews from '../../components/Reviews'
import BottomBar from '../../components/BottomBar'

const CaregiverReviews = () => {
  const [ReviewData, setReviewData] = useState([
    {
      id: 1,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      rating: 4,
      date: 'July 31 2021',
      review:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text eversince the 1500s, when an unknown printer took a galley of type andscrambled it to make a type specimen book.',
    },
    {
      id: 2,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      rating: 4,
      date: 'July 31 2021',
      review:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text eversince the 1500s, when an unknown printer took a galley of type andscrambled it to make a type specimen book.',
    },
    {
      id: 3,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      rating: 4,
      date: 'July 31 2021',
      review:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text eversince the 1500s, when an unknown printer took a galley of type andscrambled it to make a type specimen book.',
    },
    {
      id: 4,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      rating: 4,
      date: 'July 31 2021',
      review:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text eversince the 1500s, when an unknown printer took a galley of type andscrambled it to make a type specimen book.',
    },
    {
      id: 5,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      rating: 4,
      date: 'July 31 2021',
      review:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text eversince the 1500s, when an unknown printer took a galley of type andscrambled it to make a type specimen book.',
    },
  ])
  const [ratingState, setRatingState] = useState(0)
  const navigation = useNavigation()

  return (
    <>
      <View style={styles.mainScreen}>
        <View style={styles.buttonConatiner}>
          <View style={styles.buttonView}>
            <AuthButton style={{borderRadius: 0}} onPress={() => {}}>
              By Patient
            </AuthButton>
          </View>
          <View style={[styles.buttonView, {left: -42}]}>
            <AuthButton
              style={{backgroundColor: '#757575', borderRadius: 0}}
              onPress={() => {}}>
              My Reviews
            </AuthButton>
          </View>
        </View>

        <Reviews data={ReviewData} style={{height: '92%'}} />
      </View>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingVertical: 20,
  },

  buttonConatiner: {
    flexDirection: 'row',
  },
  buttonView: {
    width: '57%',
  },
})
export default CaregiverReviews
