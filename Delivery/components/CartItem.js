import React from 'react'
import {TouchableOpacity, View, Text, Image, StyleSheet} from 'react-native'
import colors from '../constants/colors'

const CartItem = (props) => {
  return (
    <View style={styles.item}>
      <Image source={{uri: props.image}} style={styles.image} />
      <Text style={styles.itemTitle}>{props.title}</Text>
      <View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={props.onRemove}
            style={styles.quantityButton}
            activeOpacity={0.5}>
            <Text style={styles.quantityButtonText}>{`-`}</Text>
          </TouchableOpacity>
          <Text style={{fontSize: 18}}>{props.quantity}</Text>
          <TouchableOpacity
            onPress={props.onAdd}
            style={styles.quantityButton}
            activeOpacity={0.5}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountContainer}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
            }}>{`${props.item.price} x ${props.item.quantity}`}</Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
            }}>
            =
          </Text>
          <View>
            <Text style={{fontSize: 18, fontFamily: 'Poppins-SemiBold'}}>
              {props.item?.price * props.item?.quantity}
            </Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={{fontFamily: 'Poppins-Regular'}}>Shipping : </Text>

          <Text style={{fontFamily: 'Poppins-Regular'}}>{props?.shipping}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 6,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    paddingVertical: 10,
    // marginTop: 20,

    // borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexBasis: '25%',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  quantityButton: {
    elevation: 6,
    backgroundColor: 'white',
    padding: 5,
    width: 30,
    borderRadius: 10,
  },
  quantityButtonText: {
    fontSize: 22,
    textAlign: 'center',
  },
  amountContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
})

export default CartItem
