import React, {useContext, useState, useEffect, useCallBack} from 'react'
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Share,
  Modal,
  Alert,
} from 'react-native'
import {SliderBox} from 'react-native-image-slider-box'
import {Card, Title} from 'react-native-paper'
import {useNavigation} from '@react-navigation/native'
import {AuthContext} from '../context/auth'
import SwipeableRating from 'react-native-swipeable-rating'
import Colors from '../constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'

const DashboardScreen = () => {
  const navigation = useNavigation()
  const [data, setData] = useState([])
  const {logout} = useContext(AuthContext)
  const [modalVisible, setModalVisible] = useState(false)
  const [ratingState, setRatingState] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [ratingVisible, setRatingVisible] = useState(false)

  const handleRating = rating => {
    setRatingState(rating)
  }

  const images = [
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=752&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=966&q=80',
    'https://images.unsplash.com/photo-1615791287388-6f1bd87ace4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=755&q=80',
  ]
  const onSubmit = data => {
    logout()
  }
  const ShareApp = () => {
    Share.share(
      {
        message:
          "BAM: we're helping your business with awesome React Native apps",
        url: 'http://bam.tech',
        title: 'Wow, did you see that?',
      },
      {
        // Android only:
        dialogTitle: 'Share BAM goodness',
      },
    )
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const Rating = async () => {
    setLoading(true)
    try {
      const UserDetailsJson = await AsyncStorage.getItem('User_Details')
      const UserDetails = JSON.parse(UserDetailsJson)
      const userId = UserDetails.User_id
      let base_url = 'https://www.worldmcqs.org/Admin/API/postdata.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'postrating')
      uploadData.append('user_id', userId)
      uploadData.append('rating', ratingState)

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message)
      }
      if (responseData.isRated === false) {
        Alert.alert(responseData.Message)
      } else {
        Alert.alert('Success', responseData.Message)

        setModalVisible(!modalVisible)
      }
    } catch (error) {
      Alert.alert(error.message)
    }
    setLoading(false)
  }

  useEffect(
    () => {
      const FetchRating = async () => {
        setLoading(true)
        try {
          const UserDetailsJson = await AsyncStorage.getItem('User_Details')
          const UserDetails = JSON.parse(UserDetailsJson)
          const userId = UserDetails.User_id
          let base_url = 'https://www.worldmcqs.org/Admin/API/fetch.php'
          let uploadData = new FormData()
          uploadData.append('request_name', 'getratting')
          uploadData.append('user_id', userId)

          // eslint-disable-next-line no-undef
          const response = await fetch(base_url, {
            method: 'post',
            body: uploadData,
          })

          const responseData = await response.json()

          if (!response.ok) {
            throw new Error(responseData.message)
          }
          // if (responseData.isRated === false) {

          const responseRat = parseInt(responseData.rating)
          setRatingState(responseRat)
          setRatingVisible(responseData.hasRated)

          //   Alert.alert(responseData.Message)
          // } else {
          //   Alert.alert('Success', responseData.Message)
          //   console.log(responseData)
          //   setModalVisible(!modalVisible)
          // }
        } catch (error) {
          Alert.alert(error.message)
        }
        setLoading(false)
      }

      FetchRating()
    },
    [ratingState],
    [ratingVisible],
  )

  return (
    <View style={styles.screen}>
      <View style={styles.sliderContainer}>
        <SliderBox
          images={images}
          ImageComponentStyle={{
            width: '95%',
            // borderRadius: 20,
            // height: 170,
          }}
          autoplay={true}
          circleLoop={true}
          disableOnPress
          activeOpacity={0.1}
        />
      </View>
      <View style={styles.optionsContainer}>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            onDismiss={() => setModalVisible(false)}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible)
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.ratingTitle}>
                  How was your experience with us?
                </Text>

                <SwipeableRating
                  rating={ratingState}
                  size={32}
                  gap={4}
                  onPress={handleRating}
                  xOffset={30}
                />
                <TouchableOpacity
                  // onPress={Rating.bind(this, Rat)}
                  disabled={ratingVisible}
                  onPress={() => Rating()}>
                  <Text style={styles.ratingText}>Submit Rating</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.ratingText}>Not Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        <Card style={styles.optionCard}>
          <Card.Content>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('mcqs')
              }}
              activeOpacity={0.4}>
              <Image
                source={require('../assets/mcqs1.jpeg')}
                style={[styles.optionImage]}
              />
              {/* <Title style={styles.optionTitle}>MCQS</Title> */}
            </TouchableOpacity>
          </Card.Content>
        </Card>
        <Card style={styles.optionCard}>
          <Card.Content>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('quiz')
              }}
              activeOpacity={0.4}>
              <Image
                source={require('../assets/quiz1.jpeg')}
                style={styles.optionImage}
              />
              {/* <Title style={styles.optionTitle}>Quiz</Title> */}
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>
      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={() => {}} activeOpacity={0.5}>
          <Card mode="outlined" style={styles.socialButton}>
            <Card.Content>
              <TouchableOpacity
                onPress={() => {
                  ShareApp()
                }}>
                <Title style={styles.socialText}>Share</Title>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(!modalVisible), setRatingState(0)
          }}
          activeOpacity={0.5}>
          <Card mode="outlined" style={styles.socialButton}>
            <Card.Content>
              <Title style={styles.socialText}>Rate</Title>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={() => {}} activeOpacity={0.5}>
          <Card mode="outlined" style={styles.socialButton}>
            <Card.Content>
              <TouchableOpacity
                onPress={() => navigation.navigate('contactUs')}>
                <Title style={styles.socialText}>Contact Us</Title>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('editProfile')}
          activeOpacity={0.5}>
          <Card mode="outlined" style={styles.socialButton}>
            <Card.Content>
              <Title style={styles.socialText}>Edit Profile</Title>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={() => {}} activeOpacity={0.5}>
          <Card mode="outlined" style={styles.socialButton}>
            <Card.Content>
              <TouchableOpacity onPress={onSubmit}>
                <Title style={styles.socialText}>LogOut</Title>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>

      <View
      // style={styles.logoutView}
      ></View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    marginBottom: 10,
    // alignItems: 'center',
  },
  optionCard: {
    borderRadius: 20,
    width: 170,
    alignItems: 'center',
  },
  optionImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  optionTitle: {
    fontWeight: '700',
    color: Colors.secondary,
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },

  socialText: {
    fontWeight: '700',
    color: Colors.secondary,
    textAlign: 'center',
    width: 130,
  },
  socialButton: {
    borderColor: Colors.primary,
    borderRadius: 10,
    borderWidth: 3,
  },

  modalView: {
    width: '80%',
    height: 270,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    // justifyContent: 'space-between',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingTitle: {
    color: Colors.primary,
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  ratingText: {
    color: Colors.primary,
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  ratingContainer: {
    flex: 1,
  },
})

export default DashboardScreen
