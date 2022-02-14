import React, {useEffect, useState, useCallback} from 'react'
import Header from '../components/Header'
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native'

import {ActivityIndicator, Modal, Portal} from 'react-native-paper'
import BottomBar from '../components/BottomBar'
import LinearGradient from 'react-native-linear-gradient'
import colors from '../constants/colors'

import {useHttpClient} from '../hooks/http-hook'
import ApproveDecline from '../components/ApproveDecline'
import ReleaseConfirm from '../components/ReleaseConfirm'
import DisputeModal from '../components/DisputeModal'

const Hold = (props) => {
  const [milestones, setMilestones] = useState([])
  const [milestoneId, setMilestoneId] = useState()
  const [amount, setAmount] = useState()

  const [approveVisible, setApproveVisible] = useState(false)
  const [releaseVisible, setReleaseVisible] = useState(false)
  const [transactionModal, setTransactionModal] = useState()
  const [clientId, setClientId] = useState()
  const [disputeVisible, setDisputeVisible] = useState(false)
  const [role, setRole] = useState()

  const {sendRequest, error, clearError, isLoading} = useHttpClient()

  const detailModal = () => {
    return (
      <Portal>
        <Modal
          visible={transactionModal}
          dismissable={true}
          onDismiss={() => setTransactionModal(null)}
          contentContainerStyle={{
            backgroundColor: 'white',
            width: '95%',
            // height: 200,
            padding: 30,
            justifyContent: 'center',
            alignSelf: 'center',
            borderRadius: 10,
            // alignItems: 'center',
          }}>
          <Text style={modalStyles.heading}>Transaction Detail</Text>
          <View style={modalStyles.detailContainer}>
            <Text style={modalStyles.text}>Name:</Text>
            <Text style={modalStyles.text}> {transactionModal?.name}</Text>
          </View>
          <View style={modalStyles.detailContainer}>
            <Text style={modalStyles.text}>Role:</Text>
            <Text style={modalStyles.text}>{transactionModal?.role}</Text>
          </View>
          <View style={modalStyles.detailContainer}>
            <Text style={modalStyles.text}>Status:</Text>
            <Text style={modalStyles.text}> {transactionModal?.status}</Text>
          </View>
          <View style={modalStyles.detailContainer}>
            <Text style={modalStyles.text}>Product:</Text>
            <Text style={modalStyles.text}> {transactionModal?.product}</Text>
          </View>
          <View style={modalStyles.detailContainer}>
            <Text style={modalStyles.text}>Transaction ID:</Text>
            <Text style={modalStyles.text}>
              {'   '}
              {transactionModal?.transactionId}
            </Text>
          </View>
          <View style={modalStyles.detailContainer}>
            <Text style={modalStyles.text}>Amount</Text>
            <Text style={modalStyles.text}>
              {'   '}
              {transactionModal?.amount}
            </Text>
          </View>
        </Modal>
      </Portal>
    )
  }

  const modalStyles = StyleSheet.create({
    detailContainer: {flexDirection: 'row', justifyContent: 'space-between'},
    text: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
    },
    heading: {
      textAlign: 'center',
      fontSize: 22,
      marginBottom: 20,
    },
  })

  const getMilestones = useCallback(async () => {
    try {
      const response = await sendRequest('https://deliverypay.in/api/milestone')

      console.log(response)

      const validMileStones = response.milestones.map((milestone) => ({
        id: milestone._id,
        status: milestone.status,
        amount: milestone.amount,
        description: milestone.dscr,
        date: milestone.createdAt,
        firstName: milestone.client.firstName,
        lastName: milestone.client.lastName,
        image: milestone.client.profileImg,
        role: milestone.role,
        clientId: milestone.client._id,
      }))
      setMilestones(validMileStones)
      if (error) {
        Alert.alert('Error', error, [{onPress: () => clearError()}])
      }
    } catch (e) {
      e
    }
  }, [clearError, error, sendRequest])

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', getMilestones)

    return unsubscribe
  }, [getMilestones, props.navigation])

  return (
    <>
      <DisputeModal
        id={milestoneId}
        clientId={clientId}
        open={disputeVisible}
        setOpen={setDisputeVisible}
        role={role}
      />
      <ReleaseConfirm
        open={releaseVisible}
        setOpen={setReleaseVisible}
        id={milestoneId}
      />
      {approveVisible && (
        <ApproveDecline
          open={approveVisible}
          setOpen={setApproveVisible}
          id={milestoneId}
          amount={amount}
        />
      )}
      {detailModal()}
      <Header />
      <View style={styles.screen}>
        <View style={styles.secureTransactionView}>
          <Text style={styles.secureTransactionTitle}>
            Secure Your transactions
          </Text>
          <Text style={styles.secureTransactionsubTitle}>
            All payments and transactions come here
          </Text>
        </View>
        <View style={styles.listHeading}>
          <Text style={styles.headingText}>Name</Text>
          <Text style={styles.headingText}>Role</Text>
          <Text style={styles.headingText}>TransactionId</Text>
          <Text style={styles.headingText}>Product</Text>
          <Text style={styles.headingText}>Status</Text>
        </View>
        <View>
          {isLoading ? (
            <View
              style={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <FlatList
              style={{marginBottom: 40}}
              initialNumToRender={7}
              data={milestones}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => {
                return (
                  <>
                    <TouchableOpacity
                      style={styles.innerList}
                      activeOpacity={0.7}
                      onPress={() =>
                        setTransactionModal({
                          name: `${item.firstName} ${item.lastName}`,
                          role: `${item.role}`,
                          transactionId: item.id,
                          status: item.status,
                          product: item.description,
                          amount: item.amount,
                        })
                      }>
                      <View style={styles.nameView}>
                        <Image
                          style={styles.image}
                          source={{uri: item.image}}
                        />
                        <Text style={styles.name}>
                          {`${item.firstName}
                        `}
                          {/* ${item.lastName}  */}
                        </Text>
                      </View>
                      <View style={styles.roleView}>
                        <Text style={styles.role}>{item.role}</Text>
                      </View>
                      <View style={styles.transactionIdView}>
                        <Text style={styles.transactionId}>
                          {item.id.substring(0, 9)}
                        </Text>
                      </View>
                      <View style={styles.productView}>
                        <Text style={styles.product}>
                          {item.description.substring(0, 5)}
                        </Text>
                      </View>
                      {item.status === 'pendingRelease' && (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => {
                            setDisputeVisible(true)
                            setClientId(item.clientId)
                            setMilestoneId(item.id)
                            setRole(item.role)
                          }}>
                          {/* <View style={styles.statusView}> */}
                          <LinearGradient
                            colors={
                              item.status == 'Hold'
                                ? ['#336CF9', '#1BE6D6']
                                : ['#1BE6D6', '#013B67']
                            }
                            // start={{x: 0, y: 0}}
                            // end={{x: 1, y: 0}}
                            style={styles.statusView}>
                            <Text style={styles.status}>Release Requested</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}

                      {item.status === 'pending' && (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => {
                            setApproveVisible(true)
                            setMilestoneId(item.id)
                            setAmount(item.amount)
                          }}>
                          {/* <View style={styles.statusView}> */}
                          <LinearGradient
                            colors={
                              item.status == 'Hold'
                                ? ['#336CF9', '#1BE6D6']
                                : ['#1BE6D6', '#013B67']
                            }
                            // start={{x: 0, y: 0}}
                            // end={{x: 1, y: 0}}
                            style={styles.statusView}>
                            <Text style={styles.status}>Pending</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}

                      {item.status === 'declined' && (
                        <TouchableOpacity
                          disabled={true}
                          activeOpacity={0.6}
                          style={styles.declinedButton}>
                          {/* <View style={styles.statusView}> */}

                          <Text style={styles.declinedText}>Declined</Text>
                        </TouchableOpacity>
                      )}
                      {item.status === 'inProgress' && (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => {
                            setReleaseVisible(true)
                            setMilestoneId(item.id)
                            setAmount(item.amount)
                          }}>
                          <LinearGradient
                            colors={['#1BE6D6', '#013B67']}
                            style={styles.statusView}>
                            <Text style={styles.status}>Release</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                      {item.status === 'released' && (
                        <TouchableOpacity disabled={true} activeOpacity={0.6}>
                          <LinearGradient
                            colors={['#1BE6D6', '#013B67']}
                            style={styles.statusView}>
                            <Text style={styles.status}>Released</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                      {item.status === 'dispute' && (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => {
                            setDisputeVisible(true)
                            setMilestoneId(item.id)
                            setAmount(item.amount)
                            setRole(item.role)
                            setClientId(item.clientId)
                          }}>
                          <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            colors={['#f64bbd', '#ff5757']}
                            style={styles.statusView}>
                            <Text style={styles.status}>Approve Dispute</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  </>
                )
              }}
            />
          )}
        </View>
      </View>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // paddingTop: 30,
  },
  secureTransactionView: {
    backgroundColor: '#F9EAF4',

    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secureTransactionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    color: '#0D0E0F',
    // paddingBottom: 10,
    textAlign: 'center',
  },
  secureTransactionsubTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#707070',
    // paddingTop: 10,
    textAlign: 'center',
  },
  listHeading: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    // paddingHorizontal: 10,
  },
  headingText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#2020D5',
  },
  list: {
    // marginVertical: 30,
    paddingBottom: 240,
    paddingHorizontal: 10,
    // marginLeft: 10,
    // marginTop: 20,
    // paddingTop: 30,
  },
  innerList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // alignContent: 'center',
    // alignSelf: 'center',
    // paddingVertical: 20,
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 60,
  },
  nameView: {
    alignItems: 'center',
  },
  name: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#2A2A2A',
    textAlign: 'center',
  },
  roleView: {
    // paddingRight: 10,
  },
  role: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#53AEFC',
  },
  transactionId: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#2A2A2A',
  },
  productView: {
    paddingLeft: 15,
    // paddingRight: 5,
  },
  product: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#2A2A2A',
  },

  statusView: {
    width: 80,

    // padding: 10,
    borderRadius: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#1BE6D6',
  },
  status: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#F8FAFF',
    textAlign: 'center',
  },
  roleCheckMainView: {
    paddingBottom: 50,
    paddingLeft: 100,
    paddingRight: 10,
    // borderRadius: 10,
  },
  roleCheckView: {
    flexDirection: 'row-reverse',
    // width: 100,
    backgroundColor: '#F9EAF4',
    // paddingLeft: 40,
    // marginRight: 100,
    height: 150,
    borderRadius: 10,
    // marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  roleCheckText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#2A2A2A',
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  optionText: {
    color: 'white',
  },
  declinedButton: {
    borderRadius: 50,
    borderColor: '#f64bbd',
    borderWidth: 2,
    width: 80,

    // padding: 10,

    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declinedText: {
    color: '#f64bbd',
    fontWeight: '700',
  },
  releasedButton: {
    borderRadius: 50,
    borderColor: '#2598b6',
    borderWidth: 2,
    width: 80,
  },
  releasedText: {
    color: '#2598b6',
    fontWeight: '700',
  },
})

export default Hold
