import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';
import color from '../common/colors';
import {AuthContext} from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import MON from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';
import Input from '../components/Common/Input';
import ION from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = () => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const {userCred, setUserCred, language, selectedLanguage} =
    useContext(AuthContext);

  const [userParseData, setUserParseData] = useState(JSON.parse(userCred));
  const [userData, setUserData] = useState(userParseData.data.user);
  const [userDetails, setUserDetails] = useState(userParseData.data);
  const token = userParseData.data.token;

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({});

  const onSubmit = async data => {
    setLoading(true);
    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/updateprofileapp';

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);

      let formdata = new FormData();
      formdata.append('full_name', data.name);
      formdata.append('email', data.email);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        headers: headers,
        body: formdata,
      });

      const responseData = await response.json();

      if (responseData.status === false) {
        throw new Error(responseData.message);
      } else {
        const editUserData = {
          ...userData,
          full_name: data.name,
          email: data.email,
        };
        const editUserDetails = {
          ...userDetails,
          user: editUserData,
        };

        const editParseData = {
          ...userParseData,
          data: editUserDetails,
        };

        setUserCred(JSON.stringify(editParseData));

        await AsyncStorage.setItem(
          'userCredentials',
          JSON.stringify(editParseData),
        );

        Toast.show(responseData.message, Toast.SHORT);
        navigation.navigate('userDashBoard');
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    reset({
      name: userData?.full_name,
      email: userData?.email,
      phone: userData?.mobile_no,
      companyAddress: userData?.company_add,
    });
  }, [
    reset,
    userData?.company_add,
    userData?.email,
    userData?.full_name,
    userData?.mobile_no,
  ]);

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={color.themeRed} />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.mainContainer}>
          <View style={styles.fieldContainer}>
            {errors.name && Toast.show(errors.name.message, Toast.SHORT)}
            {errors.email && Toast.show(language.emailIsRequired, Toast.SHORT)}
            {errors.companyAddress &&
              Toast.show(errors.companyAddress.message, Toast.SHORT)}
            {errors.phone &&
              Toast.show(language.phoneNumberIsRequired, Toast.SHORT)}

            <View
              style={[
                styles.fieldView,
                selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
              ]}>
              <MON
                style={styles.searchIcon}
                name="person"
                size={20}
                color={color.themeRed}
              />
              <Input
                control={control}
                style={[
                  styles.input,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}
                name="name"
                rules={{required: language.nameIsRequired}}
                placeholder={language.writeYourName}
              />
            </View>
            {userData.role != 'buyer' && (
              <View
                style={[
                  styles.fieldView,
                  selectedLanguage === 'arabic' && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <ION
                  style={styles.searchIcon}
                  name="location-sharp"
                  size={20}
                  color={color.themeRed}
                />

                <Input
                  control={control}
                  style={[
                    styles.input,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}
                  name="companyAddress"
                  rules={{
                    required:
                      userData.role === 'agent'
                        ? language.addressIsRequired
                        : language.companyAddressIsRequired,
                  }}
                  placeholder={
                    userData.role === 'agent'
                      ? language.writeYourAddress
                      : language.writeYourCompanyAddress
                  }
                />
              </View>
            )}
            <View
              style={[
                styles.fieldView,
                selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
              ]}>
              <MON
                style={styles.searchIcon}
                name="mail"
                size={20}
                color={color.themeRed}
              />
              <Input
                control={control}
                style={[
                  styles.input,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}
                name="email"
                rules={{
                  required: true,
                  pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                }}
                placeholder={language.writeYourEmail}
                keyboardType="email-address"
              />
            </View>
            <View
              style={[
                styles.fieldView,
                selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
              ]}>
              <MON
                style={styles.searchIcon}
                name="call"
                size={20}
                color={color.themeRed}
              />
              <Input
                control={control}
                style={[
                  styles.input,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}
                name="phone"
                rules={{required: true, minLength: 9, maxLength: 15}}
                placeholder={language.writYourPhoneNumber}
                keyboardType={'phone-pad'}
                maxLength={15}
                editable={false}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleSubmit(onSubmit)}
          style={styles.applyButton}>
          <Text style={styles.applyText}>{language.save}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    backgroundColor: color.themeWhite,
  },
  mainContainer: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },

  fieldView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    margin: 10,
    backgroundColor: color.inputBgGrey,
    paddingLeft: 10,
  },

  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    borderRadius: 20,
    backgroundColor: color.inputBgGrey,
    color: '#424242',
    fontFamily: 'Roboto-Regular',
  },
  searchIcon: {
    padding: 10,
  },
  applyButton: {
    backgroundColor: color.themeRed,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'center',
    borderRadius: 30,
    marginVertical: 10,
    position: 'absolute', //Here is the trick
    bottom: 0,
  },
  applyText: {
    color: color.themeWhite,
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
  },
});

export default EditProfile;
