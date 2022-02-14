import React, {useEffect, useRef, useState} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
} from 'react-native'
import Header from '../components/Header'
import BottomBar from '../components/BottomBar'
import {useHttpClient} from '../hooks/http-hook'
import moment from 'moment'
import {ActivityIndicator, Modal, Portal} from 'react-native-paper'
import colors from '../constants/colors'
import {Controller, useForm} from 'react-hook-form'

import {FlatList, ScrollView} from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import DocumentPicker from 'react-native-document-picker'
import Icon from 'react-native-vector-icons/MaterialIcons'

const TicketDetails = ({route}) => {
  let [files, setFiles] = useState([])
  const {sendRequest, error} = useHttpClient()
  const {
    sendRequest: replyRequest,
    error: replyError,
    isLoading: isReplyLoading,
  } = useHttpClient()
  const {
    control,
    handleSubmit,
    reset,
    setValue,

    formState: {errors, isValid},
  } = useForm()

  const [ticket, setTicket] = useState()
  const [visible, setVisible] = useState(false)

  const onSubmit = async (data) => {
    let body = {_id: route.params.id, message: {body: data.message}}

    console.log(data.files)
    if (data.files.length > 0) {
      body.message.files = data.files.map((file) => file.uri)
    }

    console.log(body)

    try {
      const response = await replyRequest(
        'https://deliverypay.in/api/addTicketReply',
        'PATCH',

        JSON.stringify(body),
        {
          Accept: '/',
          'Content-Type': 'application/json',
        },
      )
      if (replyError) {
        Alert.alert('error', response.message)
      }
      Alert.alert('Success', response.message)
      reset({})
      setVisible(false)
      console.log(response)
    } catch (e) {
      e
    }
    // console.log(data)
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
        allowMultiSelection: true,
        mode: 'import',
      })

      // images[fileIndex] = {
      //   uri: response.uri,
      //   type: response.type,
      //   fileName: response.name,
      // }
      setValue('files', response)
      setFiles(response)
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const getTicket = async () => {
      try {
        const response = await sendRequest(
          `https://deliverypay.in/api/singleTicket?_id=${route.params.id}`,
        )

        console.log(response)
        setTicket(response.ticket)
      } catch (e) {
        e
      }
    }

    getTicket()
  }, [route.params.id, sendRequest])

  const ticketModal = () => {
    return (
      <Portal>
        <Modal
          visible={visible}
          contentContainerStyle={styles.modalBackground}
          onDismiss={() => {
            setVisible(false)

            reset()
          }}>
          <View style={styles.modalHeadingContainer}>
            <Text style={styles.modalHeading}>Add Reply</Text>
          </View>

          <Controller
            control={control}
            name="message"
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Message"
                placeholderTextColor="grey"
                style={[styles.field, errors.amount && styles.redBorder]}
              />
            )}
          />
          <TouchableOpacity
            style={styles.imageButton}
            activeOpacity={0.6}
            onPress={filePickerHandler}>
            <Icon name="add" size={30} color="#ccc" />
          </TouchableOpacity>
          {files.length > 0 && (
            <Text>{`${files.length} Photos Selected`} </Text>
          )}
          {isReplyLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleSubmit(onSubmit)}>
                <LinearGradient
                  end={{x: 1, y: 0}}
                  colors={['#2598b6', '#1BE6D6']}
                  style={{
                    borderRadius: 20,
                    height: 48,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    width: 120,
                  }}>
                  <Text style={styles.buttonText}>Reply</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                // style={{width: 171, marginVertical: 20}}
                activeOpacity={0.6}
                onPress={handleSubmit(onSubmit)}>
                <LinearGradient
                  end={{x: 1, y: 1}}
                  colors={['#2598b6', '#f64bbd']}
                  style={{
                    borderRadius: 20,
                    height: 48,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    width: 120,
                  }}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Modal>
      </Portal>
    )
  }

  return (
    <>
      {ticketModal()}

      <Header />

      <FlatList
        ListHeaderComponent={
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View
              style={{alignItems: 'flex-end', paddingRight: 10, paddingTop: 5}}>
              <LinearGradient
                colors={['#000', '#0065cd']}
                start={{x: 0, y: -2}}
                end={{x: 0, y: 2}}
                style={{padding: 10, borderRadius: 15}}>
                <TouchableOpacity
                  onPress={() => setVisible(true)}
                  activeOpacity={0.6}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    Add Reply
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
            <View>
              <Text style={styles.heading}>Ticket Summary</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>ticket ID</Text>

              <Text style={styles.itemText}>{ticket && ticket._id}</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>Status</Text>

              <Text style={styles.itemText}>{ticket && ticket.status}</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>Issue</Text>

              <Text style={styles.itemText}>{ticket && ticket.issue}</Text>
            </View>
            {/* <View style={styles.orderItem}>
<Text style={styles.itemText}>Issued By</Text>

<Text style={styles.itemText}>{ticket && ticket.plaintiff.role}</Text>
</View> */}
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>Created At</Text>

              <Text style={styles.itemText}>
                {ticket &&
                  moment(ticket.createdAt).format('hh:mm a, DD MMM YYYY')}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>Last Activity</Text>

              <Text style={styles.itemText}>
                {ticket &&
                  moment(ticket.updatedAt).format('hh:mm a, DD MMM YYYY')}
              </Text>
            </View>

            <View>
              <Text style={styles.heading}>Milestone Details</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>Amount</Text>
              {/* <Text style={styles.itemText}>
    {ticket && ticket.milestone.amount}
  </Text> */}
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>Status</Text>
              <Text style={styles.itemText}>
                {ticket && ticket?.milestone?.status}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>CreatedAt</Text>

              <Text style={styles.itemText}>
                {ticket &&
                  moment(ticket?.milestone?.createdAt).format(
                    'hh:mm a, DD MMM YYYY',
                  )}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>verification Method</Text>
              <Text style={styles.itemText}>
                {ticket && ticket?.milestone?.verification}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>Seller</Text>
              <Text style={styles.itemText}>
                {ticket &&
                  `${ticket?.milestone?.seller?.firstName} ${ticket?.milestone?.seller?.lastName}`}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>Buyer</Text>
              <Text style={styles.itemText}>
                {ticket &&
                  `${ticket?.milestone?.buyer?.firstName} ${ticket?.milestone?.buyer?.lastName}`}
              </Text>
            </View>
            <View>
              <View style={styles.orderItem}>
                <Text style={styles.itemText}> Description</Text>

                <Text style={styles.itemText}>
                  {ticket && ticket.milestone?.dscr}
                </Text>
              </View>
            </View>
            <Text style={styles.heading}>Transaction Details</Text>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>Type</Text>

              <Text style={styles.itemText}>
                {ticket && ticket.transaction?.__t}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>Amount</Text>

              <Text style={styles.itemText}>
                {ticket && ticket.transaction?.amount}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>Note</Text>

              <Text style={styles.itemText}>
                {ticket && ticket.transaction?.note}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemText}>CreatedAt</Text>

              <Text style={styles.itemText}>
                {ticket &&
                  moment(ticket.transaction?.createdAt).format(
                    'hh:mm a, DD MMM YYYY',
                  )}
              </Text>
            </View>
            <Text style={styles.heading}>Messages</Text>
          </ScrollView>
        }
        data={ticket && ticket.messages}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.messageView}>
            <View>
              <Text style={styles.clientName}>{item.user.name}</Text>

              <Text
                style={[styles.clientName, {color: 'grey'}]}>{`${item.user.role
                .charAt(0)
                .toUpperCase()}${item.user.role.slice(1)}`}</Text>

              <Text style={styles.messageDate}>
                {moment(item.createdAt).format('hh:mm a, DD MMM YYYY')}
              </Text>
              <Text style={styles.clientName}>{item.message.body}</Text>
            </View>
            <View>
              {item.message.files.map((file) => (
                <Image
                  key={file}
                  source={{uri: file}}
                  resizeMode="contain"
                  style={{width: 120, height: 150, marginBottom: 10}}
                />
              ))}
            </View>
          </View>
        )}
      />

      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  heading: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  orderItem: {
    borderBottomColor: '#ccc',

    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  itemText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 17,
  },
  milestoneHeading: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  personView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  modalBackground: {
    backgroundColor: 'white',
    // alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeading: {
    color: '#299ab7',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 30,
    marginBottom: 10,
  },
  button: {
    width: '40%',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
  field: {
    width: '90%',
    alignSelf: 'center',
    borderBottomWidth: 2,
    fontSize: 16,
    borderBottomColor: '#cccc',
    marginTop: 10,
  },
  redBorder: {
    borderBottomColor: '#c12323',
  },
  imageButton: {
    alignSelf: 'center',
    marginTop: 10,
    height: 120,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000008',
    borderRadius: 20,
  },

  messageView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 10,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  messageDate: {
    fontSize: 16,
    fontFamily: 'Poppins-light',
    color: 'grey',
  },
  clientName: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    // marginRight: 2,
  },
})

export default TicketDetails
