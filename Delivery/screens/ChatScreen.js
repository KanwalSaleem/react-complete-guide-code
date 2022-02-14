import React, {useContext, useEffect, useRef, useState} from 'react'
import Header from '../components/Header'
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'

import BottomBar from '../components/BottomBar'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DocumentPicker from 'react-native-document-picker'
import {Avatar, Portal, Modal} from 'react-native-paper'
import {useForm, Controller} from 'react-hook-form'

import {AppContext} from '../context/auth'
import colors from '../constants/colors'
import {useHttpClient} from '../hooks/http-hook'

const ChatScreen = (props) => {
  const window = useWindowDimensions()
  const {user, userType} = useContext(AppContext)
  const {clientId, name, email, phone, image, seller} = props.route.params
  const {socket, rooms} = props
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const listRef = useRef()
  const [visible, setVisible] = useState(false)
  const [payUser, setPayUser] = useState({})
  const {
    sendRequest: milestoneRequest,
    error: milestoneError,
    clearError: clearMilestoneError,
    loading: milestoneLoading,
  } = useHttpClient()

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm()

  const onSubmit = async (data) => {
    // console.log(
    //   JSON.stringify({
    //     buyer_id: buyer.id,
    //     amount: data.amount,
    //     dscr: data.detail,
    //   }),
    // )

    try {
      const response = await milestoneRequest(
        'https://deliverypay.in/api/createMilestone',
        'POST',

        JSON.stringify({
          seller,
          amount: data.amount,
          dscr: data.detail,
          // products: [],
        }),
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      )

      console.log(response)
      setVisible(false)
      Alert.alert('Success', 'Milestone creted')
      reset()
    } catch (e) {
      console.log(e)
    }
    if (milestoneError) {
      Alert.alert('Error', milestoneError, [
        {onPress: () => clearMilestoneError()},
      ])
    }
  }

  const filePickerHandler = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [
          // DocumentPicker.types.pdf,
          // DocumentPicker.types.docx,
          // DocumentPicker.types.doc,
          DocumentPicker.types.images,
        ],
        mode: 'import',
      })

      // images[fileIndex] = {
      //   uri: response.uri,
      //   type: response.type,
      //   fileName: response.name,
      // }
      console.log(response[0])
      const formData = new FormData()
      formData.append('UploadFiles', {
        type: response[0].type,
        name: response[0].name,
        uri: response[0].fileCopyUri,
      })
      const headers = new Headers()
      headers.append('Accept', '/')
      headers.append('Content-Type', 'multipart/form-data')
      const imageResponse = await fetch(
        `https://sassolution.org/Admin/API/cdn_image.php`,
        {
          body: formData,
          method: 'POST',
          headers,
        },
      )
      const resData = await imageResponse.json()
      if (!response.ok) {
        console.log(resData)
      }
      socket.emit(
        'messageToServer',
        {
          rooms,
          message: {
            media: `https://${resData.url}`,
            to: clientId,
          },
        },
        (r) => console.log(r),
      )

      // setMessages((prev) =>
      //   prev.concat({
      //     media: `https://${resData.url}`,
      //     to: clientId,
      //     from: user.userId,
      //     id: 'sassolution.org/Admin/API/Files/2021092001274381.png',
      //   }),
      // )

      // console.log(resData)
      console.log(resData, 'image')
    } catch (e) {
      // setVisible(false)
      console.log(e)
    }
  }

  const milestoneModal = () => {
    return (
      <Portal>
        <Modal
          visible={visible}
          contentContainerStyle={styles.modalContainer}
          onDismiss={() => {
            setVisible(false)
            // setBuyer({})
            reset()
          }}>
          <View style={styles.modalHeadingContainer}>
            <Text style={styles.modalHeading}>Create Milestone</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            {payUser && <Avatar.Image source={{uri: image}} />}
            <View style={{alignItems: 'center'}}>
              {payUser && (
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  {name}
                </Text>
              )}
              <Text>{phone}</Text>
              <Text>{email}</Text>
            </View>
          </View>
          <Controller
            control={control}
            name="amount"
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Amount"
                placeholderTextColor="grey"
                style={[styles.field, errors.amount && styles.redBorder]}
                keyboardType={'number-pad'}
              />
            )}
          />
          <Controller
            control={control}
            name="detail"
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Detail"
                placeholderTextColor="grey"
                style={[
                  styles.field,
                  errors.detail && styles.redBorder,
                  {width: '80%'},
                ]}
              />
            )}
          />
          <TouchableOpacity
            style={{width: 171, marginVertical: 20}}
            activeOpacity={0.6}
            onPress={handleSubmit(onSubmit)}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#2598b6', '#1BE6D6']}
              style={{
                borderRadius: 20,
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.callToActionText}>Create Milestone</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Modal>
      </Portal>
    )
  }

  useEffect(() => {
    listRef.current.scrollToEnd()
  }, [listRef])

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      console.log(props.route.params.messages)
      setMessages(props.route.params.messages)

      socket.emit('initiateChat', {client_id: clientId}, (y) =>
        console.log(y, 'initiateChat'),
      )
      socket.on('messageToUser', (response) => {
        console.log(response, 'messageToUserfromChatSceen')

        setMessages((prev) => prev.concat(response))
        listRef?.current?.scrollToEnd()
      })
    })

    return unsubscribe
  }, [clientId, props.navigation, props.route.params.messages, socket])

  const sendMessage = () => {
    socket.emit(
      'messageToServer',
      {
        rooms,
        message: {
          text: message,
          to: clientId,
        },
      },
      (r) => console.log(r),
    )

    setMessage('')
  }

  return (
    <>
      {milestoneModal()}
      <KeyboardAvoidingView keyboardVerticalOffset={1} behavior={'position'}>
        <View style={styles.screen}>
          <View style={styles.headingContainer}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../assets/appHeadingIcon.png')}
                // style={{marginRight: 10}}
                style={{width: 50, height: 50, marginRight: 10}}
              />
              <View>
                <Text style={styles.heading}>Delivery</Text>
                <Text style={[styles.heading, {marginTop: -15}]}>PAY</Text>
              </View>
            </View>

            <View
              style={{
                marginRight: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.name}>{user.firstName}</Text>
                {/* <Text style={[styles.name, {marginTop: -5}]}>
                  {user.lastName}
                </Text> */}
              </View>

              <TouchableOpacity style={styles.personButton} activeOpacity={0.6}>
                <Icon name="person" color="#2699FB" size={30} />
              </TouchableOpacity>
              {/* <View style={{flexDirection: 'row'}}></View> */}
            </View>
          </View>

          <View style={styles.innerList}>
            <View style={styles.imageView}>
              <Image style={styles.image} source={{uri: image}} />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{`${name}`}</Text>
              <Text style={styles.phoneNumber}>{user.phoneNumber}</Text>
              <Text style={styles.email}>{email}</Text>
              <Text style={styles.address}>Mumbai India</Text>
            </View>
            <View style={styles.requestStatusView}>
              <Text style={styles.requestStatus}>Connected</Text>
            </View>
            <View></View>
            <TouchableOpacity
              style={{width: '25%'}}
              activeOpacity={0.6}
              onPress={() =>
                props.navigation.navigate('products', {
                  id: userType === 'seller' ? user.userId : clientId,
                })
              }>
              <LinearGradient
                colors={
                  userType === 'seller'
                    ? [colors.blue, colors.blue]
                    : [colors.purple, colors.purple]
                }
                style={styles.optionsView}
                start={{x: 0, y: 0}}
                end={{x: 1.2, y: 0}}>
                <Text style={styles.optionText}>
                  {userType === 'seller' ? 'Create Order' : 'View Shop'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.payView}>
            {/* <View style={{width: '75%'}}> */}
            {userType === 'buyer' && (
              <>
                <TouchableOpacity
                  style={{width: '25%'}}
                  activeOpacity={0.6}
                  onPress={() => {
                    setVisible(true)
                  }}>
                  <LinearGradient
                    colors={[colors.purple, colors.purple]}
                    style={styles.optionsView}
                    start={{x: 0, y: 0}}
                    end={{x: 1.2, y: 0}}>
                    <Text style={styles.optionText}>Pay</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.payText}>
                  Click on pay if your deal is done it will be debited to
                  Delivery Pay wallet with {name}
                </Text>
              </>
            )}
            {/* </View> */}
          </View>
          {/* <View style={styles.requestView}>
            <Image
              style={styles.tileImage}
              source={require('../assets/icons/arrow.png')}
            />
            <Text style={styles.requestText}>Your request is pending</Text>
          </View> */}
          {/* <View
            style={{
              height: window.height < 700 ? 314 : 385,
              // marginVertical: 5,
            }}> */}
          <View
            style={{
              // flex: 1,
              height:
                window.height < 700
                  ? userType === 'buyer'
                    ? window.height - 365
                    : window.height - 320
                  : userType === 'buyer'
                  ? window.height - 385
                  : window.height - 340,
            }}>
            <FlatList
              data={messages}
              extraData={true}
              ref={(ref) => (listRef.current = ref)}
              keyExtractor={(item, index) => item._id}
              renderItem={({item}) => {
                return item.from !== props.route.params.clientId ? (
                  <>
                    {item.media ? (
                      <Image
                        source={{uri: item.media}}
                        resizeMethod="scale"
                        style={{
                          width: 200,
                          height: 200,
                          resizeMode: 'contain',
                          alignSelf: 'flex-end',
                        }}
                      />
                    ) : (
                      <View
                        style={[
                          styles.messageContainer,
                          {alignItems: 'flex-end'},
                        ]}>
                        <View
                          style={[
                            styles.messageView,
                            {
                              backgroundColor: '#F9EAF4',
                              borderBottomLeftRadius: 0,
                            },
                          ]}>
                          <Text style={styles.messageText}>{item.text}</Text>
                        </View>
                        {/* <Text style={styles.timeText}>{item.time}</Text> */}
                      </View>
                    )}
                    {/* )} */}
                  </>
                ) : (
                  <>
                    {item.media ? (
                      <Image
                        source={{uri: item.media}}
                        resizeMethod="scale"
                        style={{
                          width: 200,
                          height: 200,
                          resizeMode: 'contain',
                        }}
                      />
                    ) : (
                      <View style={styles.messageContainer}>
                        <View
                          style={[
                            styles.messageView,
                            {
                              // marginBottom: 0,
                              backgroundColor: '#BCE0FD',
                              borderBottomRightRadius: 0,
                            },
                          ]}>
                          <Text style={styles.messageText}>{item.text}</Text>
                        </View>
                        {/* <Text style={styles.timeText}>{item.time}</Text> */}
                      </View>
                    )}
                  </>
                )
              }}
            />
          </View>
          {/* </View> */}

          <View style={styles.searchBarContainer}>
            <View style={styles.searchBarView}>
              <TextInput
                placeholder={'Type a message here'}
                style={styles.input}
                placeholderTextColor="#707070"
                multiline={true}
                value={message}
                onChangeText={(text) => setMessage(text)}
              />
            </View>
            <TouchableOpacity onPress={filePickerHandler}>
              <Icon name="attach-file" size={30} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!message}
              style={styles.sendButton}
              onPress={sendMessage}>
              <Image
                style={styles.tileImage}
                source={require('../assets/icons/sendMessage.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <BottomBar />

      {/* </TouchableWithoutFeedback> */}
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    flexGrow: 1,
  },
  headingContainer: {
    marginTop: 5,
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'Poppins-BoldItalic',
    fontSize: 22,
    color: '#5ab1fc',
  },
  innerList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    // paddingTop: 5,
    marginVertical: 5,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 40,
    // marginRight: 10,
  },
  details: {
    // paddingLeft: 5,
    // marginLeft: 10,
  },
  name: {
    fontSize: 12,
    color: '#2A2A2A',
    fontFamily: 'Poppins-Regular',
  },
  phoneNumber: {
    fontSize: 12,
    color: '#2A2A2A',
    fontFamily: 'Poppins-Regular',
  },
  email: {
    fontSize: 12,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
  },
  address: {
    fontSize: 12,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
  },
  requestStatusView: {
    // paddingBottom: 50,
    // paddingRight: 40,
    left: -10,
    top: 10,
  },
  requestStatus: {
    fontSize: 11,
    color: '#2020D5',
  },

  chartStatusView: {
    width: '18%',
    height: 40,
    backgroundColor: '#BCE0FD',
    alignItems: 'center',
    borderRadius: 15,
    justifyContent: 'center',
  },
  chartStatus: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#0D0E0F',
  },
  optionsView: {
    textAlign: 'center',
    width: '90%',
    // height: 200,
    // paddingLeft: 5,
    borderRadius: 25,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#1BE6D6',
  },
  optionText: {
    color: 'white',
  },
  payView: {
    // marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',

    marginHorizontal: 5,
  },
  payText: {
    color: '#707070',
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    width: '75%',
    // textAlign: 'center',
  },
  requestView: {
    marginTop: 5,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestText: {
    marginLeft: 20,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  searchBarContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  searchBarView: {
    width: '70%',
    borderWidth: 1,
    borderColor: '#707070',
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  input: {
    color: '#707070',
    fontFamily: 'Poppins-Regular',
    // fontSize: 16,
    textAlignVertical: 'center',
  },
  sendButton: {
    // marginLeft: 10,
    backgroundColor: '#336CF9',
    width: 45,
    height: 45,
    borderRadius: 100,

    alignItems: 'center',
    justifyContent: 'center',
  },

  messageContainer: {
    marginHorizontal: 20,
    marginVertical: 5,
  },
  messageView: {
    borderRadius: 35,
    paddingVertical: 5,
    paddingHorizontal: 20,
    width: '80%',
  },
  messageText: {
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  timeText: {
    marginTop: 10,
    color: '#2A2A2A',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginRight: 10,
  },
  modalHeadingContainer: {
    borderBottomColor: '#aaa',
    borderBottomWidth: 2,
    width: '100%',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  modalContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '80%',
    paddingVertical: 10,
    alignSelf: 'center',
    borderRadius: 20,
  },
  field: {
    borderBottomWidth: 2,
    fontSize: 16,
    width: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    // alignItems: 'center',
    borderBottomColor: '#cccc',
    marginTop: 10,
  },
  redBorder: {
    borderBottomColor: '#c12323',
  },
  callToActionText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#fff',
  },
})

export default ChatScreen
