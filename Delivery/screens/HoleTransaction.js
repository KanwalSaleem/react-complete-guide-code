import React, {useEffect, useState} from 'react'
import Header from '../components/Header'
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
} from 'react-native'

import moment from 'moment'
import BottomBar from '../components/BottomBar'
import LinearGradient from 'react-native-linear-gradient'
import Colors from '../constants/colors'
import {useHttpClient} from '../hooks/http-hook'

const Data = [
  {
    id: '1',
    image: require('../assets/profile.jpg'),
    name: 'Teja Pujari',
    role: 'Buyer',
    transactionId: '9598464165',
    product: 'Mobile',
    status: 'Released',
    amount: '2000/-',
    holdDate: '31-3-21',
    holdTime: '10.30 P.M.',
    releasedDate: '01-4-21',
    releasedTime: '10.30 A.M.',
    releasedToSeller: 'Seller',
    verificationMethod: 'Smooth',
  },

  {
    id: '2',
    image: require('../assets/profile.jpg'),
    name: 'Teja Pujari',
    role: 'Seller',
    transactionId: '9598464165',
    product: 'Mobile',
    status: 'Released',
    amount: '2000/-',
    holdDate: '31-3-21',
    holdTime: '10.30 P.M.',
    releasedDate: '01-4-21',
    releasedTime: '10.30 A.M.',
    releasedToSeller: 'Seller',
    verificationMethod: 'Smooth',
  },
  {
    id: '3',
    image: require('../assets/profile.jpg'),
    name: 'Teja Pujari',
    role: 'Buyer',
    transactionId: '9598464165',
    product: 'Mobile',
    status: 'Manual Verification',
    amount: '2000/-',
    holdDate: '31-3-21',
    holdTime: '10.30 P.M.',
    releasedDate: '01-4-21',
    releasedTime: '10.30 A.M.',
    releasedToSeller: 'Seller',
    verificationMethod: 'Smooth',
  },
  {
    id: '4',
    image: require('../assets/profile.jpg'),
    name: 'Teja Pujari',
    role: 'Buyer',
    transactionId: '9598464165',
    product: 'Seller',
    status: 'Hold',
    amount: '2000/-',
    holdDate: '31-3-21',
    holdTime: '10.30 P.M.',
    releasedDate: '01-4-21',
    releasedTime: '10.30 A.M.',
    releasedToSeller: 'Seller',
    verificationMethod: 'Smooth',
  },
  {
    id: '5',
    image: require('../assets/profile.jpg'),
    name: 'Teja Pujari',
    role: 'Seller',
    transactionId: '9598464165',
    product: 'Mobile',
    status: 'Hold',
    amount: '2000/-',
    holdDate: '31-3-21',
    holdTime: '10.30 P.M.',
    releasedDate: '01-4-21',
    releasedTime: '10.30 A.M.',
    releasedToSeller: 'Seller',
    verificationMethod: 'Smooth',
  },
]

const HoleTransaction = (props) => {
  const {sendRequest, error, clearError, isLoading} = useHttpClient()
  const [transactions, setTransaction] = useState([])

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      try {
        const resData = await sendRequest(
          'https://deliverypay.in/api/transactions',
          'GET',
        )

        console.log(resData)
        const validTransactions = resData
          .map((transaction) => {
            if ('client' in transaction) {
              return {
                firstName: transaction.client.firstName,
                lastName: transaction.client.lastName,
                productDetail: transaction.dscr,
                transactionId: transaction.milestoneId._id,
                releaseDate: transaction.milestoneId.releaseDate,
                verificationMethod: transaction.milestoneId.verification,
                amount: transaction.amount,
                holdDate: transaction.createdAt,
                status: transaction.milestoneId.status,
                releaseTo: 'seller',
                role: 'Buyer',
                img: transaction.client._id.profileImg,
              }
            }
          })
          .filter((transaction) => transaction !== undefined)
        console.log(validTransactions)
        setTransaction(validTransactions)
        if (error) {
          Alert.alert(Error, error, [{onPress: () => clearError()}])
          // return
        }
      } catch (e) {
        console.log(e)
      }
    })
    return unsubscribe
  }, [props.navigation])
  return (
    <>
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
        <View style={styles.list}>
          {
            <FlatList
              data={transactions}
              keyExtractor={(item, index) => item.transactionId}
              renderItem={({item}) => {
                return (
                  <View
                    style={[
                      styles.listItem,
                      {
                        backgroundColor:
                          item.role === 'Buyer' ? '#F9EAF4' : '#BCE0FD',
                      },
                    ]}>
                    <View style={styles.listHeading}>
                      <Text style={styles.headingText}>Name</Text>
                      <Text style={styles.headingText}>Role</Text>
                      {/* <Text style={styles.headingText}>Transaction Id</Text> */}
                      <Text style={styles.headingText}>Product</Text>
                      <Text style={styles.headingText}>Status</Text>
                    </View>
                    <View style={styles.innerList}>
                      <View style={styles.nameView}>
                        <Image style={styles.image} source={{uri: item.img}} />
                        <Text
                          style={
                            styles.name
                          }>{`${item.firstName} ${item.lastName}`}</Text>
                      </View>
                      <View style={styles.roleView}>
                        <Text style={styles.role}>{item.role}</Text>
                      </View>
                      <View style={styles.transactionIdView}>
                        {/* <Text style={styles.transactionId}>
                        {item.transactionId}
                      </Text> */}
                      </View>
                      <View style={styles.productView}>
                        <Text style={styles.product}>{item.productDetail}</Text>
                      </View>
                      {/* <TouchableOpacity> */}
                      <LinearGradient
                        colors={['#1BE6D6', '#0E736B']}
                        // start={{x: 0, y: 0}}
                        // end={{x: 1, y: 0}}
                        style={styles.statusView}>
                        <Text style={styles.status}>
                          {item.status === 'pendingRelease'
                            ? 'Requested'
                            : item.status}
                        </Text>
                      </LinearGradient>
                      {/* </TouchableOpacity> */}
                    </View>
                    <View style={styles.amountHeading}>
                      <View style={styles.amountView}>
                        <Text style={styles.amountText}>Amount</Text>
                      </View>
                      <View style={styles.amountView}>
                        <Text style={styles.amountText}>Hold Date</Text>
                      </View>
                      <View style={styles.amountView}>
                        <Text style={styles.amountText}>Released Date</Text>
                      </View>
                      <View style={styles.amountView}>
                        <Text style={styles.amountText}>
                          Released to seller
                        </Text>
                      </View>
                      <View style={styles.amountView}>
                        <Text style={styles.amountText}>
                          Verification Method
                        </Text>
                      </View>
                    </View>
                    <View style={styles.amountList}>
                      <Text style={styles.amountItem}>{item.amount}</Text>
                      <View>
                        <Text style={styles.amountItem}>
                          {moment(item.holdDate).format('MMM DD, YY ')}
                        </Text>
                        {/* </Moment> */}
                        {/* <Text style={styles.amountItem}>{item.holdTime}</Text> */}
                      </View>
                      <View>
                        <Text style={styles.amountItem}>
                          {moment(item.releaseDate).format('MMM DD, YY ')}
                        </Text>
                        {/* <Text style={styles.amountItem}>{item.releasedTime}</Text> */}
                      </View>
                      <Text style={styles.amountItem}>{item.releaseTo}</Text>
                      <Text style={[styles.amountItem, {textAlign: 'center'}]}>
                        {item.verificationMethod}
                      </Text>
                    </View>
                  </View>
                )
              }}
            />
          }
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
    backgroundColor: '#2699FB',
    // borderRadius: 10,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secureTransactionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    color: '#F8FAFF',
    paddingBottom: 10,
    textAlign: 'center',
  },
  secureTransactionsubTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#F8FAFF',
    paddingTop: 10,
    textAlign: 'center',
  },
  listHeading: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
  },
  headingText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#33A6FF',
    // width: 90,
    textAlign: 'center',
  },
  amountHeading: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // alignItems: 'center',
    paddingBottom: 40,
    // paddingHorizontal: 10,
  },
  amountView: {
    width: '20%',
  },
  amountText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#33A6FF',
    textAlign: 'center',
    flexWrap: 'wrap',
    // textAlignVertical: 'top',
    // paddingHorizontal: 2,
  },
  list: {
    paddingHorizontal: 5,
    paddingBottom: 120,
  },
  listItem: {
    marginTop: 50,
    paddingVertical: 40,
    borderRadius: 30,
    paddingHorizontal: 5,
  },
  innerList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // alignContent: 'center',
    // alignSelf: 'center',
    // paddingVertical: 20,
    paddingBottom: 40,
  },
  amountList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  nameView: {
    // paddingRight: 5,
    // paddingTop: 5,
    alignItems: 'center',
  },
  name: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#2020D5',
    paddingTop: 10,
  },
  roleView: {
    paddingRight: 10,
  },
  role: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#0D0E0F',
  },
  transactionId: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#2A2A2A',
  },
  productView: {
    paddingLeft: 10,
    // paddingRight: 5,
  },
  product: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#707070',
  },

  statusView: {
    width: 80,
    // height: 200,
    // paddingLeft: 5,
    borderRadius: 30,
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
  amountItem: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#707070',
    // textAlign: 'center',
  },
})

export default HoleTransaction
