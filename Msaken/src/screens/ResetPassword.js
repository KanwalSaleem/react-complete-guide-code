import {useNavigation} from '@react-navigation/core';
import React, {useState, useContext} from 'react';
import MON from 'react-native-vector-icons/MaterialIcons';

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
import OTP from './OTP';
import Toast from 'react-native-simple-toast';
import services from '../common/service';
import {AuthContext} from '../context/AuthContext';

function ResetPassword({route, navigation}) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [passVisible, setPassVisible] = useState(true);
  const [cPassVisible, setCPassVisible] = useState(true);
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [mobile, setMobile] = useState(route.params ? route.params.mobile : '');
  const {language, selectedLanguage, isSkip, isLoggedIn} =
    useContext(AuthContext);

  const updatePasswordHandler = () => {
    if (password.length > 7 && cPassword > 7) {
      if (password == cPassword) {
        services
          .resetPassword('?mobile_no=' + mobile + '&password=' + password)
          .then(res => {
            const response = res.data;
            if (response.error == false) {
              Toast.show(language.passwordChanged, Toast.SHORT);
              navigation.replace('Login');
            } else {
              Toast.show(language.somethingWentWrong, Toast.SHORT);
            }
          })
          .catch(err => {
            const error = err.response.data;
            if (error.error == true) {
              Toast.show(' ' + error.message, Toast.SHORT);
            } else {
              Toast.show(language.somethingWentWrong, Toast.SHORT);
            }
          });
      } else {
        Toast.show(language.enteredPasswordsDoNotMatch, Toast.SHORT);
      }
    } else {
      Toast.show(language.passwordShouldBeGreaterThanCharacters, Toast.SHORT);
    }
    if (isSkip || isLoggedIn) {
      if (currentPassword === '') {
        Toast.show(language.enterYourCurrentPassword, Toast.SHORT);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}>
        <View style={{width: '90%'}}>
          {(isSkip || isLoggedIn) && (
            <View style={styles.searchSection}>
              <TextInput
                style={[
                  styles.input,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}
                secureTextEntry={passVisible}
                placeholder={language.enterCurrentPassword}
                placeholderTextColor={color.inputFontBlack}
                onChangeText={searchString => {
                  setCurrentPassword(searchString);
                }}
                underlineColorAndroid="transparent"
              />
            </View>
          )}
          <View style={styles.searchSection}>
            <TextInput
              style={[
                styles.input,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}
              secureTextEntry={passVisible}
              placeholder={language.enterNewPassword}
              placeholderTextColor={color.inputFontBlack}
              onChangeText={searchString => {
                setPassword(searchString);
              }}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.searchSection}>
            <TextInput
              style={[
                styles.input,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}
              secureTextEntry={cPassVisible}
              placeholder={language.confirmNewPassword}
              placeholderTextColor={color.inputFontBlack}
              onChangeText={searchString => {
                setCPassword(searchString);
              }}
              underlineColorAndroid="transparent"
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                updatePasswordHandler();
              }}
              style={[styles.button, {width: '90%', alignSelf: 'center'}]}>
              <Text style={styles.submitText}>{language.update}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  userIcon: {
    height: 95,
    width: 95,
    paddingBottom: 20,
    margin: 20,
    alignSelf: 'center',
  },

  button: {
    margin: 12,
    padding: 10,
    backgroundColor: color.themeRed,
    borderRadius: 40,
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
    paddingLeft: 20,
    backgroundColor: color.inputBgGrey,
    marginBottom: 20,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    borderRadius: 40,
    backgroundColor: color.inputBgGrey,
    color: '#424242',
  },
  socialLogo: {
    height: 22,
    resizeMode: 'contain',
    width: 22,
    margin: 5,
  },
});

export default ResetPassword;
