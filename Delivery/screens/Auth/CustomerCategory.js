import React, {useContext} from 'react'
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'

import AuthButton from '../../components/AuthButton'
import {AppContext} from '../../context/auth'

import Colors from '../../constants/colors'

const CustomerCategory = (props) => {
  const {changeUserType} = useContext(AppContext)
  const goToLogin = (type) => {
    changeUserType(type)
    props.navigation.navigate('login')
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.blueBackground}>
        <Text style={styles.mainHeading}>Delivery Pay</Text>
        <Image
          source={require('../../assets/customerPageImage.png')}
          style={{marginTop: 20}}
        />
      </View>
      <View style={styles.whiteBackground}>
        <Text style={styles.secondHeading}>Never Pay Without Using</Text>
        <Text style={styles.secondHeading}>Deliver Pay</Text>
        <AuthButton
          style={{marginTop: 30}}
          authButton={{width: 250}}
          authButtonText={{fontSize: 16}}
          onPress={goToLogin.bind(this, 'buyer')}>
          I am a Buyer
        </AuthButton>
        <TouchableOpacity
          style={styles.sellerButton}
          activeOpacity={0.6}
          onPress={goToLogin.bind(this, 'seller')}>
          <Text style={styles.sellerButtonText}>I am a Seller</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  blueBackground: {
    backgroundColor: Colors.lightBlue,
    height: '45%',
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 58,
    fontFamily: 'SourceSerifPro-BoldItalic',
    marginTop: 30,
  },
  whiteBackground: {
    alignItems: 'center',
    paddingTop: 30,
    marginTop: -20,
    backgroundColor: 'white',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    flex: 1,
  },
  secondHeading: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: 'bold',
    marginTop: 20,
  },
  sellerButton: {
    padding: 10,
    // width: '70%',
    alignSelf: 'center',
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 40,
    borderWidth: 3,
    width: 250,
    borderColor: '#338ad5',
  },
  sellerButtonText: {
    color: '#338ad5',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlignVertical: 'center',
  },
})

export default CustomerCategory
