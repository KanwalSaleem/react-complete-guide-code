import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import colors from '../common/colors';
import {AuthContext} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

const Account = () => {
  const navigation = useNavigation();
  const [notification, setNotification] = useState(true);
  const {userCred, logOut, language, selectedLanguage} =
    useContext(AuthContext);
  const userParseData = JSON.parse(userCred);
  const userData = userParseData.data.user;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.mainContainer}>
        <View style={styles.fieldContainer}>
          <View
            style={[
              styles.profileContainer,
              selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
            ]}>
            <Text style={styles.title}>{language.profileDetails}</Text>

            <TouchableOpacity
              style={styles.editContainer}
              activeOpacity={0.6}
              onPress={() => navigation.navigate('editProfile')}>
              <Text style={styles.editTitle}>{language.edit}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.fieldView}>
            {userData.role === 'owner' ? (
              <Text
                style={[
                  styles.fieldTitle,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}>
                {language.companyName}
              </Text>
            ) : (
              <Text
                style={[
                  styles.fieldTitle,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}>
                {language.name}
              </Text>
            )}
            <Text
              style={[
                styles.fieldText,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {userData.full_name}
            </Text>
          </View>
          {userData.role != 'buyer' && (
            <View style={styles.fieldView}>
              {userData.role === 'agent' ? (
                <Text
                  style={[
                    styles.fieldTitle,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}>
                  {language.address}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.fieldTitle,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}>
                  {language.companyAddress}
                </Text>
              )}
              <Text
                style={[
                  styles.fieldText,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}>
                {userData.company_add}
              </Text>
            </View>
          )}
          <View style={styles.fieldView}>
            <Text
              style={[
                styles.fieldTitle,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.email}
            </Text>
            <Text
              style={[
                styles.fieldText,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {userData.email}
            </Text>
          </View>
          <View style={styles.fieldView}>
            <Text
              style={[
                styles.fieldTitle,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.phoneNumberCapitalCase}
            </Text>
            <Text
              style={[
                styles.fieldText,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {userData.mobile_no}
            </Text>
          </View>
        </View>
        <View style={styles.fieldContainer}>
          {/* <TouchableOpacity activeOpacity={0.6} onPress={() => {}}>
            <Text style={[styles.title, {fontFamily: 'Roboto-Regular'}]}>
              {language.Messages}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('myListing')}
            // style={styles.optionContainer}
          >
            <Text
              style={[
                styles.title,
                {fontFamily: 'Roboto-Regular'},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.myListing}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('notifications')}
            style={[
              styles.optionContainer,
              {
                flexDirection:
                  selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}>
            <Text style={[styles.title, {fontFamily: 'Roboto-Regular'}]}>
              {language.notifications}
            </Text>
            <Switch
              trackColor={{true: colors.themeRed, false: colors.darkGrey}}
              thumbColor={notification ? colors.themeWhite : colors.themeWhite}
              onValueChange={() =>
                setNotification(previousState => !previousState)
              }
              value={notification}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate('changePassword')}
            style={styles.optionContainer}>
            <Text
              style={[
                styles.title,
                {fontFamily: 'Roboto-Regular'},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.changePassword}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fieldContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate('aboutUs')}>
            <Text
              style={[
                styles.title,
                {fontFamily: 'Roboto-Regular'},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.aboutUs}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate('helpUs')}
            style={styles.optionContainer}>
            <Text
              style={[
                styles.title,
                {fontFamily: 'Roboto-Regular'},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.help}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate('termsConditions')}
            style={styles.optionContainer}>
            <Text
              style={[
                styles.title,
                {fontFamily: 'Roboto-Regular'},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.termsOfUse}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate('privacyPolicy')}
            style={styles.optionContainer}>
            <Text
              style={[
                styles.title,
                {fontFamily: 'Roboto-Regular'},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.privacyPolicy}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.editContainer,
            {width: '80%', height: 45, marginTop: 40},
          ]}
          activeOpacity={0.6}
          onPress={() => logOut()}>
          <Text
            style={[
              styles.editTitle,
              {fontFamily: 'Roboto-Bold'},
              selectedLanguage === 'arabic' && {textAlign: 'right'},
            ]}>
            {language.logout}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: colors.themeWhite,
  },
  mainContainer: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  fieldContainer: {
    marginBottom: 10,
    backgroundColor: colors.inputBgGrey,
    padding: 15,
    borderRadius: 10,
  },
  fieldView: {marginTop: 10},
  title: {
    fontSize: 16,
    color: colors.titleBlack,
    fontFamily: 'Roboto-Medium',
  },
  fieldTitle: {
    fontSize: 12,
    color: colors.titleBlack,
    fontFamily: 'Roboto-Medium',
  },
  fieldText: {
    fontSize: 14,
    color: colors.darkGrey,
    fontFamily: 'Roboto-Medium',
    marginTop: 3,
  },
  optionContainer: {
    marginTop: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editContainer: {
    borderWidth: 1,
    borderColor: colors.themeRed,
    borderRadius: 20,
    alignItems: 'center',
    width: '30%',
    height: 35,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  editTitle: {
    fontSize: 14,
    color: colors.themeRed,
    fontFamily: 'Roboto-Medium',
  },
});

export default Account;
