import React, {forwardRef, useContext, useState} from 'react'
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import {useController} from 'react-hook-form'
import Colors from '../constants/Colors'
import fonts from '../constants/fonts'
import AuthButton from '../components/AuthButton'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CartComp from '../components/cartComp'
import {AuthContext} from '../context/Auth'

const Cart = (props) => {
  const {route, navigation} = props
  const {cart, setCart} = useContext(AuthContext)

  return (
    <ScrollView contentContainerStyle={styles.screen} style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <CartComp
          cartValue={cart}
          onSubtract={() => {
            setCart((prev) => prev - 1000)
          }}
          onAdd={() => {
            setCart((prev) => prev + 1000)
          }}
          onDelete={async () => {
            await setCart(1000)
            navigation.goBack()
          }}
        />
        <View>
          <Text style={styles.title} allowFontScaling={false}>
            Cart totals
          </Text>
          <Text style={styles.subTitle} allowFontScaling={false}>
            SUBTOTAL
          </Text>
          <Text style={styles.price} allowFontScaling={false}>
            ₦{cart}
          </Text>
          <Text style={styles.subTitle} allowFontScaling={false}>
            TOTAL
          </Text>
          <Text style={styles.price} allowFontScaling={false}>
            ₦{cart}
          </Text>
        </View>
      </View>

      <AuthButton
        disabled={cart <= 0}
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('payment', {amount: cart})}>
        Proceed to checkout
      </AuthButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mainContainer: {
    // marginTop: 30,
    flex: 1,
    // marginHorizontal: 20,
  },

  buttonContainer: {
    alignSelf: 'center',
    // position: 'absolute',
    bottom: 0,
    marginBottom: 40,
  },
  cartContainer: {
    marginTop: 30,
    flexDirection: 'row',
    // width: '40%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 24,
    color: '#000000',
    fontFamily: 'Inter-Bold',
  },
  subTitle: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Bold',
  },
  price: {
    // marginTop: 20,
    fontSize: 24,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
    marginBottom: 10,
  },
})

export default Cart
