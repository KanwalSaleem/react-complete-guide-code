import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useRef,
} from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Share,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  Modal as RNModal,
} from 'react-native'
import {Card, Title, Portal, Modal} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../constants/Colors'
import FormData from 'form-data'
import {AuthContext} from '../context/auth'

import AsyncStorage from '@react-native-async-storage/async-storage'

const CategoryQuestionsScreen = ({route, navigation}) => {
  const [MainData, setMainData] = useState([])
  const {subCategoryId, subCategoryName} = route.params
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setLoading] = useState(true)
  const [showBadge, setShowBadge] = useState()
  const [mcqId, setMcqId] = useState(null)
  const [report, setReport] = useState('')
  // const [currentPageNo, setCurrentPageNo] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [likeLoading, setLikeLoading] = useState(false)
  // const updateCurrentPage = text => {
  //   setCurrentPageNo(text)
  //   setCurrentPage(currentPageNo)
  // }

  const subCategories = useCallback(async () => {
    try {
      const UserDetailsJson = await AsyncStorage.getItem('User_Details')
      const UserDetails = JSON.parse(UserDetailsJson)
      const userId = UserDetails.User_id
      let base_url = 'https://www.worldmcqs.org/Admin/API/fetch.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'fetchmcqs')
      uploadData.append('Sub_Category_Id', subCategoryId)
      uploadData.append('user_id', userId)
      uploadData.append('page_id', currentPage)
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message)
      } else {
        setTotalPages(responseData.Total_pages)
        // setCurrentPageNo(currentPage.toString())
        const mainData = responseData.Data

        if (mainData != 'No Data') {
          setMainData(mainData)
        } else {
          Alert.alert(mainData)
        }
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [currentPage, subCategoryId])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      subCategories()
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation, subCategories])

  const ShareOption = shareLink => {
    Share.share({
      message: shareLink,
    })
  }

  const badgeModal = () => {
    return (
      <Portal>
        <Modal
          onDismiss={() => setShowBadge(null)}
          visible={!!showBadge}
          dismissable={true}
          contentContainerStyle={styles.modalContainer}>
          <Text style={{fontSize: 18, textAlign: 'center'}}>{showBadge}</Text>
        </Modal>
      </Portal>
    )
  }

  const likeApi = useCallback(
    async mcqId => {
      setLikeLoading(true)
      try {
        const UserDetailsJson = await AsyncStorage.getItem('User_Details')
        const UserDetails = JSON.parse(UserDetailsJson)
        const userId = UserDetails.User_id
        let base_url = 'https://www.worldmcqs.org/Admin/API/postdata.php'
        let uploadData = new FormData()
        uploadData.append('request_name', 'likeMcqs')
        uploadData.append('mcqs_id', mcqId)
        uploadData.append('user_id', userId)
        // eslint-disable-next-line no-undef
        const response = await fetch(base_url, {
          method: 'post',
          body: uploadData,
        })
        const likeApiData = await response.json()
        if (!response.ok) {
          throw new Error(likeApiData.message)
        } else {
          subCategories()
        }
      } catch (error) {
        Alert.alert(error.message)
      } finally {
        setLikeLoading(false)
      }
      // likeFetchApi(mcqId)
    },

    [],
  )

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      setLoading(true)
      subCategories()
    } else {
      ToastAndroid.show(
        'No pages',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      )
    }
  }

  const backPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
      setLoading(true)
      subCategories()
    } else {
      ToastAndroid.show(
        'No pages',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      )
    }
  }

  const goPage = () => {
    if (currentPage <= totalPages && currentPage >= 1) {
      setLoading(true)
      subCategories()
    } else {
      ToastAndroid.show(
        'No pages',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      )
    }
  }

  const reportQuestion = async () => {
    const form = new FormData()

    const userDetails = await AsyncStorage.getItem('User_Details')
    if (userDetails) {
      try {
        const {User_id} = JSON.parse(userDetails)
        console.log(User_id)
        form.append('request_name', 'reportemcqs')
        form.append('mcqs_id', mcqId)
        form.append('reported_by', User_id)
        form.append('reason', report)
        const response = await fetch(
          'https://www.worldmcqs.org/Admin/API/postdata.php',
          {
            body: form,
            method: 'POST',
          },
        )

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(responseData.message)
        }

        Alert.alert('Success', responseData.message)
        setReport(null)
        setMcqId(null)
      } catch (e) {
        Alert.alert('Error', e)
      }
    }
  }
  const updateCurrentPage = text => {
    setCurrentPage(text)
  }

  const reportModal = () => {
    return (
      <RNModal
        animationType="slide"
        onDismiss={() => setMcqId(null)}
        transparent={true}
        visible={!!mcqId}
        onRequestClose={() => {
          setMcqId(null)
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
                onPress={reportQuestion}>
                <Text style={styles.postCommentText}>Report</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.hideComment}
                onPress={() => setMcqId(null)}>
                <Text style={styles.hideCommentText}>Hide</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
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
        <View style={styles.screen}>
          <Text style={styles.categoryHeading}>{subCategoryName}</Text>
          <View style={styles.mcqsContainer}>
            <FlatList
              initialNumToRender={10}
              data={MainData}
              keyExtractor={(item, index) => item.mcqs_id}
              renderItem={({item}) => {
                return (
                  <View style={styles.cardContainer}>
                    <Card style={styles.questionContainer}>
                      <Card.Content>
                        <View style={styles.userInfoSec}>
                          <TouchableOpacity
                            style={styles.info}
                            onPress={() => {
                              navigation.navigate('profileScreen', {
                                user_id: item.user_id,
                              })
                            }}
                            activeOpacity={0.4}>
                            {/* <Icon name="info" size={30} color={Colors.primary} /> */}
                            <Text style={styles.questionUser}>
                              {item.user_name}
                            </Text>
                          </TouchableOpacity>
                          <View style={{flexDirection: 'row'}}>
                            {item.badges.length > 0 &&
                              item.badges.map((badge, index) => {
                                return (
                                  <TouchableOpacity
                                    key={badge.icon}
                                    onPress={() => setShowBadge(badge.reason)}>
                                    <Image
                                      style={{width: 30, height: 30}}
                                      source={{
                                        uri: `https://worldmcqs.org/Admin/${badge.icon}`,
                                      }}
                                    />
                                  </TouchableOpacity>
                                )
                              })}
                          </View>
                        </View>

                        <View style={styles.innerContainer}>
                          {item.mcqs_question_type == 'image' ? (
                            <TouchableOpacity
                              style={styles.options}
                              onPress={() => {
                                navigation.navigate('zoomImage', {
                                  image1: item.mcqs_question,
                                  image2: item.mcqs_option_1,
                                  image3: item.mcqs_option_2,
                                  image4: item.mcqs_option_3,
                                  image5: item.mcqs_option_4,
                                })
                              }}>
                              <Image
                                style={styles.imageMcq}
                                source={{
                                  uri:
                                    'https://worldmcqs.org/Admin/assets/Images/' +
                                    item.mcqs_question,
                                }}
                              />
                            </TouchableOpacity>
                          ) : (
                            <Title
                              style={{
                                fontSize: 16,
                                color: Colors.primary,
                              }}>
                              {item.mcqs_question}
                            </Title>
                          )}
                        </View>

                        {item.mcqs_options_type == 'image' ? (
                          <View style={styles.OptionView}>
                            <View style={styles.imageOptionView}>
                              <Text
                                style={[
                                  styles.optionText,
                                  item.mcqs_answer == 1 && {fontWeight: '700'},
                                ]}>
                                A.{' '}
                              </Text>
                              <TouchableOpacity
                                style={[
                                  {
                                    marginLeft: 5,
                                    width: '80%',
                                    justifyContent: 'center',
                                    borderWidth: 2,
                                    borderColor:
                                      item.mcqs_answer == 1
                                        ? Colors.primary
                                        : 'lightgrey',
                                  },
                                ]}
                                onPress={() => {
                                  navigation.navigate('zoomImage', {
                                    image1: item.mcqs_option_1,
                                    image2: item.mcqs_option_2,
                                    image3: item.mcqs_option_3,
                                    image4: item.mcqs_option_4,
                                    image5: item.mcqs_question,
                                  })
                                }}>
                                <Image
                                  style={styles.imageMcqOption}
                                  source={{
                                    uri:
                                      'https://worldmcqs.org/Admin/assets/Images/' +
                                      item.mcqs_option_1,
                                  }}
                                  // source={require('../assets/englishMcqOptionA.png')}
                                />
                              </TouchableOpacity>
                            </View>
                            <View style={styles.imageOptionView}>
                              <Text
                                style={[
                                  styles.optionText,
                                  item.mcqs_answer == 2 && {fontWeight: '700'},
                                ]}>
                                B.{' '}
                              </Text>
                              <TouchableOpacity
                                style={[
                                  {
                                    marginLeft: 5,
                                    width: '80%',
                                    justifyContent: 'center',
                                    borderWidth: 2,
                                    borderColor:
                                      item.mcqs_answer == 2
                                        ? Colors.primary
                                        : 'lightgrey',
                                  },
                                ]}
                                onPress={() => {
                                  navigation.navigate('zoomImage', {
                                    image1: item.mcqs_option_2,
                                    image2: item.mcqs_option_3,
                                    image3: item.mcqs_option_4,
                                    image4: item.mcqs_option_1,
                                    image5: item.mcqs_question,
                                  })
                                }}>
                                <Image
                                  style={styles.imageMcqOption}
                                  source={{
                                    uri:
                                      'https://worldmcqs.org/Admin/assets/Images/' +
                                      item.mcqs_option_2,
                                  }}
                                  // source={{uri: item.mcqs_option_2}}
                                  // source={require('../assets/englishMcqOptionB.png')
                                />
                              </TouchableOpacity>
                            </View>
                            <View style={styles.imageOptionView}>
                              <Text
                                style={[
                                  styles.optionText,
                                  item.mcqs_answer == 3 && {fontWeight: '700'},
                                ]}>
                                C.{' '}
                              </Text>
                              <TouchableOpacity
                                style={[
                                  {
                                    marginLeft: 5,
                                    width: '80%',
                                    justifyContent: 'center',
                                    borderWidth: 2,
                                    borderColor:
                                      item.mcqs_answer == 3
                                        ? Colors.primary
                                        : 'lightgrey',
                                  },
                                ]}
                                onPress={() => {
                                  navigation.navigate('zoomImage', {
                                    image1: item.mcqs_option_3,
                                    image2: item.mcqs_option_4,
                                    image3: item.mcqs_option_1,
                                    image4: item.mcqs_option_2,
                                    image5: item.mcqs_question,
                                  })
                                }}>
                                <Image
                                  style={styles.imageMcqOption}
                                  source={{
                                    uri:
                                      'https://worldmcqs.org/Admin/assets/Images/' +
                                      item.mcqs_option_3,
                                  }}
                                  // source={{uri: item.mcqs_option_3}}
                                  // source={require('../assets/englishMcqOptionC.png')}
                                />
                              </TouchableOpacity>
                            </View>
                            <View style={styles.imageOptionView}>
                              <Text
                                style={[
                                  styles.optionText,
                                  item.mcqs_answer == 1 && {fontWeight: '700'},
                                ]}>
                                D.{' '}
                              </Text>
                              <TouchableOpacity
                                style={[
                                  {
                                    marginLeft: 5,
                                    width: '80%',
                                    justifyContent: 'center',
                                    borderWidth: 2,
                                    borderColor:
                                      item.mcqs_answer == 4
                                        ? Colors.primary
                                        : 'lightgrey',
                                  },
                                ]}
                                onPress={() => {
                                  navigation.navigate('zoomImage', {
                                    image1: item.mcqs_option_4,
                                    image2: item.mcqs_question,
                                    image3: item.mcqs_option_1,
                                    image4: item.mcqs_option_2,
                                    image5: item.mcqs_option_3,
                                  })
                                }}>
                                <Image
                                  style={styles.imageMcqOption}
                                  r
                                  source={{
                                    uri:
                                      'https://worldmcqs.org/Admin/assets/Images/' +
                                      item.mcqs_option_4,
                                  }}
                                  // source={{uri: item.mcqs_option_4}}
                                  // source={require('../assets/englishMcqOptionD.png')}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.OptionView}>
                            <Text
                              style={[
                                styles.optionText,
                                item.mcqs_answer == 1 && {fontWeight: '700'},
                              ]}>
                              A. {item.mcqs_option_1}
                            </Text>
                            <Text
                              style={[
                                styles.optionText,
                                item.mcqs_answer == 2 && {fontWeight: '700'},
                              ]}>
                              B. {item.mcqs_option_2}
                            </Text>
                            <Text
                              style={[
                                styles.optionText,
                                item.mcqs_answer == 3 && {fontWeight: '700'},
                              ]}>
                              C. {item.mcqs_option_3}
                            </Text>
                            <Text
                              style={[
                                styles.optionText,
                                item.mcqs_answer == 4 && {fontWeight: '700'},
                              ]}>
                              D. {item.mcqs_option_4}
                            </Text>
                          </View>
                        )}
                        <View style={styles.socialSection}>
                          <TouchableOpacity
                            style={styles.commentSection}
                            onPress={likeApi.bind(this, item.mcqs_id)}>
                            <Text style={{marginRight: 5}}>
                              {item.Likes_count}
                            </Text>
                            {item.Liked == true ? (
                              <Icon name="favorite" size={30} color={'red'} />
                            ) : (
                              <Icon
                                name="favorite-border"
                                size={30}
                                color={Colors.common.grey}
                              />
                            )}

                            <Text style={{color: Colors.common.grey}}>
                              Like
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.commentSection}
                            onPress={() => {
                              navigation.navigate('commentScreen', {
                                mcqsId: item.mcqs_id,
                              })
                            }}>
                            <Text style={{marginRight: 5}}>
                              {item.Comments_count}
                            </Text>
                            <Icon
                              name="chat-bubble-outline"
                              size={30}
                              color={Colors.common.grey}
                            />
                            <Text style={{color: Colors.common.grey}}>
                              Comment
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.commentSection}
                            onPress={ShareOption.bind(this, item.share_link)}>
                            <Icon
                              name="share"
                              size={30}
                              color={Colors.common.grey}
                            />
                            <Text style={{color: Colors.common.grey}}>
                              Share
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          }}>
                          <TouchableOpacity
                            disabled={item.Reported}
                            onPress={() => {
                              setMcqId(item.mcqs_id)
                            }}
                            style={{
                              backgroundColor: Colors.primary,
                              padding: 5,
                              width: '20%',
                              borderRadius: 5,
                              marginTop: 5,
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              marginLeft: 5,
                            }}>
                            <Text style={{color: '#fff'}}>Report</Text>
                          </TouchableOpacity>
                        </View>
                      </Card.Content>
                    </Card>
                  </View>
                )
              }}
            />
          </View>
          <View style={styles.bottomView}>
            <TouchableOpacity
              onPress={() => {
                backPage()
              }}
              activeOpacity={0.4}>
              <Icon
                style={styles.bottomIcon}
                name="arrow-back"
                size={50}
                color={Colors.primary}
              />
            </TouchableOpacity>
            <View style={styles.bottomText}>
              <Text style={styles.goTo}>Go to: </Text>
              {/* <Text style={styles.currentPageNo}>{currentPage}</Text> */}
              <TextInput
                // placeholder="1"
                style={styles.currentPageNo}
                keyboardType="number-pad"
                maxLength={4}
                placeholderTextColor="white"
                onChangeText={updateCurrentPage}
                value={currentPage.toString()}
                // autoFocus={true}
              />

              <Text style={styles.totalPages}>/{totalPages}</Text>
              <TouchableOpacity
                onPress={() => {
                  goPage()
                }}>
                <Text style={styles.go}>Go</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                nextPage()
              }}
              activeOpacity={0.4}>
              <Icon
                style={styles.bottomIcon}
                name="arrow-forward"
                size={50}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 10,
    // paddingHorizontal: 5,
  },
  mcqsContainer: {
    paddingVertical: 20,
    // paddingBottom: 60,
    marginBottom: 50,
  },
  innerContainer: {
    // alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    paddingBottom: 15,
  },
  info: {
    // minWidth: '100%',
    // paddingLeft: 20,
    justifyContent: 'flex-end',

    // flexDirection: 'row-reverse',
  },
  userInfoSec: {
    flexDirection: 'row',
  },
  categoryHeading: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    // marginBottom: 10,
  },
  questionContainer: {
    marginHorizontal: 10,
    borderRadius: 10,
    height: 350,
    backgroundColor: '#fff',
    // paddingBottom: 10,
  },

  socialSection: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  commentSection: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageMcq: {
    width: '100%',
    height: 30,
    // paddingRight: 30,
  },
  imageMcqOption: {
    // paddingBottom: 10,
    width: '50%',
    height: 20,
    // paddingTop: 10,
    // width: 300,
    // height: 30,
  },
  imageOptionView: {
    flexDirection: 'row',
    // paddingTop: 5,
  },
  OptionView: {
    // paddingTop: 10,
  },
  optionText: {
    paddingTop: 10,
  },
  bottomView: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
    // paddingHorizontal: 10,
  },
  bottomIcon: {
    marginVertical: 5,
    borderColor: 'white',
    borderWidth: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlignVertical: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    fontSize: 30,
    fontWeight: '900',
  },
  bottomText: {
    flexDirection: 'row',
    marginLeft: 20,
    alignItems: 'center',
  },
  goTo: {
    color: 'white',

    fontWeight: '700',
  },
  currentPageNo: {
    paddingVertical: 2,
    // paddingHorizontal: 15,
    color: 'white',
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 5,
    marginLeft: 5,
    textAlign: 'center',
    width: '25%',
  },
  totalPages: {
    color: 'white',
    marginLeft: 5,
  },
  go: {
    color: 'white',
    // marginLeft: 5,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 5,
    marginLeft: 5,
  },
  bottomImage: {
    width: 50,
    height: 40,
    // marginLeft: 30,
    // width: '50%',
    // height: '80%',
  },
  questionUser: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: Colors.primary,
    // width: '20%',
    paddingHorizontal: 5,
    paddingVertical: 2,
    textAlign: 'center',
    borderRadius: 5,
    textAlignVertical: 'center',
    marginBottom: 5,
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
})
export default CategoryQuestionsScreen
