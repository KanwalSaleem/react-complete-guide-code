import React, {useState, useEffect, useCallback} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native'
import Colors from '../../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useSelector} from 'react-redux'
import {useNavigation} from '@react-navigation/native'
import AuthButton from '../../components/AuthButton'
import {Modal, Portal} from 'react-native-paper'

const NetworkMembers = () => {
  const navigation = useNavigation()
  const token = useSelector((state) => state.auth.token)
  const [isLoading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState([])
  const [profileVisible, setProfileVisible] = useState(false)

  const [networkData, setnetworkData] = useState([
    {
      id: 1,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      email: 'sara@gmail.com',
      rating: 4.2,
      review: 124,
      joiningDate: '29 /7/2021',
      ReferredBy: 'Nathan Richmond',
    },
    {
      id: 2,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      email: 'sara@gmail.com',
      rating: 4.2,
      review: 124,
      joiningDate: '29 /7/2021',
      ReferredBy: 'Nathan Richmond',
    },
    {
      id: 3,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      email: 'sara@gmail.com',
      rating: 4.2,
      review: 124,
      joiningDate: '29 /7/2021',
      ReferredBy: 'Nathan Richmond',
    },
    {
      id: 4,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      email: 'sara@gmail.com',
      rating: 4.2,
      review: 124,
      joiningDate: '29 /7/2021',
      ReferredBy: 'Nathan Richmond',
    },
    {
      id: 5,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      email: 'sara@gmail.com',
      rating: 4.2,
      review: 124,
      joiningDate: '29 /7/2021',
      ReferredBy: 'Nathan Richmond',
    },
    {
      id: 6,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      email: 'sara@gmail.com',
      rating: 4.2,
      review: 124,
      joiningDate: '29 /7/2021',
      ReferredBy: 'Nathan Richmond',
    },
    {
      id: 7,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      email: 'sara@gmail.com',
      rating: 4.2,
      review: 124,
      joiningDate: '29 /7/2021',
      ReferredBy: 'Nathan Richmond',
    },
    {
      id: 8,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      email: 'sara@gmail.com',
      rating: 4.2,
      review: 124,
      joiningDate: '29 /7/2021',
      ReferredBy: 'Nathan Richmond',
    },
    {
      id: 9,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      email: 'sara@gmail.com',
      rating: 4.2,
      review: 124,
      joiningDate: '29 /7/2021',
      ReferredBy: 'Nathan Richmond',
    },
    {
      id: 10,
      image: require('../../assets/review.jpg'),
      name: 'Alex Wells',
      email: 'sara@gmail.com',
      rating: 4.2,
      review: 124,
      joiningDate: '29 /7/2021',
      ReferredBy: 'Nathan Richmond',
    },
  ])

  const profile = () => {
    return (
      <Modal
        visible={profileVisible}
        onDismiss={() => setProfileVisible(false)}
        contentContainerStyle={styles.modalContainer}>
        <Image source={profileData.image} style={styles.profileImage} />
        <View style={styles.ratingContainer}>
          <Image
            source={require('../../assets/star_sm_yellow.png')}
            style={styles.starImage}
          />
          <Text style={styles.description}>{profileData.rating}</Text>
          <Text style={styles.description}> ({profileData.review} Review)</Text>
        </View>
        <View style={styles.profileContainer}>
          <Text style={[styles.name, {fontSize: 20}]}>{profileData.name}</Text>
          <Text style={[styles.description, {fontSize: 18}]}>
            {profileData.email}
          </Text>
          <Text style={styles.description}>
            Joining Date: {profileData.joiningDate}
          </Text>
        </View>

        <View style={styles.referContainer}>
          <Text style={styles.description}>Referred by</Text>
          <Text
            style={[
              styles.description,
              {fontFamily: 'Roboto-Bold', marginLeft: 5},
            ]}>
            {profileData.ReferredBy}
          </Text>
        </View>
        <Image source={profileData.image} style={styles.referImage} />
      </Modal>
    )
  }

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.red} />
    </View>
  ) : (
    <>
      <View style={styles.mainScreen}>
        <View style={styles.whiteContainer}>
          <View style={styles.itemMainContainer}>
            <FlatList
              data={networkData}
              keyExtractor={(item, index) => item.id}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => (
                      setProfileVisible(true), setProfileData(item)
                    )}>
                    <View style={styles.titleContainer}>
                      <Image source={item.image} style={styles.image} />
                      <View style={styles.nameContainer}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.description}>{item.email}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
          </View>
          {profile()}
        </View>
        <AuthButton onPress={() => {}}>Send Referral</AuthButton>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  activity: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  mainScreen: {
    backgroundColor: Colors.black,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  whiteContainer: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 20,
    height: '90%',
  },
  itemMainContainer: {},
  itemContainer: {
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 10,
  },
  image: {
    width: '18%',
    height: 55,
    borderRadius: 30,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  nameContainer: {
    marginLeft: 15,
    width: '60%',
  },
  name: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },

  description: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    width: '97%',
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: '26%',
    height: 77,
    borderRadius: 50,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  starImage: {
    marginRight: 5,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  referContainer: {
    flexDirection: 'row',
  },

  referImage: {
    marginVertical: 20,
    width: '15%',
    height: 43,
    borderRadius: 50,
  },
})

export default NetworkMembers
