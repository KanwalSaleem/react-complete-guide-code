import React from 'react'
import Header from '../components/Header'
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import BottomBar from '../components/BottomBar'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useForm, Controller} from 'react-hook-form'
import Input from '../components/Input'
import {Picker} from '@react-native-picker/picker'

const PaymentDetails = () => {
  const {control} = useForm({})
  const window = useWindowDimensions()

  return (
    <>
      {/* <KeyboardAvoidingView> */}
      <Header />

      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.userContainer}>
          <Image
            style={styles.image}
            source={require('../assets/profile.jpg')}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>Teja Puri</Text>
            <Text style={styles.phoneNumber}>+9187725777</Text>
            <Text style={styles.email}>TejaP@gmail.com</Text>
            <Text style={styles.address}>Mumbai India</Text>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.payTitle}>Payment Details</Text>
          <View style={styles.fieldView}>
            <Text style={styles.fieldTitle}>Type of Transaction</Text>
            <Controller
              control={control}
              name="transactionType"
              defaultValue={'Product'}
              render={({field: {value, onChange}}) => (
                <View>
                  <Picker
                    dropdownIconColor={'#2699FB'}
                    selectedValue={value}
                    onValueChange={onChange}
                    mode="dropdown">
                    <Picker.Item
                      label="Product"
                      value="product"
                      style={styles.fieldText}
                    />
                    <Picker.Item
                      label="etc"
                      value="etc"
                      style={styles.fieldText}
                    />
                    <Picker.Item
                      label="etc"
                      value="etc"
                      style={styles.fieldText}
                    />
                  </Picker>
                </View>
              )}
            />
          </View>
          <View style={styles.fieldView}>
            <Text style={styles.fieldTitle}>Amount</Text>
            <Controller
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  style={styles.fieldText}
                  placeholder="2000/-"
                  placeholderTextColor={'#0D0E0F'}
                />
              )}
            />
          </View>
          <View style={styles.fieldView}>
            <Text style={styles.fieldTitle}>Product Details</Text>
            <Controller
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  style={styles.fieldText}
                  placeholder=""
                  placeholderTextColor={'#0D0E0F'}
                />
              )}
            />
          </View>
        </View>
        <View
          style={[
            styles.fieldContainer,
            {flexDirection: 'row', justifyContent: 'space-between'},
          ]}>
          <View style={styles.addAddressContainer}>
            <Text style={styles.addressTitle}>Delivery Address</Text>
            <View style={styles.innerView}>
              <Icon name="add" color="#707070" size={30} />
              <Text style={styles.addEditText}>Add / Edit Address</Text>
            </View>
          </View>
          <View style={styles.addAddressContainer}>
            <Text style={styles.nameText}>Swati Mishra</Text>
            <Text style={styles.phoneNoText}>+9187725777</Text>
            <Text style={styles.emailText}>TejaP@gmail.com</Text>
            <Text style={styles.emailText}>
              Mumbai Steet no 147713372 Mumbai India
            </Text>
          </View>
        </View>

        <TouchableOpacity style={{marginTop: 20}}>
          <LinearGradient
            colors={['#336CF9', '#1BE6D6']}
            style={styles.payView}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <Text style={styles.payText}>Pay</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* </KeyboardAvoidingView> */}
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  userContainer: {
    flexDirection: 'row',
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  detailsContainer: {
    paddingLeft: 10,
  },
  name: {
    fontSize: 15,
    color: '#2A2A2A',
    fontFamily: 'Poppins-Regular',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#2A2A2A',
    fontFamily: 'Poppins-Regular',
  },
  email: {
    fontSize: 14,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
  },
  address: {
    fontSize: 14,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
  },

  payView: {
    width: 150,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
  },
  payText: {
    marginTop: 10,
    fontSize: 21,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
  },
  fieldContainer: {
    marginTop: 40,
    width: '90%',
    backgroundColor: '#F9EAF4',
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  payTitle: {
    fontSize: 29,
    color: '#0D0E0F',
    fontFamily: 'Poppins-Regular',
  },
  fieldView: {
    marginTop: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2699FB',
  },
  fieldTitle: {
    fontSize: 18,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
  },
  fieldText: {
    fontSize: 23,
    color: '#0D0E0F',
    fontFamily: 'Poppins-Regular',
    marginTop: 10,
  },
  addAddressContainer: {
    width: '50%',
    paddingHorizontal: 5,
  },
  addressTitle: {
    fontSize: 20,
    color: '#0D0E0F',
    fontFamily: 'Poppins-Regular',
  },
  innerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addEditText: {
    fontSize: 16,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
    // textAlign: 'center',
  },
  nameText: {
    color: '#707070',
    fontFamily: 'Poppins-Regular',
  },
  phoneNoText: {
    paddingTop: 5,
    fontSize: 14,
    color: '#2A2A2A',
    fontFamily: 'Poppins-Regular',
  },
  emailText: {
    paddingTop: 5,
    fontSize: 14,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
  },
})

export default PaymentDetails
