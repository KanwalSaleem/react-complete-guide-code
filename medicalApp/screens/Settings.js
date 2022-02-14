import React, {useRef, useState, useEffect, useCallback} from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TextInput,
  Switch,
} from 'react-native'
import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Input from '../components/Input'
import {useForm, Controller} from 'react-hook-form'
import AuthButton from '../components/AuthButton'
import {useSelector} from 'react-redux'
import BottomBar from '../components/BottomBar'
import {useNavigation} from '@react-navigation/native'

const SettingsScreen = () => {
  const navigation = useNavigation()
  const token = useSelector((state) => state.auth.token)
  const [isLoading, setLoading] = useState(false)
  const [availability, setAvailability] = useState(false)
  const [notification, setNotification] = useState(false)
  const currentPasswordRef = useRef()
  const newPasswordRef = useRef()
  const confirmPasswordRef = useRef()
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: {errors},
  } = useForm({
    mode: 'all',
  })

  const currentPassword = register('currentPassword')
  const newPassword = register('newPassword')
  const confirmPassword = register('confirmPassword', {
    validate: (value) => {
      return value === watch('newPassword') || 'The passwords do not match'
    },
  })

  const onSubmit = async (data) => {
    console.log(data)
  }

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.red} />
    </View>
  ) : (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={30}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.mainScreen}>
          <View style={styles.whiteContainer}>
            <View style={styles.settingsContainer}>
              <View style={[styles.fieldView, styles.fieldSettings]}>
                <Text style={styles.textInput}>Push Notification</Text>
                <Switch
                  trackColor={{false: Colors.red, true: '#1E1F20'}}
                  thumbColor={availability ? '#f4f3f4' : '#f4f3f4'}
                  onValueChange={() =>
                    setAvailability((previousState) => !previousState)
                  }
                  value={availability}
                />
              </View>

              <View style={[styles.fieldView, styles.fieldSettings]}>
                <Text style={styles.textInput}>Push Notification</Text>
                <Switch
                  trackColor={{false: Colors.red, true: '#1E1F20'}}
                  thumbColor={notification ? '#f4f3f4' : '#f4f3f4'}
                  onValueChange={() =>
                    setNotification((previousState) => !previousState)
                  }
                  value={notification}
                />
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('manageBankAccount')}
                style={[styles.fieldView, styles.fieldSettings]}>
                <Text style={styles.textInput}>Manage Bank Account</Text>
                <Icon name="chevron-right" color="#1E1F20" size={25} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.fieldContainer}>
              <Text style={styles.fieldTitle}>Change Password </Text>
              <View style={styles.fieldView}>
                <Input
                  control={control}
                  name="currentPassword"
                  rules={{required: true, minLength: 6}}
                  placeholder="Current Password"
                  ref={(e) => {
                    currentPassword.ref(e)
                    currentPasswordRef.current = e
                  }}
                  onSubmitEditing={() => {
                    newPasswordRef.current.focus()
                  }}
                  blurOnSubmit={false}
                  returnKeyType="next"
                  placeholderTextColor="black"
                  style={styles.textInput}
                  secureTextEntry={true}
                />
              </View>
              {errors.currentPassword && (
                <Text style={styles.errorText}>This field is required</Text>
              )}
              <View style={styles.fieldView}>
                <Input
                  control={control}
                  name="newPassword"
                  rules={{required: true, minLength: 6}}
                  maxLength={16}
                  placeholder="New Password"
                  ref={(e) => {
                    newPassword.ref(e)
                    newPasswordRef.current = e
                  }}
                  onSubmitEditing={() => {
                    confirmPasswordRef.current.focus()
                  }}
                  blurOnSubmit={false}
                  returnKeyType="next"
                  placeholderTextColor="black"
                  style={styles.textInput}
                  secureTextEntry={true}
                />
              </View>

              {errors.newPassword && (
                <Text style={styles.errorText}>This field is required</Text>
              )}

              <View style={styles.fieldView}>
                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: true,
                    validate: (value) => {
                      return (
                        value === watch('newPassword') ||
                        'The passwords do not match'
                      )
                    },
                  }}
                  render={({field: {value, onChange}}) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Confirm New Password"
                      ref={(e) => {
                        confirmPassword.ref(e)
                        confirmPasswordRef.current = e
                      }}
                      onSubmitEditing={() => {
                        confirmPasswordRef.current.blur()
                      }}
                      blurOnSubmit={false}
                      returnKeyType="go"
                      secureTextEntry={true}
                      placeholderTextColor="black"
                      style={styles.textInput}
                    />
                  )}
                />
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>Password does not match</Text>
              )}
              <AuthButton
                style={styles.button}
                onPress={handleSubmit(onSubmit)}>
                Save Changes
              </AuthButton>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <BottomBar />
    </>
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
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  button: {
    marginTop: 20,
  },

  fieldSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginVertical: 10,
  },
})

export default SettingsScreen
