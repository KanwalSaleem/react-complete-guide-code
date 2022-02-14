import React, {useState, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import Colors from '../constants/Colors';
import {useFocusEffect} from '@react-navigation/native';
import ProductOrders from '../components/ProductOrders';
import {APIURL} from '../constants/Url';

const MyOrderDetails = ({route, navigation}) => {
  const {orderId} = route.params;

  const [isLoading, setLoading] = useState(false);
  const [OrderData, setOrderData] = useState([]);
  const [cost, setCost] = useState('');

  const getOrders = useCallback(async () => {
    setCost('');
    setOrderData([]);
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/getorderdetails.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      form.append('order_id', orderId);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;

      if (Success === false) {
        throw new Error(responseData.message);
      } else {
        setOrderData(responseData.Data);
        setCost(responseData);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }, [orderId]);

  useFocusEffect(
    useCallback(() => {
      getOrders();
    }, [getOrders]),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={styles.productConatiner}>
        <FlatList
          data={OrderData}
          keyExtractor={(item, index) => item.product_id}
          renderItem={({item}) => {
            return (
              <View style={styles.productInnerContainer}>
                <ProductOrders {...item} />
              </View>
            );
          }}
        />
      </View>
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.itemTitle}>
            Shippment Cost:{' '}
            <Text style={styles.itemText}>
              {parseFloat(cost.Shipping_Cost).toFixed(2)}
            </Text>
          </Text>
          <Text style={styles.itemTitle}>
            Sub Total:{' '}
            <Text style={styles.itemText}>
              {' '}
              {(
                parseFloat(cost.Shipping_Cost) + parseFloat(cost.total)
              ).toFixed(2)}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },

  productConatiner: {
    marginTop: 30,
    marginHorizontal: 10,
    height: '86%',
    marginVertical: 20,
  },
  bottomBar: {
    bottom: 40,
    width: '100%',
    paddingHorizontal: 5,
  },
  totalContainer: {
    marginHorizontal: 5,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
  },
});

export default MyOrderDetails;
