import React, {useState, useCallback, useEffect} from 'react'
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FormData from 'form-data'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useNavigation} from '@react-navigation/native'

const ContactUs = () => {
  const navigation = useNavigation()
  const [isLoading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  //    const[emailValid,setEmailValid] = useState(false)
  const updateName = text => {
    setName(text)
  }

  const [name, setName] = useState('')
  //    const[nameValid,setNameValid] = useState(false)
  const updateEmail = text => {
    setEmail(text)
  }

  const [message, setMessage] = useState('')
  const updateMessage = text => {
    setMessage(text)
  }

  const [nameValid, setNameValid] = useState('')
  const [emailValid, setEmailValid] = useState('')
  const [emailError, setEmailError] = useState('')
  const [messageValid, setMessageValid] = useState('')

  const getContact = useCallback(async () => {
    setLoading(true)
    try {
      const UserDetailsJson = await AsyncStorage.getItem('User_Details')
      const UserDetails = JSON.parse(UserDetailsJson)
      const userId = UserDetails.User_id
      let base_url = 'https://www.worldmcqs.org/Admin/API/postdata.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'ContactForm')
      uploadData.append('email', email)
      uploadData.append('name', name)
      uploadData.append('message', message)

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message)
      } else {
        console.log(responseData)
        Alert.alert(responseData.Message)
        if (responseData.Response === 200) {
          navigation.navigate('dashboard')
        }
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const proceedNext = () => {
    if (email === '') {
      setEmailValid(true)
      setEmailError('Please Fill It')
    } else if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      setEmailValid(true)
      setEmailError('Please Enter Correct Email Address')
    } else {
      setEmailValid(false)
    }

    if (name === '') {
      setNameValid(true)
    } else {
      setNameValid(false)
    }

    if (message === '') {
      setMessageValid(true)
    } else {
      setMessageValid(false)
    }

    if (nameValid === false && emailValid === false && messageValid === false) {
      getContact()
    }
  }

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.form}>
                <View style={styles.fieldContainer}>
                  <Text style={styles.text}>Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Name"
                    value={name}
                    onChangeText={updateName}
                  />

                  <View style={styles.fieldValid}>
                    {nameValid == true ? (
                      <View>
                        <Text style={styles.errorText}>Please Fill It</Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.text}>Email</Text>
                  <TextInput
                    placeholder="Email"
                    style={styles.textInput}
                    value={email}
                    onChangeText={updateEmail}
                  />
                  <View>
                    {emailValid == true ? (
                      <View>
                        <Text style={styles.errorText}>{emailError}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.text}>Message</Text>
                  <TextInput
                    placeholder="Message"
                    style={styles.messgaeInput}
                    value={message}
                    multiline={true}
                    onChangeText={updateMessage}
                  />
                  <View style={styles.fieldValid}>
                    {messageValid == true ? (
                      <View>
                        <Text style={styles.errorText}>Please Fill It</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={styles.btnContainer}>
                <TouchableOpacity>
                  <Button
                    style={styles.button}
                    color={Colors.primary}
                    title="Submit"
                    onPress={proceedNext}
                    disabled={false}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    // flex: 1,
    paddingVertical: 40,
  },
  form: {
    marginTop: 40,
    paddingHorizontal: 25,
    //  flex: 1,
    //  justifyContent: 'space-between',
  },

  textInput: {
    height: 50,
    borderColor: Colors.primary,
    borderWidth: 1.5,
    // marginTop:10,
    borderRadius: 5,
    padding: 10,
  },
  text: {
    color: Colors.primary,
    fontSize: 14,
    paddingLeft: 10,
    fontWeight: '700',
  },

  messgaeInput: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderRadius: 5,
    height: 200,
    textAlignVertical: 'top',
    paddingLeft: 10,
  },

  btnContainer: {
    alignSelf: 'center',
    // backgroundColor: "white",
    // marginBottom: 15,
    width: '70%',
    // borderWidth: 1.5,
    // borderRadius: 5,
    // borderColor: Colors.primary,
    paddingTop: 40,
    position: 'relative',
    bottom: -10,
    // borderRadius: 20,
    // borderRadius: 10,
  },
  button: {
    // backgroundColor: 'white',
    // borderWidth: 1.5,
    // borderRadius: 5,
    // borderColor: Colors.primary,
    // fontSize: 16,
  },
  filedValid: {
    marginBottom: 10,
  },
  fieldContainer: {
    //   flex: 1,
    //   justifyContent: 'flex-start',
    // marginBottom: 5,
  },
  iconContainer: {
    marginLeft: 20,
  },
  errorText: {
    paddingLeft: 5,
    color: 'red',
    fontSize: 12,
  },
})

export default ContactUs
