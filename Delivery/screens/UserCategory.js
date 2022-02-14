import React, {useContext} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import {RadioButton} from 'react-native-paper'
import Header from '../components/Header'
import BottomBar from '../components/BottomBar'
import LinearGradient from 'react-native-linear-gradient'
import {AppContext} from '../context/auth'

const UserCategory = (props) => {
  const {changeUserType, userType} = useContext(AppContext)

  const changeToSeller = () => changeUserType('seller')
  const changeToBuyer = () => changeUserType('buyer')

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.heading}>Start transcations with</Text>
        <Text style={styles.heading}>Delivery Pay</Text>
        <Text style={styles.secondHeading}>
          Let us help you make the safest transaction
        </Text>
        <View style={styles.imageView}>
          <Image source={require('../assets/buyer.png')} style={styles.image} />
          <TouchableOpacity
            style={styles.customerTypeOption}
            activeOpacity={0.7}
            onPress={changeToBuyer}>
            <Text style={styles.userText}>I am a Buyer</Text>
            <RadioButton
              value="buyer"
              status={userType === 'buyer' ? 'checked' : 'unchecked'}
              onPress={changeToBuyer}
              color="#2699fb"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.imageView}>
          <Image
            source={require('../assets/seller.png')}
            style={styles.image}
          />
          <TouchableOpacity
            style={styles.customerTypeOption}
            activeOpacity={0.7}
            onPress={changeToSeller}>
            <Text style={styles.userText}>I am a Seller</Text>
            <RadioButton
              value="seller"
              status={userType === 'seller' ? 'checked' : 'unchecked'}
              onPress={changeToSeller}
              color="#2699fb"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={userType === ''}
          style={{width: 171, marginVertical: 20}}
          activeOpacity={0.6}
          onPress={() =>
            props.navigation.navigate(
              userType === 'buyer' ? 'home/buying' : 'home/selling',
            )
          }>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#336CF9', '#1BE6D6']}
            style={{
              borderRadius: 20,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.callToActionText}>
              Start {userType === 'buyer' ? 'Buying' : 'Selling'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.transactionView}
          activeOpacity={0.4}
          onPress={() => props.navigation.navigate('holeTransaction')}>
          <Text
            style={{
              fontFamily: 'Poppins Regular',
              fontSize: 18,
            }}>
            See All Transactions
          </Text>
          <Image
            source={require('../assets/nextpayment.png')}
            style={{width: 21, height: 21}}
          />
        </TouchableOpacity>
      </ScrollView>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  heading: {
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 25,
    marginTop: 15,
  },
  secondHeading: {
    fontFamily: 'Poppins-Light',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  imageView: {
    flexDirection: 'row',
    marginTop: 20,
  },
  customerTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9EAF4',
    borderRadius: 30,
    justifyContent: 'space-between',
    height: 97,
    // width: 205,
    width: '52%',
    paddingHorizontal: 20,
  },
  userText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  image: {
    width: 97,
    height: 66,
    marginRight: -10,
    zIndex: 1,
  },
  callToActionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#fff',
  },
  transactionView: {
    marginBottom: 15,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
})

export default UserCategory
