import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import Colors from '../constants/Colors';
import {APIURL} from '../constants/Url';

const ProductOrders = props => {
  const sum = (parseInt(props.qty) * parseFloat(props.price)).toFixed(2);

  return (
    <View style={{...styles.productInnerContainer, ...props.style}}>
      <Image
        source={{
          uri: `${APIURL}/admin_panel/Uploads/${props.img}`,
        }}
        style={styles.image}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productText}>{props.name}</Text>
        <Text style={styles.productText}>{props.description}</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.discountAmount}>
            {parseFloat(props.price).toFixed(2)}
          </Text>
        </View>
        <Text style={styles.productText}>Total: {sum}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityTitle}>Quantity</Text>
        <Text style={styles.quantityText}>{props.qty}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productInnerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: '32%',
    height: 120,
    alignSelf: 'center',
  },
  productDetails: {
    marginLeft: 20,
    width: '35%',
  },
  productText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  actualPrice: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
  amountContainer: {
    marginVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountAmount: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: Colors.accent,
    marginRight: 3,
  },

  discount: {
    marginLeft: 5,
    backgroundColor: Colors.accent,
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: Colors.backgroundColor,
    padding: 2,
  },
  cartContainer: {
    marginLeft: 5,
    flexDirection: 'row',
    width: '40%',
  },
  cart: {
    backgroundColor: Colors.secondary,
    width: '20%',
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  cartText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: Colors.grey,
  },
  button: {
    marginVertical: 20,
    backgroundColor: Colors.accent,
  },
  quantityContainer: {
    width: '20%',
    marginLeft: 20,
    alignItems: 'center',
  },
  quantityTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    marginBottom: 5,
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: Colors.grey,
    textAlign: 'center',
  },
});

export default ProductOrders;
