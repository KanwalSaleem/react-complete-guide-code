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
import AuthButton from '../../components/AuthButton'
import RatingComp from '../../components/RatingComp'

const CaregiverRateReview = () => {
  const [ratingState, setRatingState] = useState(2)
  const navigation = useNavigation()
  const [comment, setComment] = useState('')
  const updateComment = (text) => {
    setComment(text)
  }
  const handleRating = (rating) => {
    setRatingState(rating)
  }

  return (
    <View style={styles.mainScreen}>
      {/* <GobackHeader title="Rate & Review" /> */}

      <View style={styles.reviewContainer}>
        <View style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/review.jpg')}
              style={styles.image}
            />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>Nathan Richmond</Text>
            <Text style={styles.ratingTitle}>Rate your patient</Text>
          </View>
          <View style={styles.ratingContainer}>
            <RatingComp
              rating={ratingState}
              gap={15}
              size={36}
              onPress={handleRating}
            />
          </View>
          <View style={styles.fieldContainer}>
            <TextInput
              name="comment"
              placeholder="Write a comment here"
              value={comment}
              onChangeText={updateComment}
              rules={{required: true}}
              style={styles.input}
              placeholderTextColor="black"
            />
          </View>
          <AuthButton>Submit</AuthButton>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingVertical: 20,
  },

  reviewContainer: {
    marginVertical: 15,
    paddingBottom: 30,
    marginTop: 50,
  },
  itemContainer: {
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  imageContainer: {
    alignSelf: 'center',
    borderWidth: 3,
    width: '29%',
    top: -50,
    borderColor: Colors.backgroundColor,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 85,
    borderRadius: 10,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  nameContainer: {
    marginLeft: 15,
    alignItems: 'center',
    top: -30,
  },
  name: {
    fontFamily: 'Roboto-Medium',
    fontSize: 27,
  },
  ratingTitle: {
    marginTop: 20,
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },

  iconView: {
    borderRadius: 100,
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    textAlign: 'center',
  },
  fieldContainer: {
    height: 120,
    borderWidth: 1.5,
    borderColor: 'grey',
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  input: {
    paddingHorizontal: 5,
    textAlignVertical: 'top',
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },
  ratingContainer: {
    height: 40,
    top: -15,
    alignSelf: 'center',
  },
})
export default CaregiverRateReview
