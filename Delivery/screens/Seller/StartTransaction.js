import React, {useState, useEffect, useContext} from 'react'
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  useWindowDimensions,
  KeyboardAvoidingView,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import Header from '../../components/Header'
import BottomBar from '../../components/BottomBar'
import {AppContext} from '../../context/auth'

import {useHttpClient} from '../../hooks/http-hook'
import UserSearchItem from '../../components/UserSearchItem'
import CommonSearch from '../../components/CommonSearch'
import {Avatar, Portal, Modal} from 'react-native-paper'
import {Controller, useForm} from 'react-hook-form'
import LinearGradient from 'react-native-linear-gradient'
import {CommonActions} from '@react-navigation/native'
import {ActivityIndicator} from 'react-native-paper'
import colors from '../../constants/colors'

const StartTransaction = (props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm()

  const {sendRequest, error, clearError} = useHttpClient()
  const {userType} = useContext(AppContext)
  const {
    sendRequest: milestoneRequest,
    error: milestoneError,
    clearError: clearMilestoneError,
    loading: milestoneLoading,
  } = useHttpClient()
  const {
    sendRequest: recentPaymentsRequest,
    error: recentPaymentsError,
    clearPaymentsError,
  } = useHttpClient()
  const [users, setUsers] = useState([])
  const [payments, setPayments] = useState([])
  const [buyer, setBuyer] = useState({})
  const [visible, setVisible] = useState(false)
  const window = useWindowDimensions()

  const fetchUsers = async (query) => {
    if (query === '') {
      return setUsers([])
    }
    try {
      const response = await sendRequest(
        `https://deliverypay.in/api/getUsers?q=${query}`,
      )
      // console.log(response[0])

      setUsers(
        response.map((user) => ({
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.profileImg,
          id: user._id,
          phone: user.phone,
          email: user.email,
        })),
      )

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
        'https://deliverypay.in/api/requestMilestone',
        'POST',

        JSON.stringify({
          buyer_id: buyer.id,
          amount: data.amount,
          dscr: data.detail,
          // products: [],
        }),
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      )

      // console.log(response)
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
            setBuyer({})
            reset()
          }}>
          <View style={styles.modalHeadingContainer}>
            <Text style={styles.modalHeading}>Request Milestone</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            {buyer && <Avatar.Image source={{uri: buyer.image}} />}
            <View style={{alignItems: 'center'}}>
              {buyer && (
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',
                  }}>{`${buyer.firstName} ${buyer.lastName}`}</Text>
              )}
              <Text>{`${buyer.phone}`}</Text>
              <Text>{`${buyer.email}`}</Text>
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
          {milestoneLoading ? (
            <ActivityIndicator
              color={colors.primary}
              style={{marginVertical: 20}}
            />
          ) : (
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
          )}
        </Modal>
      </Portal>
    )
  }

  useEffect(() => {
    const getRecentPayments = async () => {
      try {
        const response = await recentPaymentsRequest(
          'https://deliverypay.in/api/recentPayments',
        )

        setPayments(response)

        if (recentPaymentsError) {
          Alert.alert('Error', recentPaymentsError, [
            {onPress: () => clearError()},
          ])
        }
      } catch (e) {
        e
      }
    }
    getRecentPayments()
  }, [recentPaymentsRequest])

  useEffect(() => {
    if (userType === 'buyer') {
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
            // style={{
            //   height:
            //     window.height < 700
            //       ? window.width < 400
            //         ? '20%'
            //         : '27%'
            //       : window.width < 400
            //       ? 192
            //       : 255,
            // }}
            style={{
              height:
                window.height < 700 ? window.height - 506 : window.height - 527,
              // paddingBottom: 15,
            }}>
            {users.length > 1 ? (
              <FlatList
                style={{paddingHorizontal: 10}}
                data={users}
                key={(item) => item.id}
                renderItem={(itemData) => {
                  return (
                    <UserSearchItem
                      image={itemData.item.image}
                      firstName={itemData.item.firstName}
                      lastName={itemData.item.lastName}
                      milestoneType="Request"
                      onPress={() => {
                        setBuyer(itemData.item)
                        setVisible(true)
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
      {milestoneModal()}
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
