import React, {useState, useRef, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import Colors from '../constants/Colors';
import AuthButton from '../components/AuthButton';
import Input from '../components/Input';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {APIURL} from '../constants/Url';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginForm = () => {
  const {setIsAuthenticated, setUserDetails} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);

  const navigation = useNavigation();
  // const countryCodes = [
  //   '+01',
  //   '+43',
  //   '+54',
  //   '+91',
  //   '+92',
  //   '+93',
  //   '+61',
  //   '+67',
  //   '+213',
  //   '+244',
  //   '+297',
  //   '+355',
  //   '+374',
  //   '+376',
  //   '+684',
  //   '+994',
  // ];
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

  const mobileNoRef = useRef();
  const passwordRef = useRef();

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    reset,
  } = useForm({
    mode: 'all',
  });

  const mobileNo = register('mobileNo');
  const password = register('password');

  const onSubmit = async data => {
    const phoneNo = `${data.countryCode}${data.mobileNo}`;
    setLoading(true);
    try {
      const deviceToken = await AsyncStorage.getItem('deviceToken');

      let base_url = `${APIURL}/API/login.php`;
      let uploadData = new FormData();

      uploadData.append('phone', phoneNo);
      uploadData.append('password', data.password);
      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      uploadData.append('notification_token', deviceToken);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.status === false) {
        Toast.show(responseData.Message, Toast.LONG);
        console.log(responseData);
        setIsAuthenticated(false);
      } else {
        const UserDetails = responseData.Data;
        const UserDetailsJson = JSON.stringify(UserDetails);
        AsyncStorage.setItem('userDetails', UserDetailsJson);
        setUserDetails(responseData.Data);
        setIsAuthenticated(true);
        navigation.navigate('dashBoard');
        reset();
        setLoading(false);
      }

      return responseData;
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      reset();
    }, []),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={styles.screen}>
        <View>
          <Image
            style={styles.logo}
            source={require('../assets/logoImg.png')}
          />
        </View>
        <Text style={styles.registerTitle}>New User ?</Text>

        <AuthButton
          onPress={() => navigation.navigate('registerForm')}
          style={styles.registerButton}>
          Register Now
        </AuthButton>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Login (Already Registered)</Text>
          <View style={styles.fieldContainer}>
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
                      //   <Picker
                      //   dropdownIconColor={Colors.primary}
                      //   style={styles.picker}
                      //   selectedValue={value}
                      //   onValueChange={onChange}
                      //   mode="dropdown">
                      //   <Picker.Item
                      //     label="Code"
                      //     value={''}
                      //     style={styles.picker}
                      //   />
                      //   {countryCodes.map((item, index) => {
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
                    style={[styles.input]}
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
            style={styles.loginButton}
            onPress={handleSubmit(onSubmit)}>
            Login
          </AuthButton>
        </View>
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
  logo: {
    width: '40%',
    height: 130,
    alignSelf: 'center',
  },
  registerTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginTop: 5,
  },
  input: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    // textAlign: 'center',
    color: Colors.grey,
  },
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
  loginContainer: {
    marginTop: 15,
    borderTopWidth: 2,
    borderColor: Colors.grey,
  },
  loginButton: {
    backgroundColor: Colors.secondary,
    marginTop: 15,
  },
  loginTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: Colors.grey,
    textAlign: 'center',
    marginTop: 20,
  },
  picker: {
    color: Colors.grey,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
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

export default LoginForm;
