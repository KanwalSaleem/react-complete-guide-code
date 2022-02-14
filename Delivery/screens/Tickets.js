import React, {useEffect, useState} from 'react'
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native'
import Header from '../components/Header'
import BottomBar from '../components/BottomBar'

import {Controller, useForm} from 'react-hook-form'
import {useHttpClient} from '../hooks/http-hook'
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Portal, Modal} from 'react-native-paper'
import DocumentPicker from 'react-native-document-picker'
import {ActivityIndicator} from 'react-native-paper'
import colors from '../constants/colors'

const Tickets = (props) => {
  const [files, setFiles] = useState(false)
  const {sendRequest, error, isLoading, clearError} = useHttpClient()
  const {
    sendRequest: ticketRequest,
    ticketError,
    ticketLoading,
    clearError: clearTicketError,
  } = useHttpClient()
  const [visible, setVisible] = useState(false)
  const [tickets, setTickets] = useState([])
  const {
    control,
    handleSubmit,
    reset,
    setValue,

    formState: {errors, isValid},
  } = useForm()

  const onSubmit = async (data) => {
    // console.log(data)
    let body = {
      issue: data.issue,
      message: {body: data.message, files: []},
    }
    if (data.transactionId != undefined) {
      body.transactionId = data.transactionId
    }
    if (data.milestoneId != undefined) {
      body.milestoneId = data.milestoneId
    }
    if (data.files.length > 0) {
      body.message.files = data.files.map((file) => file.uri)
    }
    console.log(JSON.stringify(body))
    try {
      const response = await ticketRequest(
        'https://deliverypay.in/api/openTicket',
        'POST',
        JSON.stringify(body),
        {
          Accept: '/',
          'Content-Type': 'application/json',
        },
      )
      console.log(JSON.stringify(body))
      if (ticketError)
        Alert.alert('Error', response.message, [
          {onPress: () => clearTicketError},
        ])
      console.log(response)
      Alert('success', 'Ticket Successfully filed')
    } catch (e) {
      e
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
            <Text style={styles.modalHeading}>Add Ticket</Text>
          </View>

          <Controller
            control={control}
            name="issue"
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Issue"
                placeholderTextColor="grey"
                style={[styles.field, errors.amount && styles.redBorder]}
              />
            )}
          />
          <Controller
            control={control}
            name="milestoneId"
            render={({field: {value, onChange}}) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Milestone ID (optional)"
                placeholderTextColor="grey"
                style={[styles.field, errors.amount && styles.redBorder]}
              />
            )}
          />
          <Controller
            control={control}
            name="transactionId"
            render={({field: {value, onChange}}) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Transaction ID (optional)"
                placeholderTextColor="grey"
                style={[styles.field, errors.amount && styles.redBorder]}
              />
            )}
          />
          <Controller
            control={control}
            name="message"
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <TextInput
                multiline={true}
                value={value}
                onChangeText={onChange}
                placeholder="Detail"
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
          {ticketLoading ? (
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
                  <Text style={styles.buttonText}>Submit</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                // style={{width: 171, marginVertical: 20}}
                activeOpacity={0.6}
                onPress={setVisible.bind(this, false)}>
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

  useEffect(() => {
    const getTickets = async () => {
      try {
        const response = await sendRequest(
          'https://deliverypay.in/api/getTickets?perPage=20&sort=dsc',
        )

        const validTickets = response.tickets.tickets.map((ticket) => ({
          id: ticket._id,
          issue: ticket.issue,
          status: ticket.status,
          date: ticket.createdAt,
        }))

        setTickets(validTickets)
        console.log(response)
        if (error) {
          Alert.alert('Error', error)
        }
      } catch (e) {
        e
      }
    }
    getTickets()
  }, [error, sendRequest])

  const gotToTicket = (id) => {
    props.navigation.navigate('ticketDetail', {
      id,
    })
  }

  // const ticketModal = () => {
  //   return (
  //     <Portal>
  //       <Modal
  //         visible={visible}
  //         contentContainerStyle={styles.modalContainer}
  //         onDismiss={() => {
  //           setVisible(false)

  //           reset()
  //         }}>
  //         <View style={styles.modalHeadingContainer}>
  //           <Text style={styles.modalHeading}>Open Heading</Text>
  //         </View>

  //         <Controller
  //           control={control}
  //           name="Issue"
  //           rules={{required: true}}
  //           render={({field: {value, onChange}}) => (
  //             <TextInput
  //               value={value}
  //               onChangeText={onChange}
  //               placeholder="Issue"
  //               placeholderTextColor="grey"
  //               style={[styles.field, errors.amount && styles.redBorder]}
  //             />
  //           )}
  //         />
  //         <Controller
  //           control={control}
  //           name="detail"
  //           rules={{required: true}}
  //           render={({field: {value, onChange}}) => (
  //             <TextInput
  //               value={value}
  //               onChangeText={onChange}
  //               placeholder="Detail"
  //               placeholderTextColor="grey"
  //               style={[
  //                 styles.field,
  //                 errors.detail && styles.redBorder,
  //                 {width: '80%'},
  //               ]}
  //             />
  //           )}
  //         />

  //         <TouchableOpacity
  //           style={{width: 171, marginVertical: 20}}
  //           activeOpacity={0.6}
  //           onPress={handleSubmit(onSubmit)}>
  //           <LinearGradient
  //             start={{x: 0, y: 0}}
  //             end={{x: 1, y: 0}}
  //             colors={['#2598b6', '#1BE6D6']}
  //             style={{
  //               borderRadius: 20,
  //               height: 48,
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //             }}>
  //             <Text style={styles.callToActionText}>Request Milestone</Text>
  //           </LinearGradient>
  //         </TouchableOpacity>
  //       </Modal>
  //     </Portal>
  //   )
  // }
  return (
    <>
      {ticketModal()}
      <Header />
      <View style={styles.head}>
        <Text style={styles.heading}>Ticket</Text>
        <LinearGradient
          colors={['#000', '#0065cd']}
          start={{x: 0, y: -2}}
          end={{x: 0, y: 2}}
          style={{padding: 10, borderRadius: 15}}>
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Text style={{color: 'white'}}>Open Ticket</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <View style={styles.orderItemContainer}>
        <Text style={styles.order}>Date</Text>
        <Text style={styles.order}>Issue</Text>
        <Text style={styles.order}>Status</Text>
      </View>
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={
          <View style={styles.emptyListView}>
            <Text style={styles.emptyListText}>There are no Tickets</Text>
          </View>
        }
        style={{backgroundColor: 'white'}}
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.orderItemContainer}
            onPress={gotToTicket.bind(this, itemData.item.id)}>
            <Text style={styles.order}>
              {moment(itemData.item.date).format('hh:mm a DD MMM YY')}
            </Text>
            <Text style={styles.order}>{itemData.item.issue}</Text>
            <Text style={styles.order}>{itemData.item.status}</Text>
          </TouchableOpacity>
        )}
      />
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  orderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',

    paddingVertical: 15,
  },
  order: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyListView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    // textAlign: 'center',
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
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
  },
})

export default Tickets
