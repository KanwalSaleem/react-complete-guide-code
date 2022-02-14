import {useNavigation} from '@react-navigation/core';
import React, {useState, useContext} from 'react';

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import ION from 'react-native-vector-icons/Ionicons';
import color from '../common/colors';
import services from '../common/service';
import {AuthContext} from '../context/AuthContext';

import Toast from 'react-native-simple-toast';

function ForgotPassword() {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const {language, selectedLanguage} = useContext(AuthContext);

  const ForgotPasswordHandler = () => {
    if (phoneNumber.length != 0) {
      services
        .forgotPassword('?mobile_no=' + phoneNumber)
        .then(async res => {
          const response = res.data;
          // Toast.show(' ' + response.data.otp, Toast.LONG);
          navigation.navigate('ForgotOTP', {
            mobile: phoneNumber,
            otp: response.data.otp,
          });
        })
        .catch(err => {
          const error = err.response.data;
          console.log(error.error);
          if (error.error == true) {
            Toast.show(' ' + error.message, Toast.SHORT);
          } else {
            Toast.show(language.somethingWentWrong, Toast.SHORT);
          }
        });
    } else {
      Toast.show(language.allFieldsRequired, Toast.SHORT);
    }
  };

  return (
    // <SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      {/* <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{width: '80%', flex: 0.4, justifyContent: 'space-around'}}> */}

      <Text style={styles.forgotText}>{language.forgotPassword}</Text>
      <View
        style={{
          marginVertical: 20,
          marginBottom: 30,
          width: '80%',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text style={styles.sentence}>
          {language.enterYourRegisteredPhoneNumberToRecoverYourPassword}
        </Text>
      </View>

      <View style={styles.searchSection}>
        {/* <ION
                style={styles.searchIcon}
                name="call"
                size={20}
                color={color.themeRed}
              /> */}
        <TextInput
          keyboardType="phone-pad"
          style={[
            styles.input,
            selectedLanguage === 'arabic' && {textAlign: 'right'},
          ]}
          placeholder={language.phoneNumber}
          placeholderTextColor={color.inputFontBlack}
          onChangeText={searchString => {
            setPhoneNumber(searchString);
          }}
          underlineColorAndroid="transparent"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={ForgotPasswordHandler}>
        <Text style={styles.submitText}>{language.send}</Text>
      </TouchableOpacity>

      {/* </View>
        </View> */}
    </ScrollView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    paddingHorizontal: 10,
    justifyContent: 'center',

    backgroundColor: '#fff',
  },
  input: {
    color: '#6b6b6b',

    // borderWidth: 1,
  },
  button: {
    margin: 12,
    padding: 10,
    backgroundColor: color.themeRed,
    borderRadius: 40,
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  submitText: {
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentence: {
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  searchSection: {
    marginVertical: 20,
    marginBottom: 40,
    borderRadius: 40,
    width: '80%',
    alignSelf: 'center',

    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: color.inputBgGrey,
  },
  searchIcon: {
    padding: 10,
  },
  forgotText: {
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
    fontSize: 26,
  },
  socialLogo: {
    height: 22,
    resizeMode: 'contain',
    width: 22,
    margin: 5,
  },
});

export default ForgotPassword;
