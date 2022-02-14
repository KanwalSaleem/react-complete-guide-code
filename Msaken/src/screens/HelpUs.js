import React, {useEffect, useState, useCallback, useContext} from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MON from 'react-native-vector-icons/MaterialIcons';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import {useForm} from 'react-hook-form';
import Toast from 'react-native-simple-toast';
import Input from '../components/Common/Input';
import color from '../common/colors';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

const HelpUs = props => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({});

  const {language, selectedLanguage} = useContext(AuthContext);

  const onSubmit = async data => {
    setIsLoading(true);

    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/submit-contactform';

      let formdata = new FormData();
      formdata.append('fname', data.name);
      formdata.append('lname', '');
      formdata.append('email', data.email);
      formdata.append('mobile_no', data.phone);
      formdata.append('message', data.message);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: formdata,
      });

      const responseData = await response.json();

      if (responseData.status === false) {
        throw new Error(responseData.message);
      } else {
        Alert.alert(responseData.message);
        props.navigation.navigate('userDashBoard');
      }
    } catch (error) {
      Alert.alert(error.message);
    }

    setIsLoading(false);
  };
  useFocusEffect(
    useCallback(() => {
      reset();
    }, [reset]),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={color.themeRed} />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.screen}>
        <Text
          style={[
            styles.heading,
            selectedLanguage === 'arabic' && {textAlign: 'right'},
          ]}>
          {language.sendUsAMessage}
        </Text>
        <Text
          style={[
            styles.secondHeading,
            selectedLanguage === 'arabic' && {textAlign: 'right'},
          ]}>
          {language.tellUsHowWeCanHelpYou}
        </Text>
        <View
          style={[
            styles.searchSection,
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
        {errors.name && Toast.show(errors.name.message, Toast.SHORT)}
        {errors.email && Toast.show(errors.email.message, Toast.SHORT)}
        {errors.phone && Toast.show(errors.phone.message, Toast.SHORT)}
        {errors.message && Toast.show(errors.message.message, Toast.SHORT)}
        <View
          style={[
            styles.searchSection,
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
            rules={{required: language.emailIsRequired}}
            placeholder={language.writeYourEmail}
            keyboardType="email-address"
          />
        </View>
        <View
          style={[
            styles.searchSection,
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
            rules={{required: language.phoneNumberIsRequired}}
            placeholder={language.writYourPhoneNumber}
            keyboardType={'phone-pad'}
          />
        </View>
        <View
          style={[
            styles.searchSection,
            {borderRadius: 10, height: 120, alignItems: 'flex-start'},
            selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
          ]}>
          <Input
            control={control}
            style={[
              styles.input,
              selectedLanguage === 'arabic' && {textAlign: 'right'},
            ]}
            name="message"
            rules={{required: language.messageIsRequired}}
            placeholder={language.howWeCanHelpYou}
            multiline
          />
        </View>
        <View style={styles.contactRowContainer}>
          <View style={styles.contactContainer}>
            <Text style={styles.contactHeading}>{language.address}</Text>

            <Text style={styles.contactText} selectable={true}>
              {` 18/A, New Born Town Hall, 
  New York, US`}
            </Text>
          </View>
          <View style={styles.contactContainer}>
            <Text style={styles.contactHeading}>{language.callUs}</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('tel:+01 9876543210')}>
              <Text style={styles.contactText}>+01 9876543210</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.contactRowContainer}>
          <View style={styles.contactContainer}>
            <Text style={styles.contactHeading}>{language.mailUs}</Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('mailto:msakenrealestate@dmail.com')
              }>
              <Text style={styles.contactText}>msakenrealestate@dmail.com</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactContainer}>
            <Text style={styles.contactHeading}>{language.followUs}</Text>
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.icon}
                //   onPress={() => {
                //     Linking.openURL(
                //       'https://www.facebook.com/B-onet-106814018379583/',
                //     )
                //   }}
              >
                <AwesomeIcon color={'black'} name="facebook" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.icon}
                //   onPress={() => {
                //     Linking.openURL('https://twitter.com/B_onet_?s=08')
                //   }}
              >
                <AwesomeIcon color={'black'} name="twitter" size={20} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.icon}
                //   onPress={() => {
                //     Linking.openURL('https://www.instagram.com/b_onet_/')
                //   }}
              >
                <AwesomeIcon color={'black'} name="instagram" size={20} />
              </TouchableOpacity>

              <TouchableOpacity>
                <FA5 color={'black'} name="youtube" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={[styles.button, {width: '90%', alignSelf: 'center'}]}>
          <Text style={styles.submitText}>{language.submit}</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 10,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  heading: {
    fontFamily: 'Roboto-Bold',
    fontSize: 21,
    marginBottom: 10,
  },
  secondHeading: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    margin: 10,
    backgroundColor: color.inputBgGrey,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 10,
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
    // flexBasis: '80%',
  },
  contactRowContainer: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  contactHeading: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    marginBottom: 10,
  },
  contactText: {
    fontFamily: 'Roboto-Regular',
    color: color.darkGrey,
    fontSize: 13,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 10,
  },
  button: {
    margin: 12,
    padding: 10,
    backgroundColor: color.themeRed,
    borderRadius: 40,
    justifyContent: 'center',
    marginTop: 15,
  },
  submitText: {
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 18,

    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Roboto-Medium',
  },
});

export default HelpUs;
