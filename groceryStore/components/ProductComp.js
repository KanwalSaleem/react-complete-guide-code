import React, {useState, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/Auth';
import {APIURL} from '../constants/Url';
import Toast from 'react-native-simple-toast';

const ProductComp = props => {
  const {AddCart, RemoveCart, cart} = useContext(AuthContext);
  const [productData, setProductData] = useState(props);

  useFocusEffect(
    useCallback(() => {
      cart.items.map(item => {
        if (item.id === props.id) {
          setProductData(item);
        }
      });
    }, [cart.items, props.id]),
  );
  const AddProduct = () => {
    productData.quantity == productData.qty &&
      Toast.show(`Quantity available is ${productData.qty}`, Toast.LONG);
    productData.quantity < productData.qty && AddCart(productData);
  };

  const RemoveProduct = () => {
    RemoveCart(productData);

    cart.items.map(item => {
      if (item.id === props.id) {
        item.quantity === 1 && setProductData(props);
      }
    });
  };

  return (
    <View style={{...styles.productInnerContainer, ...props.style}}>
      <Image
        source={{
          uri: `${APIURL}/admin_panel/Uploads/${productData.image}`,
        }}
        style={styles.image}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productText}>{productData.name}</Text>

        <Text style={styles.descriptionText}>{productData.description}</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.discountAmount}>{productData.price}</Text>
          <Text style={styles.actualPrice}>{productData.actualPrice}</Text>
          <Text style={styles.discount}>{productData.discount}</Text>
        </View>
        <Text style={styles.productText}>Total: {productData.sum}</Text>
      </View>
      <View style={styles.cartContainer}>
        <TouchableOpacity
          style={styles.cart}
          activeOpacity={0.6}
          onPress={() => RemoveProduct()}>
          <Icon color={Colors.backgroundColor} name="remove" size={25} />
        </TouchableOpacity>

        <Text style={styles.cartText}>{productData.quantity}</Text>

        <TouchableOpacity
          style={styles.cart}
          activeOpacity={0.6}
          onPress={() => AddProduct()}>
          <Icon color={Colors.backgroundColor} name="add" size={25} />
        </TouchableOpacity>
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
    marginLeft: 10,
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
});

export default ProductComp;
