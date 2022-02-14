import React, {useRef, useState, useEffect, useCallback} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native'
import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Input from '../components/Input'
import {useForm} from 'react-hook-form'
import AuthButton from '../components/AuthButton'
import {useSelector} from 'react-redux'

const ManageBankAccount = () => {
  const token = useSelector((state) => state.auth.token)
  const [isLoading, setLoading] = useState(false)
  const [bankData, setBankData] = useState(false)
  const [addAccount, setAddAccount] = useState(false)
  const holderNameRef = useRef()
  const accountNoRef = useRef()
  const routingNoRef = useRef()
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: {errors},
  } = useForm({
    mode: 'all',
  })

  const holderName = register('holderName')
  const accountNo = register('accountNo')
  const routingNo = register('routingNo')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      let base_url = 'http://fabent.co.in/public/api/care-giver/add-bank'

      const headers = new Headers()
      headers.append('Authorization', `Bearer ${token}`)
      // eslint-disable-next-line no-undef
      let uploadData = new FormData()

      uploadData.append('ac_holder', data.holderName)
      uploadData.append('ac_number', data.accountNo)
      uploadData.append('ac_routing', data.routingNo)

      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
        headers,
      })

      const responseData = await response.json()
      if (responseData.success === true) {
        Alert.alert(responseData.message)
        getBankData()
        reset()
      }
    } catch (error) {
      Alert.alert(error.message)
    }
    setLoading(false)
  }

  const deleteBank = async (id) => {
    setLoading(true)
    try {
      let base_url = 'http://fabent.co.in/public/api/care-giver/remove-bank'

      const headers = new Headers()
      headers.append('Authorization', `Bearer ${token}`)
      // eslint-disable-next-line no-undef
      let uploadData = new FormData()

      uploadData.append('bank_id', id)

      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
        headers,
      })

      const responseData = await response.json()
      if (responseData.success === true) {
        Alert.alert(responseData.message)
        getBankData()
      }
    } catch (error) {
      Alert.alert(error.message)
    }
    setLoading(false)
  }

  const getBankData = useCallback(async () => {
    setLoading(true)
    try {
      let base_url = 'http://fabent.co.in/public/api/care-giver/get-banks'

      const headers = new Headers()
      headers.append('Authorization', `Bearer ${token}`)
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',

        headers,
      })

      const responseData = await response.json()

      console.log(responseData)
      if (responseData.success === true) {
        setBankData(responseData.data)
      }
    } catch (error) {
      Alert.alert(error.message)
      getBankData()
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    getBankData()
  }, [getBankData])

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.red} />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={30}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.mainScreen}>
        <View>
          <View style={styles.whiteContainer}>
            {bankData && (
              <View
                style={[
                  styles.accountDetails,
                  bankData.length > 5 && {height: '40%'},
                ]}>
                <FlatList
                  data={bankData}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({item}) => {
                    return (
                      <View style={[styles.fieldView, styles.itemContainer]}>
                        <View>
                          <Text style={styles.name}>{item.ac_number}</Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteBank(item.id)}>
                          <Icon name="delete" size={20} color="#000000" />
                        </TouchableOpacity>
                      </View>
                    )
                  }}
                />
              </View>
            )}
            <TouchableOpacity
              style={styles.titleContainer}
              onPress={() => setAddAccount(true)}>
              <View style={styles.IconContainer}>
                <Icon name="add" color="white" size={12} />
              </View>
              <Text style={styles.title}>Add More Bank</Text>
            </TouchableOpacity>
            {/* {addAccount && ( */}
            <ScrollView contentContainerStyle={styles.fieldContainer}>
              <Text style={styles.fieldTitle}>Add Banking Information </Text>
              <View style={styles.fieldView}>
                <Input
                  control={control}
                  name="holderName"
                  rules={{
                    required: true,
                    pattern: {
                      value: /^([\w]{3,})+\s+([\w\s]{3,})+$/i,
                      message: 'Enter you Full Name with spaces',
                    },
                  }}
                  autoCapitalize="characters"
                  placeholder="Account Holder Name"
                  ref={(e) => {
                    holderName.ref(e)
                    holderNameRef.current = e
                  }}
                  onSubmitEditing={() => {
                    accountNoRef.current.focus()
                  }}
                  blurOnSubmit={false}
                  returnKeyType="next"
                  placeholderTextColor="black"
                  style={styles.textInput}
                />
              </View>
              {errors.holderName && (
                <Text style={styles.errorText}>
                  {errors.holderName.message}
                </Text>
              )}
              <View style={styles.fieldView}>
                <Input
                  control={control}
                  name="accountNo"
                  rules={{
                    pattern: {
                      value: /^[0-9]*$/,
                      message:
                        'Enter a 6 digits minimum or 16 digits maximum Number ',
                    },
                    //   required: {value: false, message: 'Enter a 16 digit number'},
                    type: 'number',
                    minLength: 6,
                    maxLength: 16,
                  }}
                  maxLength={16}
                  placeholder="Bank Account Number"
                  ref={(e) => {
                    accountNo.ref(e)
                    accountNoRef.current = e
                  }}
                  keyboardType="number-pad"
                  onSubmitEditing={() => {
                    routingNoRef.current.focus()
                  }}
                  blurOnSubmit={false}
                  returnKeyType="next"
                  placeholderTextColor="black"
                  style={styles.textInput}
                />
              </View>

              {errors.accountNo && (
                <Text style={styles.errorText}>
                  {'Enter 6 minimum digits!'}
                </Text>
              )}

              <View style={styles.fieldView}>
                <Input
                  control={control}
                  name="routingNo"
                  rules={{
                    required: true,
                    type: 'number',
                    minLength: 5,
                    //   maxLength: 30,
                  }}
                  // maxLength={30}
                  placeholder="Bank Routing Number"
                  ref={(e) => {
                    routingNo.ref(e)
                    routingNoRef.current = e
                  }}
                  keyboardType="number-pad"
                  onSubmitEditing={() => {
                    routingNoRef.current.blur()
                  }}
                  returnKeyType="go"
                  placeholderTextColor="black"
                  style={styles.textInput}
                />
              </View>
              {errors.routingNo && (
                <Text style={styles.errorText}>This field is required</Text>
              )}
              <AuthButton
                style={styles.button}
                onPress={handleSubmit(onSubmit)}>
                Add
              </AuthButton>
            </ScrollView>
            {/* )} */}
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  activity: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  mainScreen: {
    flexGrow: 1,
    backgroundColor: Colors.black,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  whiteContainer: {
    // height: '90%',
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 20,
  },
  accountDetails: {
    marginVertical: 10,
    // height: '40%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  IconContainer: {
    backgroundColor: Colors.red,
    width: '5%',
    height: 17,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginLeft: 5,
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: Colors.red,
    fontWeight: 'bold',
  },
  fieldContainer: {
    marginTop: 20,
  },
  fieldTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 10,
  },
  fieldView: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontFamily: 'OpenSans-Regular',
  },
  textInput: {
    flexBasis: '90%',
    color: 'black',
  },
  button: {
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
  },
})

export default ManageBankAccount
