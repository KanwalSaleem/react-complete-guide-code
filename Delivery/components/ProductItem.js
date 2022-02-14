import React from 'react'
import {TouchableOpacity, Text, Image, StyleSheet, View} from 'react-native'
import colors from '../constants/colors'

const ProductItem = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onPress}
      style={styles.card}>
      <Image source={{uri: props.uri}} style={styles.image} />
      <Text style={styles.name}>{props.name}</Text>
      <Text style={styles.price}>₹{props.price}</Text>
      <TouchableOpacity style={styles.cartButton} onPress={props.onCartPress}>
        <Text style={styles.cardButtonText}>Add To Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    paddingVertical: 20,
    marginVertical: 20,
  },
  image: {
    width: '90%',
    height: 190,
    borderRadius: 10,
  },
  cartButton: {
    backgroundColor: colors.purple,
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 30,
  },
  cardButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
  name: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
  },
  price: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
  },
})

export default ProductItem
