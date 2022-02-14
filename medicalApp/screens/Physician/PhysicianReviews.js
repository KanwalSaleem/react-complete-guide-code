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
// import Header from '../../components/Physician/Header';
import Reviews from '../../components/Reviews'
import BottomBar from '../../components/BottomBar'

const PhysicianReviews = () => {
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
    <View style={styles.mainScreen}>
      <Reviews data={ReviewData} />
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingVertical: 20,
  },
})
export default PhysicianReviews
