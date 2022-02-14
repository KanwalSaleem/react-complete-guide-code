import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useForm} from 'react-hook-form';
import Toast from 'react-native-simple-toast';
import Colors from '../constants/Colors';
import AuthButton from '../components/AuthButton';
import Input from '../components/Input';
import {AuthContext} from '../context/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIURL} from '../constants/Url';

const OTPScreen = ({route, navigation}) => {
  const {setIsAuthenticated, setUserDetails} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [OTP, setOTP] = useState();

  const registerData = route.params;

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    // setValue,
  } = useForm({
    mode: 'all',
  });

  // const pinCode = register('mobileNo');

  const onSubmit = async data => {
    if (OTP == data.otp) {
      setLoading(true);
      const phoneNo = `${registerData.countryCode}${registerData.mobileNo}`;
      const deviceToken = await AsyncStorage.getItem('deviceToken');
      try {
        let base_url = `${APIURL}/API/register.php`;
        let uploadData = new FormData();

        uploadData.append('name', registerData.username);
        uploadData.append('phone', phoneNo);
        uploadData.append('password', registerData.password);
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
          setIsAuthenticated(false);
        } else {
          const signUpUserDetails = responseData.Data;
          const UserDetails = JSON.stringify(signUpUserDetails);
          AsyncStorage.setItem('userDetails', UserDetails);
          setUserDetails(responseData.Data);
          setIsAuthenticated(true);
          navigation.navigate('dashBoard');
        }
      } catch (error) {
        Alert.alert(error.message);
        setLoading(false);
      }

      setLoading(false);
    } else {
      Toast.show('Invalid OTP', Toast.LONG);
    }
  };

  const getOTP = useCallback(async () => {
    const phoneNo = `${registerData.countryCode}${registerData.mobileNo}`;

    try {
      let base_url = `${APIURL}/API/generateOTP.php`;

      let uploadData = new FormData();

      uploadData.append('token', 'ASDEGFAERGBEBDFV66_2654641321sdvzdfv!@');
      uploadData.append('phone', phoneNo);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();
      console.log(responseData.OTP);
      if (responseData.code != 200) {
        throw new Error(responseData.Message);
      } else {
        setOTP(responseData.OTP);
      }
      Toast.show(responseData.Message, Toast.LONG);
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getOTP();
  }, []);

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.screen}>
        <View>
          <Image style={styles.logo} source={require('../assets/otp.jpg')} />
        </View>

        <View style={styles.fieldContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>Please enter 4 digit OTP</Text>
            <View style={[styles.fieldArea, errors.otp && styles.redBorder]}>
              <Input
                style={styles.input}
                control={control}
                name="otp"
                rules={{required: true, minLength: 4, maxLength: 4}}
                keyboardType={'number-pad'}
                blurOnSubmit={false}
                returnKeyType="next"
                maxLength={4}
              />
            </View>
          </View>
        </View>
        <AuthButton
          onPress={handleSubmit(onSubmit)}
          style={styles.registerButton}>
          Send
        </AuthButton>
        <View style={styles.resendContainer}>
          <Text style={styles.resendTitle}>Don{"'"}t Recieve code? </Text>
          <TouchableOpacity activeOpacity={0.6} onPress={() => getOTP()}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
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

    paddingHorizontal: 15,
  },
  logo: {
    marginTop: 40,
    width: '50%',
    height: 120,
    alignSelf: 'center',
  },

  fieldContainer: {},
  inputContainer: {
    marginTop: 20,
  },
  fieldText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    marginVertical: 10,
    alignSelf: 'center',
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
  resendContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  resendTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: Colors.grey,
  },
  resendText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: Colors.accent,
  },
});

export default OTPScreen;
