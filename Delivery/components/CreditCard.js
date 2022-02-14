import React from 'react'
import {Image, View, Text, StyleSheet} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const CreditCard = (props) => {
  return (
    <LinearGradient
      colors={['#53AEFC', '#1BE6D6']}
      style={styles.card}
      end={{x: 1, y: 1.9}}>
      <View style={styles.cardCompany}>
        {props.bankName ? (
          <Image source={require('../assets/visa.png')} />
        ) : (
          <Text style={styles.bankName}>
            {props.bank &&
              `${props.bank.charAt(0).toUpperCase()}${props.bank.slice(1)}`}
          </Text>
        )}
      </View>
      <View style={styles.cardTextContainer}>
        {props.name ? (
          <Text style={styles.cardNumber}>{props.name}</Text>
        ) : (
          <Text style={styles.cardNumber}>XXXX XXXX XXXX 0695</Text>
        )}
        {props.type ? (
          <Text style={styles.cardHolder}>{props.type}</Text>
        ) : (
          <Text style={styles.cardHolder}>Teja Pujari 06/21</Text>
        )}
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  card: {
    height: 171,
    borderRadius: 20,
    width: 265,
    paddingHorizontal: 30,
    paddingLeft: 50,
    alignItems: 'flex-start',
    elevation: 5,
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
  },
  cardCompany: {
    marginLeft: -10,
    marginBottom: 20,
  },
  cardNumber: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  cardHolder: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
  },
  bankName: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
  },
})

export default CreditCard
