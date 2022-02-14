import React, {useState, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/Colors';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/Auth';
import {Card} from 'react-native-paper';
import {APIURL} from '../constants/Url';
import {color} from 'react-native-reanimated';

const MyOrders = () => {
  const {userDetails, isAuthenticated} = useContext(AuthContext);
  const [pending, setPending] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);

  const OrderComp = props => {
    return (
      <View style={styles.productConatiner}>
        <FlatList
          data={props.data}
          keyExtractor={(item, index) => item.order_id}
          renderItem={({item}) => {
            return (
              <View style={styles.productInnerContainer}>
                <Card style={styles.orderContainer}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() =>
                      navigation.navigate('myOrderDetails', {
                        orderId: item.order_id,
                      })
                    }
                    style={styles.orderInnerContainer}>
                    <Text style={styles.orderTitle}>
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </Text>
                    <View style={styles.addressContainer}>
                      <Text style={styles.orderAddress}>
                        <Text style={styles.addressTitle}>
                          Address: {} {}
                        </Text>
                        {item.address}
                      </Text>
                    </View>
                    <View style={styles.priceContainer}>
                      <View
                        style={[
                          styles.priceInnerContainer,
                          {
                            borderRightWidth: 2,
                            borderRightColor: 'black',
                          },
                        ]}>
                        <Text style={styles.addressTitle}>Amount</Text>
                        <Text style={styles.orderAddress}>
                          {item.order_total_price}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.priceInnerContainer,
                          {
                            borderRightWidth: 2,
                            borderRightColor: 'black',
                          },
                        ]}>
                        <Text style={styles.addressTitle}>Shipping Cost</Text>
                        <Text style={styles.orderAddress}>
                          {parseFloat(item.Shipping_Cost).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.priceInnerContainer}>
                        <Text style={styles.addressTitle}>Sub Total</Text>
                        <Text style={styles.orderAddress}>
                          {(
                            parseFloat(item.order_total_price) +
                            parseFloat(item.Shipping_Cost)
                          ).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Card>
              </View>
            );
          }}
        />
      </View>
    );
  };

  const getPendingOrders = useCallback(async () => {
    setPendingOrders([]);
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/getOrdersStatus.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      form.append('user_id', userDetails.user_id);
      form.append('status', 'current_orders');
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
        setPendingOrders(responseData.Data);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }, [userDetails.user_id]);

  const getPastOrders = useCallback(async () => {
    setPastOrders([]);
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/getOrdersStatus.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      form.append('user_id', userDetails.user_id);
      form.append('status', 'past_orders');
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
        setPastOrders(responseData.Data);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }, [userDetails.user_id]);

  useFocusEffect(
    useCallback(() => {
      !isAuthenticated
        ? navigation.navigate('authStack', {screen: 'loginForm'})
        : getPendingOrders(),
        getPastOrders();

      setPending(true);
    }, [getPastOrders, getPendingOrders, isAuthenticated, navigation]),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={styles.productTitleContainer}>
        <View style={styles.mainContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setPending(true)}
            style={styles.innerContainer}>
            <Text style={[styles.productTitle, pending && styles.bottomBorder]}>
              PENDING
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setPending(false)}
            style={styles.innerContainer}>
            <View>
              <Text
                style={[styles.productTitle, !pending && styles.bottomBorder]}>
                PAST ORDER
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {pending === true ? (
        <OrderComp data={pendingOrders} />
      ) : (
        <OrderComp data={pastOrders} />
      )}
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
  productTitleContainer: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingLeft: 10,
  },

  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  productTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: Colors.backgroundColor,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  bottomBorder: {
    borderBottomWidth: 4,
    borderColor: Colors.backgroundColor,
  },

  productConatiner: {
    marginTop: 30,
    // paddingHorizontal: 10,
    height: '88%',
    marginVertical: 20,
  },
  orderContainer: {
    // margin: 10,
    padding: 10,
  },
  orderTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 5,
  },
  orderInnerContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  addressContainer: {},
  addressTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
    color: Colors.accent,
  },
  priceContainer: {
    marginTop: 10,
    flexDirection: 'row',
    // alignItems: 'center',
  },
  priceInnerContainer: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderAddress: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
  productInnerContainer: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
});

export default MyOrders;
