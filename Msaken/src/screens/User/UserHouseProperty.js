import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import colors from '../../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HouseSingleProperty from '../../components/Common/HouseSingleProperty';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthContext';
import {Card, Modal, Portal, Button} from 'react-native-paper';
import {useForm} from 'react-hook-form';
import Toast from 'react-native-simple-toast';
import Input from '../../components/Common/Input';
import MON from 'react-native-vector-icons/MaterialIcons';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FA5 from 'react-native-vector-icons/FontAwesome5';

const UserHouseProperty = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {p_id} = route.params;
  const {language, selectedLanguage} = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({});

  const [propertyData, setPropertyData] = useState([]);
  const {userCred, isSkip} = useContext(AuthContext);
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  const getSingleProperty = useCallback(async () => {
    setIsLoading(true);

    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/single-properties';
      let uploadData = new FormData();

      uploadData.append('p_id', p_id);
      uploadData.append(
        'userid',
        isSkip ? null : JSON.parse(userCred).data.user.id,
      );
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.status === false) {
        throw new Error(responseData.message);
      } else {
        setPropertyData(responseData?.data);
        console.log(responseData.data);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [isSkip, p_id, userCred]);
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
        setEmailModalVisible(false);
        reset();
      }
    } catch (error) {
      Alert.alert(error.message);
    }

    setIsLoading(false);
  };

  const emailModal = () => {
    return (
      <Portal>
        <Modal
          visible={emailModalVisible}
          onDismiss={() => {
            setEmailModalVisible(false), reset();
          }}
          contentContainerStyle={[styles.modalContainer]}>
          <View
            style={[
              styles.emailTitleContainer,
              selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
            ]}>
            <Text style={styles.emailTitle}>{language.contact}</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setEmailModalVisible(false), reset();
              }}
              style={[styles.closeIcon]}>
              <Icon name="close" size={15} color={colors.grey} />
            </TouchableOpacity>
          </View>

          <View style={{marginTop: 20, marginHorizontal: 20}}>
            <View style={styles.fieldView}>
              <Text
                style={[
                  styles.fieldTitle,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}>
                {language.name}
              </Text>
              <View
                style={[
                  styles.searchSection,
                  selectedLanguage === 'arabic' && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                {/* <MON
                style={styles.searchIcon}
                name="person"
                size={20}
                color={colors.themeRed}
              /> */}

                <Input
                  control={control}
                  style={[
                    styles.input,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}
                  name="name"
                  rules={{required: language.nameIsRequired}}
                  placeholder={language.enterName}
                />
              </View>
            </View>
            {errors.name && Toast.show(errors.name.message, Toast.SHORT)}
            {errors.email && Toast.show(errors.email.message, Toast.SHORT)}
            {errors.phone && Toast.show(errors.phone.message, Toast.SHORT)}
            {errors.message && Toast.show(errors.message.message, Toast.SHORT)}
            <View style={styles.fieldView}>
              <Text
                style={[
                  styles.fieldTitle,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}>
                {language.email}
              </Text>
              <View
                style={[
                  styles.searchSection,
                  selectedLanguage === 'arabic' && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                {/* <MON
                style={styles.searchIcon}
                name="mail"
                size={20}
                color={colors.themeRed}
              /> */}
                <Input
                  control={control}
                  style={[
                    styles.input,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}
                  name="email"
                  rules={{required: language.emailIsRequired}}
                  placeholder={language.enterEmail}
                  keyboardType="email-address"
                />
              </View>
            </View>
            <View style={styles.fieldView}>
              <Text
                style={[
                  styles.fieldTitle,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}>
                {language.phoneNumber}
              </Text>
              <View
                style={[
                  styles.searchSection,
                  selectedLanguage === 'arabic' && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                {/* <MON
                style={styles.searchIcon}
                name="call"
                size={20}
                color={colors.themeRed}
              /> */}
                <Input
                  control={control}
                  style={[
                    styles.input,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}
                  name="phone"
                  rules={{required: language.phoneNumberIsRequired}}
                  placeholder={language.enterPhoneNumber}
                  keyboardType={'phone-pad'}
                />
              </View>
            </View>
            <View style={styles.fieldView}>
              <Text
                style={[
                  styles.fieldTitle,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}>
                {language.message}
              </Text>
              <View
                style={[
                  styles.searchSection,
                  {borderRadius: 20, height: 120, alignItems: 'flex-start'},
                ]}>
                <Input
                  control={control}
                  style={[
                    styles.input,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}
                  name="message"
                  rules={{required: language.messageIsRequired}}
                  multiline={true}
                  placeholder=""
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={styles.button}>
              <Text style={styles.submitText}>{language.sendEmail}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    );
  };

  useFocusEffect(
    useCallback(() => {
      getSingleProperty();
      reset();
    }, [getSingleProperty, reset]),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={colors.themeRed} />
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={{marginBottom: 90}}>
        <HouseSingleProperty data={propertyData} />
      </View>
      <View style={styles.helpContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          // onPress={() =>
          //   Linking.openURL(`mailto:${propertyData.data.contact_email}`)
          // }
          onPress={() => setEmailModalVisible(true)}>
          <Icon name="chat" size={30} color={colors.themeRed} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() =>
            Linking.openURL(`tel:${propertyData.data.contact_phone}`)
          }>
          <Icon name="local-phone" size={30} color={colors.themeRed} />
        </TouchableOpacity>
      </View>

      {emailModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,

    backgroundColor: colors.themeWhite,
  },
  activity: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpContainer: {
    borderTopWidth: 1,
    borderColor: colors.inputBgGrey,
    flexDirection: 'row',
    margin: 20,
    paddingTop: 20,
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  modalContainer: {
    backgroundColor: colors.themeWhite,
    width: '95%',
    alignSelf: 'center',
  },
  emailTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#F2F2F2',
    height: 50,
    paddingHorizontal: 10,
  },
  emailTitle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Medium',
  },
  closeIcon: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 15,
    alignItems: 'center',
  },
  fieldView: {
    marginVertical: 5,
  },
  fieldTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: 'black',
    marginBottom: 5,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: colors.inputBgGrey,
    paddingHorizontal: 10,
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
    backgroundColor: colors.inputBgGrey,
    color: '#424242',
    fontFamily: 'Roboto-Regular',
    // flexBasis: '80%',
  },
  button: {
    margin: 12,
    padding: 10,
    backgroundColor: colors.themeRed,
    borderRadius: 40,
    justifyContent: 'center',
    marginTop: 15,
    width: '60%',
    alignSelf: 'center',
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

export default UserHouseProperty;
