import React, {useState} from 'react'
import {View, Text, StyleSheet, KeyboardAvoidingView, Alert} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useForm} from 'react-hook-form'
import {useNavigation} from '@react-navigation/core'
import {ActivityIndicator} from 'react-native-paper'
import Input from '../components/Input'
import AuthButton from '../components/AuthButton'
import Colors from '../constants/Colors'

const ForgotPasswordScreen = () => {
  const navigation = useNavigation()
  const [isLoading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    // setValue,
  } = useForm({
    mode: 'all',
  })

  const onSubmit = async data => {
    console.log(data)

    setLoading(true)
    try {
      let base_url = 'https://www.worldmcqs.org/Admin/API/postdata.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'resetpassword')
      uploadData.append('email', data.email)

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message)
      }
      if (responseData.isUpdated === false) {
        Alert.alert(responseData.Message)
      } else {
        Alert.alert('Success', responseData.Message)

        navigation.goBack()
      }
    } catch (error) {
      Alert.alert(error.message)
    }
    setLoading(false)
  }

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <KeyboardAvoidingView style={styles.screen}>
      <Text style={styles.heading}>World MCQs</Text>
      <Text style={styles.passwordHeading}>Enter E-mail</Text>
      <View style={styles.fieldArea}>
        <View style={styles.inputView}>
          <View style={styles.inputTextView}>
            <Icon style={styles.inputIcon} name="email" color="#4F8EF7" />
            <Input
              rules={{
                required: 'This field is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Enter a valid email address',
                },
              }}
              style={styles.input}
              control={control}
              name="email"
              placeholder="E-mail"
            />
          </View>
        </View>
        <View>
          {errors.email && (
            <Text
              style={{
                color: Colors.secondary,
                fontSize: 14,
                marginTop: 10,
                marginLeft: 10,
              }}>
              {errors.email.message}
            </Text>
          )}
        </View>
      </View>

      <AuthButton
        style={styles.buttonContainer}
        onPress={handleSubmit(onSubmit)}>
        Continue
      </AuthButton>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 46,
    color: Colors.secondary,
    marginBottom: 40,
  },
  passwordHeading: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
  },
  fieldArea: {
    // marginBottom: 20,
    alignItems: 'flex-start',
  },
  inputView: {
    flexDirection: 'row',

    // justifyContent: 'center',
  },
  inputTextView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 20,
    height: 50,
    // justifyContent: 'center',
    padding: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderRadius: 10,
    height: 80,
    color: 'white',
    flexBasis: '94%',
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  buttonContainer: {
    width: '80%',

    marginLeft: 10,
    marginTop: 30,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
})

export default ForgotPasswordScreen
