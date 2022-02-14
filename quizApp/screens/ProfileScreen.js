import React, {useEffect, useState, useCallback} from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native'
// import {useNavigation} from '@react-navigation/native'
import {Portal, Modal as PModal} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Input from '../components/Input'
import AuthButton from '../components/AuthButton'
import Colors from '../constants/Colors'
import FormData from 'form-data'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ProfileScreen = ({route, navigation}) => {
  const [showBadge, setShowBadge] = useState()
  const [profileData, setProfileData] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [report, setReport] = useState('')

  const [modal, setModal] = useState(false)
  const user_id = route.params
  const userId = user_id['user_id']
  const profileApi = useCallback(async () => {
    let base_url = 'https://www.worldmcqs.org/Admin/API/fetch.php'
    try {
      const UserDetailsJson = await AsyncStorage.getItem('User_Details')
      const UserDetails = JSON.parse(UserDetailsJson)
      const myId = UserDetails.User_id

      let uploadData = new FormData()
      uploadData.append('request_name', 'fetchProfile')
      uploadData.append('user_id', userId)
      uploadData.append('my_id', myId)

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message)
      } else {
        const mainData = responseData.Data
        setProfileData(mainData)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    profileApi()
  }, [profileApi])

  const followApi = useCallback(async () => {
    let base_url = 'https://www.worldmcqs.org/Admin/API/postdata.php'
    try {
      const UserDetailsJson = await AsyncStorage.getItem('User_Details')
      const UserDetails = JSON.parse(UserDetailsJson)
      const followerId = UserDetails.User_id
      let uploadData = new FormData()
      uploadData.append('request_name', 'followUser')

      uploadData.append('follower_id', followerId)
      uploadData.append('user_id', userId)

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message)
      } else {
        profileApi()
      }
    } catch (error) {
      Alert.alert(error.message)
    }
  }, [])

  const reportUser = async () => {
    const UserDetailsJson = await AsyncStorage.getItem('User_Details')
    if (UserDetailsJson) {
      const UserDetails = JSON.parse(UserDetailsJson)

      const form = new FormData()
      form.append('request_name', 'reporteuser')
      form.append('report_id', userId)
      form.append('reported_by', UserDetails.User_id)
      form.append('reason', 'test')
      try {
        const response = await fetch(
          'https://www.worldmcqs.org/Admin/API/postdata.php',
          {
            body: form,
            method: 'POST',
          },
        )

        const resData = await response.json()
        if (!response.ok) {
          throw new Error(resData.message)
        }
        Alert.alert('Success', resData.message)
        setReport('')
        setModal(false)
      } catch (e) {
        Alert.alert('Error', e.message)
      }
    }
  }

  const badgeModal = () => {
    return (
      <Portal>
        <PModal
          onDismiss={() => setShowBadge(null)}
          visible={!!showBadge}
          dismissable={true}
          contentContainerStyle={styles.modalContainer}>
          <Text style={{fontSize: 18, textAlign: 'center'}}>{showBadge}</Text>
        </PModal>
      </Portal>
    )
  }

  const reportModal = () => {
    return (
      <Modal
        animationType="slide"
        onDismiss={() => setModal(null)}
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(null)
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.topBar}>
              <Text style={styles.topBarText}>Report</Text>
            </View>
            <View style={styles.modalFileds}>
              <View style={styles.commentView}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Type Reason Here"
                  value={report}
                  multiline={true}
                  onChangeText={text => setReport(text)}
                />
              </View>
              <TouchableOpacity
                style={styles.postComment}
                //
                disabled={!report}
                onPress={reportUser}>
                <Text style={styles.postCommentText}>Report</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.hideComment}
                onPress={() => setModal(false)}>
                <Text style={styles.hideCommentText}>Hide</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <View style={{flex: 1}}>
      {badgeModal()}
      {reportModal()}
      {isLoading ? (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.imageView}>
            <Image
              style={styles.profileImage}
              // source={require('../assets/profile.jpg')}
              source={{
                uri: `https://worldmcqs.org/Admin/${profileData.profilepic}`,
              }}
            />
            <Text style={styles.profileName}>{profileData.user_name}</Text>
          </View>
          <View
            style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
            {profileData &&
              profileData.badges.map(badge => (
                <TouchableOpacity
                  key={badge.icon}
                  onPress={() => setShowBadge(badge.reason)}>
                  <Image
                    style={{width: 40, height: 40, resizeMode: 'contain'}}
                    source={{
                      uri: `https://worldmcqs.org/Admin/${badge.icon}`,
                    }}
                  />
                </TouchableOpacity>
              ))}
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.fieldsView}>
              <Text style={styles.fieldBox}>{profileData.followers}</Text>
              <Text style={styles.fieldText}>Followers</Text>
            </View>
            <View style={styles.fieldsView}>
              <Text style={styles.fieldBox}>{profileData.total_mcqs}</Text>
              <Text style={styles.fieldText}>Solved Mcqs</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              followApi()
            }}
            style={styles.follow}
            activeOpacity={0.4}>
            {profileData.followed === true ? (
              <Text style={styles.followText}>Unfollow</Text>
            ) : (
              <Text style={styles.followText}>Follow</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={profileData.reported}
            onPress={() => setModal(true)}
            style={styles.follow}
            activeOpacity={0.4}>
            <Text style={styles.followText}>Report User</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: Colors.primary,
    // marginBottom: 30,
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    // marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    // marginTop: 5,
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
  },
  profileName: {
    paddingTop: 5,
    fontWeight: '700',
    fontSize: 22,
    textAlign: 'center',
    color: Colors.primary,
  },
  innerContainer: {
    paddingTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  fieldsView: {
    marginHorizontal: 40,
    // marginVertical: 10,
    alignItems: 'center',
  },
  fieldText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingVertical: 10,
    fontSize: 16,
  },
  fieldBox: {
    textAlign: 'center',
    paddingVertical: 10,
    textAlignVertical: 'center',
    fontWeight: '700',
    fontSize: 20,
  },
  follow: {
    marginTop: 30,
    // marginLeft: 20,
    width: '70%',
    // paddingHorizontal: 30,
    height: 35,
    borderWidth: 0.5,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    borderRadius: 5,
    // marginBottom: 20,
  },
  followText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
    textAlignVertical: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22
  },
  modalView: {
    width: '80%',
    alignSelf: 'center',
    // height: 470,

    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    // padding: 35,
    // alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: 10,
  },
  topBar: {
    width: '100%',
    height: 60,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    // justifyContent: 'space-around',
    // alignItems: 'center',
    position: 'absolute', //Here is the trick
    top: 0, //Here is the trick
    // paddingHorizontal: 10,
  },
  topBarText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
    //  fontWeight: '700'
    textAlignVertical: 'center',
  },
  modalFileds: {
    marginTop: 90,
    // marginVertical: 20
    marginHorizontal: 10,
  },
  commentView: {
    //   flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 30,
  },
  commentInput: {
    paddingHorizontal: 15,
    height: 200,
    textAlignVertical: 'top',
    fontSize: 18,
  },
  postComment: {
    marginTop: 40,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 30,
  },
  postCommentText: {
    height: 50,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  hideComment: {
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: Colors.primary,
    width: '50%',
    alignSelf: 'center',
  },

  hideCommentText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
})

export default ProfileScreen
