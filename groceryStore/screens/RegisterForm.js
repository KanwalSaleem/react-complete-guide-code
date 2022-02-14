import React, {useState, useRef, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import Colors from '../constants/Colors';
import AuthButton from '../components/AuthButton';
import Input from '../components/Input';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/Auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';
import {APIURL} from '../constants/Url';
import RNPickerSelect from 'react-native-picker-select';

const RegisterForm = () => {
  const {setIsAuthenticated, setUserDetails} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const navigation = useNavigation();
  const countryCodes = [
    {label: '+01', value: '+01'},
    {label: '+43', value: '+43'},
    {label: '+54', value: '+54'},
    {label: '+91', value: '+91'},
    {label: '+92', value: '+92'},
    {label: '+93', value: '+93'},
    {label: '+61', value: '+61'},
    {label: '+67', value: '+67'},
    {label: '+213', value: '+213'},
    {label: '+244', value: '+244'},
    {label: '+297', value: '+297'},
    {label: '+355', value: '+35'},
    {label: '+374', value: '+374'},
    {label: '+376', value: '+376'},
    {label: '+684', value: '+684'},
    {label: '+994', value: '+994'},
  ];

  const usernameRef = useRef();
  const mobileNoRef = useRef();
  const passwordRef = useRef();

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    reset,
    // setValue,
  } = useForm({
    mode: 'all',
  });

  const username = register('username');
  const mobileNo = register('mobileNo');
  const password = register('password');

  const onSubmit = async data => {
    setLoading(true);
    const phoneNo = `${data.countryCode}${data.mobileNo}`;

    try {
      let base_url = `${APIURL}/API/verifyemail.php`;
      let uploadData = new FormData();

      uploadData.append('phone', phoneNo);

      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.response === false) {
        navigation.navigate('otp', data);
      } else {
        Toast.show('This Phone number is Already registered', Toast.LONG);
      }
    } catch (error) {
      Alert.alert(error.message);
      setLoading(false);
    }

    setLoading(false);
  };

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.screen}>
        <Text style={styles.title}>Register</Text>
        <View style={styles.fieldContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>Name</Text>

            <View
              style={[styles.fieldArea, errors.username && styles.redBorder]}>
              <Input
                style={styles.input}
                control={control}
                name="username"
                rules={{required: true, minLength: 3}}
                ref={e => {
                  username.ref(e);
                  usernameRef.current = e;
                }}
                onSubmitEditing={() => {
                  mobileNoRef.current.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>Mobile Number</Text>
            <View style={{flexDirection: 'row'}}>
              <View
                style={[
                  styles.countryCode,
                  errors.countryCode && styles.redBorder,
                ]}>
                <Controller
                  control={control}
                  name="countryCode"
                  // defaultValue={'+01'}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <RNPickerSelect
                      placeholder={{
                        label: 'Code',
                        value: null,
                        color: Colors.grey,
                      }}
                      items={countryCodes.map(item => {
                        if (item.value === value) {
                          return {...item, color: 'red'};
                        }
                        return item;
                      })}
                      onValueChange={onChange}
                      style={{
                        inputAndroid: styles.inputText,
                        inputIOS: styles.inputText,
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
              <View
                style={[
                  styles.fieldArea,
                  errors.mobileNo && styles.redBorder,
                  {width: '62%'},
                ]}>
                <Input
                  style={styles.input}
                  control={control}
                  name="mobileNo"
                  rules={{required: true, maxLength: 15, minLength: 8}}
                  maxLength={15}
                  keyboardType={'number-pad'}
                  ref={e => {
                    mobileNo.ref(e);
                    mobileNoRef.current = e;
                  }}
                  onSubmitEditing={() => {
                    passwordRef.current.focus();
                  }}
                  blurOnSubmit={false}
                  returnKeyType="next"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>Password</Text>
            <View
              style={[styles.fieldArea, errors.password && styles.redBorder]}>
              <Input
                style={styles.input}
                control={control}
                name="password"
                rules={{required: true, minLength: 6}}
                secureTextEntry={true}
                ref={e => {
                  password.ref(e);
                  passwordRef.current = e;
                }}
                onSubmitEditing={() => {
                  passwordRef.current.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
              />
            </View>
          </View>
        </View>
        <AuthButton
          onPress={handleSubmit(onSubmit)}
          style={styles.registerButton}>
          Register
        </AuthButton>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 26,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
  },
  fieldContainer: {},
  inputContainer: {
    marginTop: 20,
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
  registerButton: {
    marginTop: 20,
    backgroundColor: Colors.accent,
  },
  countryCode: {
    width: '36%',
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,
    marginRight: 5,
  },
  picker: {
    color: Colors.grey,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },

  input: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    // textAlign: 'center',
    color: Colors.grey,
  },
  inputText: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: Colors.grey,
  },
});

export default RegisterForm;
