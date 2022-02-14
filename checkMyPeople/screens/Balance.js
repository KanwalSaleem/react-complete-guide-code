import React, {forwardRef, useState, useContext} from 'react'
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native'

import Colors from '../constants/Colors'

import AuthButton from '../components/AuthButton'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Card from '../components/Card'
import {AuthContext} from '../context/Auth'

const Balance = (props) => {
  // const [amount, setAmount] = useState(1000)
  const {cart, setCart} = useContext(AuthContext)

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Card style={styles.mainContainer}>
        <Text style={styles.title} allowFontScaling={false}>
          Load Account Balance
        </Text>
        <Text style={styles.price} allowFontScaling={false}>{`₦${cart}`}</Text>
        <View style={styles.cartContainer}>
          <TouchableOpacity
            style={styles.iconConatiner}
            activeOpacity={0.7}
            disabled={cart <= 1000}
            onPress={() => setCart((prev) => parseInt(prev - 1000))}>
            <Icon name="remove" size={22} color="white" />
          </TouchableOpacity>
          <Text
            style={styles.cartValue}
            // keyboardType={'number-pad'}
            // allowFontScaling={false}
            // value={String(cart)}
            // onChangeText={(text) => {
            //   if (text.length === 0) {
            //     setCart(0)
            //   }
            //   if (text.length > 0) {
            //     setCart(parseInt(text))
            //   }
            // }}
          >
            {cart}
          </Text>
          <TouchableOpacity
            style={styles.iconConatiner}
            activeOpacity={0.7}
            onPress={() => setCart((prev) => parseInt(prev + 1000))}>
            <Icon name="add" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </Card>

      <AuthButton
        disabled={cart <= 0}
        style={styles.buttonContainer}
        onPress={() =>
          props.navigation.navigate('cart', {
            amount: cart,
          })
        }>
        Add to cart
      </AuthButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingTop: 30,
    paddingHorizontal: 10,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  mainContainer: {
    padding: 20,
    paddingVertical: 40,
    marginBottom: 10,
  },

  buttonContainer: {
    alignSelf: 'center',
    // position: 'absolute',
    bottom: 0,
    // marginBottom: 40,
  },
  cartContainer: {
    marginTop: 40,
    flexDirection: 'row',
    // width: '40%',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#000000',
    fontFamily: 'Inter-Bold',
  },
  price: {
    marginTop: 30,
    fontSize: 24,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
  },

  iconConatiner: {
    backgroundColor: '#46A861',
    width: 37,
    height: 37,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
  },
  cartValue: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'black',
    marginHorizontal: 10,
    textAlign: 'center',
  },
})

export default Balance
