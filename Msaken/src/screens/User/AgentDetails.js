import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Linking,
  TextInput,
  Share,
} from 'react-native';
import color from '../../common/colors';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import MON from 'react-native-vector-icons/MaterialIcons';
import SliderComp from '../../components/Common/SliderComp';
import AgentHouseDetails from '../../components/Common/AgentHouseDetails';
import dayjs from 'dayjs';
import {AuthContext} from '../../context/AuthContext';
import {SliderBox} from 'react-native-image-slider-box';
import Toast from 'react-native-simple-toast';
import {Card, Modal, Portal, Button} from 'react-native-paper';
import {useForm} from 'react-hook-form';
import Input from '../../components/Common/Input';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const AgentDetails = ({route, navigation}) => {
  const [agentData, setAgentData] = useState([]);
  const [agentDetails, setAgentDetails] = useState([]);
  const {userCred, language, isSkip, selectedLanguage} =
    useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({});
  const id = route.params;
  const [isLoading, setLoading] = useState(false);

  const [propertyFor, setPropertyFor] = useState('rent');
  const [propertyData, setpropertyData] = useState([]);
  const images = [require('../../assets/placeholder.jpg')];
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  const ShareProperty = shareLink => {
    Share.share({
      message: shareLink,
    });
  };

  const getAgent = useCallback(async () => {
    setLoading(true);

    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/get-agent-details';
      let formdata = new FormData();

      formdata.append('id', id);
      formdata.append(
        'userid',
        isSkip ? null : JSON.parse(userCred).data.user.id,
      );

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: formdata,
      });

      const responseData = await response.json();

      setAgentDetails(responseData.data);
      setAgentData(responseData.data.user);
      setpropertyData(responseData.data.propertyrent);
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }, [id, isSkip, userCred]);

  const likeHandler = async (id, likeStatus) => {
    const jsonUserCred = JSON.parse(userCred);
    const token = jsonUserCred.data.token;
    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/red-heart-like-dislike';

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      let formdata = new FormData();
      formdata.append('id', id);
      formdata.append('like_status', likeStatus);

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
        const updatedProperty = propertyData.map(item => {
          if (item.id === id) {
            return {...item, likestatus: likeStatus};
          }
          return item;
        });
        setpropertyData(updatedProperty);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const skipLikeHandler = (id, likeStatus) => {
    Toast.show(
      language.pleaseLoginYourAccountToLikeThePropertyThanks,
      Toast.SHORT,
    );
  };

  const skipAgentLikeHandler = () => {
    Toast.show(
      language.pleaseLoginYourAccountToLikeTheAgentThanks,
      Toast.SHORT,
    );
  };

  const agentLikeHandler = async () => {
    const jsonUserCred = JSON.parse(userCred);
    const token = jsonUserCred.data.token;

    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/red-heart-like-user';

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      let formdata = new FormData();
      formdata.append('id', agentData?.id);
      // formdata.append('userid', jsonUserCred.data.user.id);

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
        setAgentData(prev => {
          return {...prev, likestatus: prev.likestatus == 0 ? 1 : 0};
        });
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const onSubmit = async data => {
    setLoading(true);

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

    setLoading(false);
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
              <Icon name="close" size={15} color={color.grey} />
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

  // useEffect(() => {
  //   getAgent();
  //   return setPropertyFor('rent');
  // }, [getAgent]);

  useFocusEffect(
    useCallback(() => {
      reset();
      getAgent();
      return setPropertyFor('rent');
    }, [getAgent, reset]),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={color.themeRed} />
    </View>
  ) : (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{paddingBottom: 60}}>
        <SliderBox
          images={
            agentData?.coverimage
              ? [
                  {
                    uri: `https://xionex.in/msaken/admin/public/uploads/products/${agentData?.coverimage}`,
                  },
                ]
              : images
          }
          ImageComponentStyle={{width: '100%', height: 250}}
          activeOpacity={0.6}
          // autoplay={true}
          circleLoop={true}
          dotColor={color.themeRed}
          inactiveDotColor={color.themeWhite}
          dotStyle={{
            marginHorizontal: -15,
          }}
        />
        <View style={styles.mainContainer}>
          <View style={styles.apatmentContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{agentData?.full_name}</Text>
              <View style={styles.addressContainer}>
                <MON name="location-on" size={20} color={color.themeRed} />
                <Text style={styles.address}>{agentData?.company_add}</Text>
              </View>
            </View>
            <View style={styles.socialContainer}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={isSkip ? skipAgentLikeHandler : agentLikeHandler}
                style={styles.icon}>
                {agentData?.likestatus == 1 ? (
                  <MON name="favorite" color={color.themeRed} size={23} />
                ) : (
                  <MON
                    name="favorite-border"
                    color={color.themeRed}
                    size={23}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() =>
                  ShareProperty(
                    `https://xionex.in/msaken/#/agentdetails/id/${agentData?.id}`,
                  )
                }
                style={styles.icon}>
                <MON name="share" color={color.darkGrey} size={23} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.houseInfoContainer}>
            <View style={styles.infoView}>
              <Text style={styles.infoTitle}>
                {language.since}{' '}
                {dayjs(agentDetails?.created_at).format('YYYY')}
              </Text>
              <Text style={styles.infoSubTitle}>{language.withUs}</Text>
            </View>
            <View
              style={[
                styles.infoView,
                {borderLeftWidth: 1, borderLeftColor: color.inputBgGrey},
              ]}>
              <Text style={styles.infoTitle}>
                {agentDetails?.propertycount} {language.listings}
              </Text>
              <Text style={styles.infoSubTitle}>{language.published}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setPropertyFor('rent'), setpropertyData(agentData.propertyrent);
              }}
              style={[
                styles.buttonView,
                propertyFor === 'rent' && styles.redButtonView,
              ]}>
              <Text
                style={[
                  {
                    fontSize: 16,
                    fontFamily: 'Roboto-Medium',
                    fontWeight: 'bold',
                  },
                  propertyFor === 'rent' && {color: color.themeWhite},
                ]}>
                {language.forRent}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setPropertyFor('sale');
                setpropertyData(agentDetails.propertysale);
              }}
              style={[
                styles.buttonView,
                propertyFor === 'sale' && styles.redButtonView,
              ]}>
              <Text
                style={[
                  {
                    fontSize: 16,
                    fontFamily: 'Roboto-Medium',
                    fontWeight: 'bold',
                  },
                  propertyFor === 'sale' && {color: color.themeWhite},
                ]}>
                {language.forSale}
              </Text>
            </TouchableOpacity>
          </View>
          <AgentHouseDetails
            data={propertyData?.length > 0 ? propertyData : []}
            style={propertyData?.length > 0 && {height: '40%'}}
            likeHandler={isSkip ? skipLikeHandler : likeHandler}
            agent={true}
          />
        </View>
      </ScrollView>
      <View style={styles.helpMainContainer}>
        <View style={styles.helpContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setEmailModalVisible(true)}>
            <MON name="chat" size={30} color={color.themeRed} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => Linking.openURL(`tel:${agentData?.mobile_no}`)}>
            <MON name="local-phone" size={30} color={color.themeRed} />
          </TouchableOpacity>
        </View>
      </View>

      {emailModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  activity: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: color.themeWhite,
  },
  screen: {
    flexGrow: 1,
    backgroundColor: color.themeWhite,
  },
  mainContainer: {
    marginVertical: 10,
  },
  apatmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  titleContainer: {
    width: '80%',
  },

  title: {fontWeight: 'bold', fontSize: 16, fontFamily: 'Roboto-Medium'},
  addressContainer: {
    marginTop: 5,
    flexDirection: 'row',
    // alignItems: 'center',
  },
  address: {
    fontSize: 14,
    color: color.darkGrey,
    fontFamily: 'Roboto-Regular',
  },
  socialContainer: {
    width: '20%',
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 5,
  },
  houseInfoContainer: {
    marginVertical: 5,
    marginRight: -10,
    borderWidth: 2,
    borderRadius: 30,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: color.inputBgGrey,
    paddingVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  infoView: {
    alignItems: 'center',
    width: '50%',
    justifyContent: 'center',
  },

  infoTitle: {
    fontSize: 14,
    color: color.themeRed,
    fontFamily: 'Roboto-Medium',
  },
  infoSubTitle: {
    fontSize: 12,
    color: color.darkGrey,
    fontFamily: 'Roboto-Regular',
  },
  buttonContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 30,
    width: '80%',

    justifyContent: 'center',
    borderWidth: 1,
    borderColor: color.lightGrey,
    alignItems: 'center',
  },
  buttonView: {
    width: '50%',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10,

    justifyContent: 'center',
  },
  redButtonView: {
    backgroundColor: color.themeRed,
    borderRadius: 20,
  },
  helpMainContainer: {
    position: 'absolute',
    backgroundColor: color.themeWhite,
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
  },
  helpContainer: {
    borderTopWidth: 1,
    borderColor: color.inputBgGrey,
    flexDirection: 'row',
    margin: 10,
    paddingTop: 10,
    justifyContent: 'space-around',
  },
  modalContainer: {
    backgroundColor: color.themeWhite,
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
    borderColor: color.grey,
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
    backgroundColor: color.inputBgGrey,
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
    backgroundColor: color.inputBgGrey,
    color: '#424242',
    fontFamily: 'Roboto-Regular',
    // flexBasis: '80%',
  },
  button: {
    margin: 12,
    padding: 10,
    backgroundColor: color.themeRed,
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

export default AgentDetails;
