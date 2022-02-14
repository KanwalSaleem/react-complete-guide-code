import React from 'react'
import Header from '../components/Header'
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native'
import BottomBar from '../components/BottomBar'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialIcons'

const PaymentSuccess = () => {
  const window = useWindowDimensions()
  return (
    <>
      <Header />
      <View style={styles.screen}>
        <View style={styles.userContainer}>
          <Image
            style={styles.image}
            source={require('../assets/profile.jpg')}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>Teja Puri</Text>
            <Text style={styles.phoneNumber}>+9187725777</Text>
            <Text style={styles.email}>TejaP@gmail.com</Text>
            <Text style={styles.address}>Mumbai India</Text>
          </View>
        </View>
        <View style={{marginTop: 25}}>
          <TouchableOpacity>
            <LinearGradient
              colors={['#336CF9', '#1BE6D6']}
              style={styles.statusView}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Icon name="done" color="white" size={40} />
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.paymentText}>₹500</Text>
          <Text style={styles.paymentText}>Paid Succesfully</Text>
        </View>
        <View style={styles.checkView}>
          <Text style={styles.checkViewText}>Check your Delivery Pay</Text>
        </View>
      </View>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  userContainer: {
    flexDirection: 'row',
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  detailsContainer: {
    paddingLeft: 10,
  },
  name: {
    fontSize: 15,
    color: '#2A2A2A',
    fontFamily: 'Poppins-Regular',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#2A2A2A',
    fontFamily: 'Poppins-Regular',
  },
  email: {
    fontSize: 14,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
  },
  address: {
    fontSize: 14,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
  },

  statusView: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentText: {
    marginTop: 10,
    fontSize: 22,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
  },
  checkView: {
    marginTop: 25,
    width: '85%',
    height: '25%',
    backgroundColor: '#F9EAF4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  checkViewText: {
    fontSize: 24,
    color: '#336CF9',
    fontFamily: 'Poppins-Regular',
  },
})

export default PaymentSuccess
