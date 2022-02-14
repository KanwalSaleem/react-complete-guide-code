import React, {useState, useEffect, useContext} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native'
import {Controller, useForm} from 'react-hook-form'
import BottomBar from '../components/BottomBar'

import {AppContext} from '../context/auth'

import {useHttpClient} from '../hooks/http-hook'
import {ActivityIndicator} from 'react-native-paper'
import Colors from '../constants/colors'

const AccountSettings = () => {
  const {sendRequest, isLoading, error, clearError} = useHttpClient()
  const [edit, setEdit] = useState(false)
  const {user, login} = useContext(AppContext)

  const {
    control,
    handleSubmit,
    reset,

    formState: {errors},
  } = useForm({
    mode: 'all',
  })
  console.log(errors)

  const onSubmit = async (data) => {
    console.log('hello')
    console.log(data)
    const body = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phoneNo,
    }
    if (data.email) {
      body.email = data.email
    }
    try {
      const response = await sendRequest(
        'https://deliverypay.in/api/editUserProfile',
        'PATCH',
        JSON.stringify(body),
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      )
      console.log(response)
      login((prev) => ({
        ...prev,
        userId: response.user._id,
        deliverypayId: response.user.userId,
        userPhone: response.user.phone,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        image: response.user.profileImg,
        paymentMethods: response.user.paymentMethods,
        balance: response.user.balance,
      }))

      if (error) {
        Alert.alert('Error', error, [
          {text: 'Okay', onPress: () => clearError()},
        ])
      }
    } catch (e) {
      console.log(e)
    }
    setEdit(false)
    // props.onSubmit(data)
    // console.log(data, 'data')
  }

  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user?.email,
      phoneNo: user.userPhone,

      deliverypayId: user.deliverypayId,
    })
  }, [reset])

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        {isLoading ? (
          <View style={[styles.screen, {justifyContent: 'center'}]}>
            <ActivityIndicator color={Colors.primary} size="large" />
          </View>
        ) : (
          <ScrollView style={styles.screen}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={1}
              behavior={'position'}>
              <Image
                style={{marginBottom: 10}}
                source={require('../assets/signupImage.png')}
              />
              <ScrollView contentContainerStyle={styles.fieldsContainer}>
                <Text style={styles.title}>Account Setting</Text>

                <View
                  style={[
                    styles.fieldView,
                    errors.fullName && styles.redBorder,
                  ]}>
                  {edit === false ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.fieldEdit}>First Name</Text>
                      <Text
                        style={styles.fieldEdit}>{`${user.firstName}`}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setEdit(true)
                        }}>
                        <Text style={styles.fieldEdit}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Controller
                        control={control}
                        name="firstName"
                        rules={{required: true}}
                        render={({field: {value, onChange}}) => (
                          <TextInput
                            value={value}
                            onChangeText={onChange}
                            placeholder="First Name"
                            placeholderTextColor="#2699FB"
                            style={styles.input}
                          />
                        )}
                      />
                      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                        <Text style={[styles.fieldEdit]}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.fieldView,
                    errors.fullName && styles.redBorder,
                  ]}>
                  {edit === false ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.fieldEdit}>Last Name</Text>
                      <Text style={styles.fieldEdit}>{`${user.lastName}`}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setEdit(true)
                        }}>
                        <Text style={styles.fieldEdit}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Controller
                        control={control}
                        name="lastName"
                        rules={{required: true}}
                        render={({field: {value, onChange}}) => (
                          <TextInput
                            value={value}
                            onChangeText={onChange}
                            placeholder="last Name"
                            placeholderTextColor="#2699FB"
                            style={styles.input}
                          />
                        )}
                      />
                      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                        <Text style={[styles.fieldEdit]}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View
                  style={[styles.fieldView, errors.email && styles.redBorder]}>
                  {edit === false ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.fieldEdit}>Email</Text>
                      <Text style={styles.fieldEdit}>{user.email}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setEdit(true)
                        }}>
                        <Text style={styles.fieldEdit}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Controller
                        control={control}
                        name="email"
                        rules={{
                          // required: true,
                          pattern:
                            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        }}
                        render={({field: {value, onChange}}) => (
                          <TextInput
                            value={value}
                            onChangeText={onChange}
                            placeholder="Email"
                            placeholderTextColor="#2699FB"
                            style={styles.input}
                          />
                        )}
                      />
                      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                        <Text style={[styles.fieldEdit]}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View
                  style={[
                    styles.fieldView,
                    errors.phoneNo && styles.redBorder,
                  ]}>
                  {edit === false ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.fieldEdit}>PhoneNo</Text>
                      <Text style={styles.fieldEdit}>{user.userPhone}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setEdit(true)
                        }}>
                        <Text style={styles.fieldEdit}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Controller
                        control={control}
                        name="phoneNo"
                        rules={{required: true, type: 'number'}}
                        render={({field: {value, onChange}}) => (
                          <TextInput
                            value={value}
                            keyboardType="number-pad"
                            onChangeText={onChange}
                            placeholder="PhoneNo"
                            placeholderTextColor="#2699FB"
                            style={styles.input}
                          />
                        )}
                      />
                      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                        <Text style={[styles.fieldEdit]}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* <View
                style={[styles.fieldView, errors.password && styles.redBorder]}>
                {edit === false ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.fieldEdit}>Password</Text>
                    <Text style={styles.fieldEdit}>12345</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setEdit(true)
                      }}>
                      <Text style={styles.fieldEdit}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Controller
                      control={control}
                      name="password"
                      rules={{required: true}}
                      render={({field: {value, onChange}}) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          placeholder="Password"
                          placeholderTextColor="#2699FB"
                          style={styles.input}
                          secureTextEntry={true}
                        />
                      )}
                    />
                    <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                      <Text style={[styles.fieldEdit]}>Save</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View> */}

                <View
                  style={[
                    styles.fieldView,
                    errors.deliveryPayId && styles.redBorder,
                  ]}>
                  {edit === false ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.fieldEdit}>Delivery Pay Id</Text>
                      <Text
                        style={
                          styles.fieldEdit
                        }>{`${user.deliverypayId.substring(0, 20)}`}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setEdit(true)
                        }}>
                        <Text style={styles.fieldEdit}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Controller
                        control={control}
                        name="deliverypayId"
                        rules={{
                          required: true,
                        }}
                        render={({field: {value, onChange}}) => (
                          <TextInput
                            value={value}
                            onChangeText={onChange}
                            placeholder="Delivery Pay Id"
                            placeholderTextColor="#2699FB"
                            style={styles.input}
                          />
                        )}
                      />
                      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                        <Text style={[styles.fieldEdit]}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </ScrollView>
        )}
        <BottomBar />
      </>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: '#F6F6FA',
    backgroundColor: '#F8FAFF',
  },
  fieldsContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  redBorder: {
    borderColor: '#c12323',
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontSize: 25,
    color: '#0C0B0B',
  },
  fieldView: {
    // flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    borderColor: '#BCE0FD',
    borderWidth: 1.5,
    width: '85%',
    height: 60,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderRadius: 20,
    // flexBasis: '90%',
  },
  fieldEdit: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#2699FB',
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#2699FB',
    width: '80%',
  },
})
export default AccountSettings
