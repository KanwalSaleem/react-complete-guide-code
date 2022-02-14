import React, {useState, useEffect, useContext, useCallback} from 'react'
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  useWindowDimensions,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import Header from '../../components/Header'
import BottomBar from '../../components/BottomBar'
import {useFocusEffect} from '@react-navigation/native'

import {useHttpClient} from '../../hooks/http-hook'
import UserSearchItem from '../../components/UserSearchItem'
import CommonSearch from '../../components/CommonSearch'
import {Avatar, Portal, Modal} from 'react-native-paper'
import {useForm, Controller} from 'react-hook-form'
import {CommonActions} from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import {AppContext} from '../../context/auth'

const StartTransaction = (props) => {
  const {sendRequest, error, clearError} = useHttpClient()
  const [users, setUsers] = useState([])
  const [visible, setVisible] = useState(false)
  const [payments, setPayments] = useState([])
  const [seller, setSeller] = useState()
  const window = useWindowDimensions()
  const {userType} = useContext(AppContext)
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm()
  const {
    sendRequest: milestoneRequest,
    error: milestoneError,
    clearError: clearMilestoneError,
    loading: milestoneLoading,
  } = useHttpClient()

  const fetchUsers = async (query) => {
    if (query === '') {
      return setUsers([])
    }
    try {
      const response = await sendRequest(
        `https://deliverypay.in/api/getUsers?q=${query}`,
      )
      console.log(response)
      setUsers(response)
      // setUsers(
      //   response.map((user) => ({
      //     firstName: user.firstName,
      //     lastName: user.lastName,
      //     image: user.profileImg,
      //     id: user._id,
      //   })),
      // )

      // eslint-disable-next-line no-empty
    } catch (e) {
      // Alert.alert('Error', error, [{onPress: clearError(), text: 'Okay'}])
    }
  }
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
      Alert.alert('Success', 'Milestone requested')
      reset()
    } catch (e) {
      console.log(e)
    }
    if (milestoneError) {
      Alert.alert('Error', milestoneError, [{onPress: () => clearError()}])
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
            setSeller({})
            reset()
          }}>
          <View style={styles.modalHeadingContainer}>
            <Text style={styles.modalHeading}>Create Milestone</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            {seller && <Avatar.Image source={{uri: seller.image}} />}
            <View style={{alignItems: 'center'}}>
              {seller && (
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',
                  }}>{`${seller.firstName} ${seller.lastName}`}</Text>
              )}
              {seller && <Text>{seller.phone}</Text>}
              {seller && <Text>{seller.email}</Text>}
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
              <Text style={styles.callToActionText}>Request Milestone</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Modal>
      </Portal>
    )
  }

  useFocusEffect(
    useCallback(() => {
      const getRecentPayments = async () => {
        try {
          const response = await sendRequest(
            'https://deliverypay.in/api/recentPayments',
          )

          console.log(response)
          setPayments(response)
        } catch (e) {
          e
        }
      }
      getRecentPayments()
    }, [sendRequest]),
  )

  useEffect(() => {
    if (userType === 'seller') {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'home/chooseCategory'}],
        }),
      )
    }
  }, [props.navigation, userType])

  return (
    <>
      {milestoneModal()}
      <KeyboardAvoidingView keyboardVerticalOffset={1} behavior={'position'}>
        <Header />
        <View style={styles.screen}>
          <Text style={styles.heading}>Start transcations with</Text>
          <Text style={styles.heading}>Delivery Pay</Text>
          <Text style={styles.secondHeading}>
            Let us help you make the safest transaction
          </Text>
          <Text style={styles.thirdHeading}>
            Start buying with Delivery Pay
          </Text>

          <CommonSearch
            placeholder="Search with Delivery Pay ID or Phone Number"
            onChangeText={fetchUsers}
          />

          <View
            style={{
              height:
                window.height < 700
                  ? window.height - 507
                  : window.height - 527.5,
            }}>
            {users.length > 1 ? (
              <FlatList
                style={{paddingHorizontal: 10}}
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={(itemData) => {
                  return (
                    <UserSearchItem
                      image={itemData.item.profileImg}
                      firstName={itemData.item.firstName}
                      lastName={itemData.item.lastName}
                      onPress={() => {
                        console.log(itemData)
                        props.navigation.navigate('products', {
                          id: itemData.item._id,
                        })
                      }}
                    />
                  )
                }}
              />
            ) : (
              <View style={styles.paymentsView}>
                {payments.map((payment) => (
                  <View style={{alignItems: 'center'}} key={payment._id}>
                    <Avatar.Image source={{uri: payment.profileImg}} />
                    <Text
                      style={{
                        fontSize: 16,
                      }}>{`${payment.firstName} ${payment.lastName}`}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 25,
  },
  secondHeading: {
    fontFamily: 'Poppins-Light',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  thirdHeading: {
    color: '#3c3cda',

    fontSize: 22,
    fontFamily: 'Poppins-Regular',
    marginTop: 15,
  },
  inputContainer: {
    width: '90%',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#5ab1fc',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 25,
  },
  input: {
    color: '#707070',
    fontFamily: 'Seoge-UI',
    fontSize: 14,
    flexGrow: 1,
  },
  paymentContainer: {},
  paymentsView: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
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

export default StartTransaction
