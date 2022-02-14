import React, {useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';
import AuthButton from '../components/AuthButton';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/Auth';
import ProductComp from '../components/ProductComp';

const Cart = () => {
  const {cart, RemoveProduct, isAuthenticated} = useContext(AuthContext);
  const navigation = useNavigation();

  return cart.totalAmount == 0 ? (
    <View style={styles.cartEmpty}>
      <View style={styles.emptyCartContainer}>
        <Icon color={Colors.black} name="shopping-cart" size={160} />
        <Text>Your Cart is empty!</Text>
      </View>
      <AuthButton
        onPress={() => navigation.navigate('dashBoard')}
        style={styles.button}>
        Shop Now
      </AuthButton>
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={styles.productTitleContainer}>
        <Text style={styles.productTitle}>FRESH VEGETABLES</Text>
      </View>
      <View style={styles.productConatiner}>
        <FlatList
          data={cart.items}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => {
            return (
              <View style={styles.productInnerContainer}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => RemoveProduct(item)}
                  style={styles.iconContainer}>
                  <Icon name="close" size={25} color={Colors.black} />
                </TouchableOpacity>
                <ProductComp {...item} />
              </View>
            );
          }}
        />
      </View>
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.itemTitle}>Items: {cart.items.length}</Text>
          <Text style={styles.itemTitle}>Total: {cart.totalAmount}</Text>
        </View>
        <AuthButton
          style={styles.button}
          onPress={() =>
            isAuthenticated
              ? navigation.navigate('goToCart')
              : navigation.navigate('authStack', {screen: 'loginForm'})
          }>
          Checkout
        </AuthButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  emptyCartContainer: {
    alignItems: 'center',
  },
  cartEmpty: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  productTitleContainer: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingLeft: 10,
  },
  productTitle: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: Colors.backgroundColor,
  },
  iconContainer: {
    width: '6%',
    alignItems: 'center',
  },
  productConatiner: {
    paddingHorizontal: 10,
    paddingBottom: 60,
    marginVertical: 20,
    height: '85%',
  },

  button: {
    marginVertical: 20,
    backgroundColor: Colors.secondary,
  },
  bottomBar: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  totalContainer: {
    marginHorizontal: 15,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
});

export default Cart;
