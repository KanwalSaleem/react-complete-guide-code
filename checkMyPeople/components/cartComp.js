import React, {forwardRef} from 'react'
import {TextInput, StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import {useController} from 'react-hook-form'
import Colors from '../constants/Colors'
import fonts from '../constants/fonts'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Card from './Card'

const CartComp = (props) => {
  return (
    <Card style={styles.container}>
      <TouchableOpacity
        style={{alignSelf: 'flex-end'}}
        activeOpacity={0.6}
        onPress={props.onDelete}>
        <Text style={styles.delete} allowFontScaling={false}>
          Delete
        </Text>
      </TouchableOpacity>
      <Text style={styles.title} allowFontScaling={false}>
        Load Account Balance
      </Text>
      <Text
        style={styles.price}
        allowFontScaling={false}>{`₦${props.cartValue}`}</Text>
      <View style={styles.cartContainer}>
        <TouchableOpacity
          style={styles.iconConatiner}
          activeOpacity={0.7}
          onPress={props.onSubtract}
          disabled={props.cartValue <= 1000}>
          <Icon name="remove" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.cartValue} allowFontScaling={false}>
          {props.cartValue}
        </Text>
        <TouchableOpacity
          style={styles.iconConatiner}
          activeOpacity={0.7}
          onPress={props.onAdd}>
          <Icon name="add" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'Inter-Bold',
  },
  delete: {
    color: Colors.primary,
    fontSize: 18,
  },

  price: {
    marginTop: 20,
    fontSize: 24,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
  },

  cartContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.background,
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
  },
})

export default CartComp
