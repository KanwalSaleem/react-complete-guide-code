import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native'

import {Card} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'

import BottomBar from '../components/BottomBar'

const TransactionHistory = () => {
  const window = useWindowDimensions()
  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <View style={styles.userDetailContainer}>
          <TouchableOpacity style={styles.personButton} activeOpacity={0.6}>
            <Icon name="person" color="#2699FB" size={30} />
          </TouchableOpacity>
          <View style={{left: 10}}>
            <Text style={styles.name}>Hello</Text>
            <Text style={styles.name}>Swati Mishra</Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.6}>
          <Image
            source={require('../assets/bellRed2.png')}
            style={{width: 23, height: 29}}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          flex: 1,
        }}
        style={{
          width: '100%',
          // height: window.height < 700 ? 468 : 538,
        }}>
        <View>
          <Text style={styles.heading}>All Transaction History</Text>
        </View>
        <View style={styles.transactionItem}>
          <Text style={styles.transactionType}>Money added to Wallet</Text>
          <Text style={styles.transactionAmount}>₹2000</Text>
        </View>
        <View style={styles.transactionItem}>
          <Text style={styles.transactionType}>Paid to Teja Pujari</Text>
          <Text style={styles.transactionAmount}>₹2000</Text>
        </View>
        <View>
          <Text style={[styles.heading, {marginTop: 20}]}>
            Check ur Rewards
          </Text>
        </View>
        <View style={styles.rewardContainer}>
          <Card style={styles.rewardItem}>
            <TouchableOpacity
              style={styles.rewardItemTouch}
              activeOpacity={0.6}>
              <Text style={styles.rewardItemHeading}>Netflix</Text>
              <Image
                source={require('../assets/netflix.png')}
                style={{width: 53, height: 58}}
              />
              <Text style={{color: 'grey', marginVertical: 5}}>
                30 days free Trial
              </Text>
              <Text style={styles.redeemText}>Redeem</Text>
            </TouchableOpacity>
          </Card>
          <Card style={styles.rewardItem}>
            <TouchableOpacity
              style={styles.rewardItemTouch}
              activeOpacity={0.6}>
              <Text style={styles.rewardItemHeading}>Netflix</Text>
              <Image
                source={require('../assets/glasses.png')}
                style={{width: 78, height: 33}}
              />
              <Text style={{color: 'grey', marginVertical: 5}}>
                30 days free Trial
              </Text>
              <Text style={styles.redeemText}>Redeem</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
      <BottomBar />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,

    paddingTop: 15,
    alignItems: 'center',
  },
  headerContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#5ab1fc',
    borderBottomWidth: 1,
    paddingBottom: 30,
    marginBottom: 20,
  },
  userDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // justifyContent: 'space-between',
  },
  name: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    // color: '#5ab1fc',
    color: 'black',
    // textAlignVertical: 'bottom',
  },
  personButton: {
    backgroundColor: '#fff',
    // padding: 10,
    borderRadius: 50,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    elevation: 10,
    width: 47,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontFamily: 'Poppins-Regular',
    fontSize: 22,
    marginBottom: 40,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  transactionType: {
    fontFamily: 'Poppins',
    fontSize: 16,
  },
  transactionAmount: {
    fontFamily: 'Poppins-Regular',
    // marginLeft: -20,
    // textAlign: 'left',
    fontSize: 14,
  },
  rewardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  rewardItem: {
    width: 159,
    height: 168,
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  rewardItemHeading: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  rewardItemTouch: {
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  redeemText: {
    color: '#336CF9',
    fontSize: 16,
  },
})

export default TransactionHistory
