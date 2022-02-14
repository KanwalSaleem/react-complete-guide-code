import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';
import AuthButton from '../components/AuthButton';
import Input from '../components/Input';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Picker} from '@react-native-picker/picker';
import {Controller, useForm} from 'react-hook-form';
import Toast from 'react-native-simple-toast';
import {APIURL} from '../constants/Url';
import RNPickerSelect from 'react-native-picker-select';

const GoToCart = () => {
  const [areaName, setAreaName] = useState([]);
  const {cart, userDetails, setCart, isAuthenticated} = useContext(AuthContext);
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState();
  const addressLine1Ref = useRef();
  const addressLine2Ref = useRef();
  const additionalNotesRef = useRef();
  const [paymentType, setPaymentType] = useState('');
  const [RewardsData, setRewardsData] = useState(0);

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    reset,
  } = useForm({
    mode: 'all',
  });
  const addressLine1 = register('addressLine1');
  const addressLine2 = register('addressLine1');
  const additionalNotes = register('additionalNotes');

  const getAreas = useCallback(async () => {
    setLoading(true);

    try {
      let base_url = `${APIURL}/API/getareas.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;

      if (Success === false) {
        // throw new Error(responseData.Message);
      } else {
        const areaname = responseData.Data.map((item, index) => {
          return {
            label: item.area_name,
            value: item.area_name,
          };
        });
        setAreaName(areaname);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }, []);

  const onSubmit = async data => {
    const orderData = [];
    cart.items.forEach(rows => {
      orderData.push({
        product_id: rows.id,
        product_qty: rows.quantity,
      });
    });

    setLoading(true);

    try {
      let base_url = `${APIURL}/API/placeOrder.php`;
      let form = new FormData();
      form.append('user_id', userDetails.user_id);
      form.append('Shipping_address', data.addressLine1);
      form.append('Shipping_address_2', data.addressLine2);
      form.append('Shipping_city', data.city);

      form.append('Shipping_area', data.areaName);
      form.append('Shipping_state', data.state);
      form.append('Shipping_postal_code', data.postalCode);
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('order_datails', JSON.stringify(orderData));
      form.append('payment_type', paymentType);
      form.append('addtional_notes', data.additionalNotes);
      form.append('order_total_price', cart.totalAmount);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();

      if (responseData.status === false) {
        throw new Error(responseData.Message);
      } else {
        reset();
        setCart({items: [], totalAmount: 0});
        AsyncStorage.removeItem('cart');
        Alert.alert(responseData.Message, '', [
          {onPress: () => navigation.navigate('dashBoard')},
        ]);
        setLoading(false);
      }
    } catch (error) {
      Alert.alert(error.message);
      setLoading(false);
    }
  };

  const getRewards = useCallback(async () => {
    setLoading(true);
    setRewardsData([]);

    try {
      let base_url = `${APIURL}/API/getrewards.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('user_id', userDetails.user_id);
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;

      if (Success === false) {
        throw new Error(responseData.Message);
      } else {
        setRewardsData(parseFloat(responseData.Data.Rewards_points));
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    !isAuthenticated && navigation.navigate('authStack', {screen: 'loginForm'});
  }, [isAuthenticated, navigation]);

  useFocusEffect(
    useCallback(() => {
      reset({
        city: 'Karachi',
        state: 'Sindh',
        postalCode: '751010',
      });
      getAreas();
      getRewards();
      return () => setPaymentType('');
    }, [getAreas, getRewards, reset]),
  );

  const checkPoints = () => {
    if (RewardsData < cart.totalAmount) {
      Toast.show('Your reedem points are low', Toast.LONG);
    } else {
      setPaymentType('points');
    }
  };

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.fieldContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>Address Line 1</Text>

            <View
              style={[
                styles.fieldArea,
                errors.addressLine1 && styles.redBorder,
              ]}>
              <Input
                control={control}
                name="addressLine1"
                rules={{required: true, minLength: 3}}
                ref={e => {
                  addressLine1.ref(e);
                  addressLine1Ref.current = e;
                }}
                onSubmitEditing={() => {
                  addressLine2Ref.current.focus();
                }}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>Address Line 2</Text>

            <View
              style={[
                styles.fieldArea,
                errors.addressLine2 && styles.redBorder,
              ]}>
              <Input
                style={styles.input}
                control={control}
                name="addressLine2"
                rules={{required: true, minLength: 3}}
                ref={e => {
                  addressLine2.ref(e);
                  addressLine2Ref.current = e;
                }}
                onSubmitEditing={() => {
                  additionalNotesRef.current.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>Area</Text>

            <View
              style={[styles.fieldArea, errors.areaName && styles.redBorder]}>
              <Controller
                control={control}
                name="areaName"
                rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  // <Picker
                  //   dropdownIconColor={Colors.primary}
                  //   style={styles.picker}
                  //   selectedValue={value}
                  //   onValueChange={onChange}
                  //   mode="dropdown">
                  //   <Picker.Item
                  //     label="-- Select Area --"
                  //     value={''}
                  //     style={styles.picker}
                  //   />

                  //   {areaName.map((item, index) => {
                  //     return (
                  //       <Picker.Item
                  //         style={styles.picker}
                  //         label={item}
                  //         value={item}
                  //         key={item}
                  //       />
                  //     );
                  //   })}
                  // </Picker>
                  <RNPickerSelect
                    placeholder={{
                      label: '-- Select Area --',
                      value: null,
                      color: Colors.grey,
                    }}
                    items={areaName.map(item => {
                      if (item.value === value) {
                        return {...item, color: 'red'};
                      }
                      return item;
                    })}
                    onValueChange={onChange}
                    style={{
                      inputAndroid: styles.picker,
                      inputIOS: styles.picker,
                      viewContainer: {height: 50, justifyContent: 'center'},
                      inputIOSContainer: {
                        height: 60,
                        justifyContent: 'center',
                      },
                      inputAndroidContainer: {
                        height: 50,
                        justifyContent: 'center',
                      },
                    }}
                    value={value}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => {
                      return (
                        <Icon
                          name="expand-more"
                          size={24}
                          color={Colors.grey}
                          // style={{top: 10}}
                        />
                      );
                    }}
                  />
                )}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>City</Text>

            <View style={styles.fieldArea}>
              <Input
                style={styles.input}
                control={control}
                name="city"
                placeholder="Karachi"
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>State</Text>

            <View style={styles.fieldArea}>
              <Input
                style={styles.input}
                control={control}
                name="state"
                placeholder="Sindh"
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>Postal Code</Text>

            <View style={styles.fieldArea}>
              <Input
                style={styles.input}
                control={control}
                name="postalCode"
                placeholder="751010"
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>Additional Notes</Text>

            <View style={[styles.fieldArea, {height: 100}]}>
              <Input
                style={styles.input}
                control={control}
                name="additionalNotes"
                ref={e => {
                  additionalNotes.ref(e);
                  additionalNotesRef.current = e;
                }}
                onSubmitEditing={() => {
                  additionalNotesRef.current.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
                multiline={true}
              />
            </View>
          </View>
        </View>
        <Text style={styles.payType}>Select Payment Type</Text>
        <TouchableOpacity onPress={() => getAreas()}>
          <Text style={styles.payType}>Select</Text>
        </TouchableOpacity>

        <View style={styles.payContainer}>
          <TouchableOpacity
            onPress={() => setPaymentType('cash')}
            style={[
              styles.payButtonContainer,
              {
                backgroundColor:
                  paymentType === 'cash'
                    ? Colors.accent
                    : Colors.backgroundColor,
              },
            ]}>
            <Icon
              color={
                paymentType === 'cash' ? Colors.backgroundColor : Colors.black
              }
              name="money"
              size={30}
            />
            <Text
              style={[
                styles.buttonText,
                paymentType === 'cash' && {color: Colors.backgroundColor},
              ]}>
              Cash On Delivery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => checkPoints()}
            style={[
              styles.payButtonContainer,
              {
                backgroundColor:
                  paymentType === 'points'
                    ? Colors.accent
                    : Colors.backgroundColor,
              },
            ]}>
            <Icon
              color={
                paymentType === 'points' ? Colors.backgroundColor : Colors.black
              }
              name="redeem"
              size={30}
            />
            <Text
              style={[
                styles.buttonText,
                paymentType === 'points' && {color: Colors.backgroundColor},
              ]}>
              Pay By Reedem Points
            </Text>
          </TouchableOpacity>
        </View>
        <AuthButton
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          disabled={paymentType === '' && true}>
          Check Out Now
        </AuthButton>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  title: {
    fontSize: 26,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
  },
  fieldContainer: {
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  fieldText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    marginBottom: 5,
  },
  fieldArea: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  redBorder: {
    borderColor: Colors.accent,
  },

  button: {
    marginVertical: 20,
    backgroundColor: Colors.accent,
  },
  payContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  payButtonContainer: {
    width: '50%',
    height: 50,
    alignItems: 'center',

    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  payType: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
  },
  buttonText: {
    width: '70%',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    paddingLeft: 5,
  },
  picker: {
    color: Colors.grey,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
});

export default GoToCart;
