import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FormData from 'form-data'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {AuthContext} from '../context/auth'

const CommentScreen = ({route, navigation}) => {
  const {userDetails} = useContext(AuthContext)
  const mcqsId = route.params
  const McqsId = mcqsId['mcqsId']
  const [comment, setComment] = useState('')
  const [MainData, setMainData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const updateComment = text => {
    setComment(text)
  }
  const listViewRef = useRef()

  const downButtonHandler = () => {
    //OnCLick of down button we scrolled the list to bottom
    listViewRef.current.scrollToEnd({animated: true})
  }

  const postComment = async () => {
    try {
      // const UserDetailsJson = await AsyncStorage.getItem('User_Details')
      // const UserDetails = JSON.parse(UserDetailsJson)
      const userId = userDetails.User_id
      console.log(userDetails, 'userDerails')
      let base_url = 'https://www.worldmcqs.org/Admin/API/postdata.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'postcomment')
      uploadData.append('mcqs_id', McqsId)
      uploadData.append('user_id', userId)
      uploadData.append('comment', comment)

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const commentData = await response.json()
      console.log(commentData)
      CommentApi()

      downButtonHandler()
      setComment(null)

      if (!response.ok) {
        throw new Error(commentData.message)
      }

      // CommentApi()
    } catch (error) {
      // Alert.alert(error.message)
      console.log(error.message)
    }
  }
  const CommentApi = useCallback(async () => {
    let base_url = 'https://www.worldmcqs.org/Admin/API/fetch.php'
    try {
      let uploadData = new FormData()
      uploadData.append('request_name', 'fetchComment')

      uploadData.append('mcqs_id', McqsId)
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
        setMainData(mainData)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [McqsId])
  useEffect(() => {
    CommentApi()
  }, [CommentApi])

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    // <KeyboardAvoidingView
    // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.mainContainer}>
        {MainData != 'No Data' ? (
          <View style={styles.listContainer}>
            <FlatList
              data={MainData}
              ref={ref => (listViewRef.current = ref)}
              keyExtractor={(item, index) => item.comment_id}
              renderItem={({item}) => {
                return (
                  <View style={styles.item}>
                    <View style={styles.userView}>
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('profileScreen', {
                              user_id: item.user_id,
                            })
                          }}>
                          <Text style={styles.userName}>{item.user_name}</Text>
                        </TouchableOpacity>
                        <Text style={styles.userComment}>{item.comment}</Text>
                      </View>
                      <View style={styles.timeView}>
                        <Text style={styles.time}>{item.created_date}</Text>
                      </View>
                    </View>
                  </View>
                )
              }}
            />
          </View>
        ) : (
          <View style={{}}>
            <Text style={styles.noData}>Be the first to write a comment</Text>
          </View>
        )}
        <View style={styles.commentContainer}>
          <View style={styles.commentView}>
            <TextInput
              style={styles.commentInput}
              placeholder="Comment here"
              value={comment}
              multiline={true}
              onChangeText={updateComment}></TextInput>
          </View>
          <TouchableOpacity
            style={styles.postComment}
            disabled={!comment}
            onPress={() => {
              postComment()
            }}>
            <Icon
              style={styles.inputIcon}
              name="send"
              size={35}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
    // </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    height: 470,
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
  commentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginHorizontal: 10,
    position: 'absolute', //Here is the trick
    bottom: 0,
  },
  commentView: {
    //   flex: 1,
    width: '87%',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 30,
    // marginRight: 5,
  },
  commentInput: {
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  postComment: {
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 10,
    marginLeft: 5,
  },
  postCommentText: {
    // height: 50,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: 'white',
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

  icon: {
    flexDirection: 'row-reverse',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  listContainer: {
    height: '83%',
    // paddingHorizontal: 15,
    marginVertical: 20,
  },
  item: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    backgroundColor: 'white',
    // paddingHorizontal: 10,
    // margin: 10,

    //   padding: 20,
    //   alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'white',

    marginHorizontal: 10,
  },
  userView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userName: {
    fontWeight: '700',
    fontSize: 16,
  },

  userComment: {
    fontSize: 14,
  },
  timeView: {
    // marginHorizontal: 10,
    marginRight: 10,
  },
  time: {
    color: Colors.common.grey,
    fontSize: 14,
  },
  noData: {
    paddingHorizontal: 20,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 20,
  },
})

export default CommentScreen
