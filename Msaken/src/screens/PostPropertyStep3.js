import React, {useState, useRef, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
  SafeAreaView,
  TextInput,
} from 'react-native';
import colors from '../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Card, Modal, Portal, Button} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useForm, Controller} from 'react-hook-form';
import {AuthContext} from '../context/AuthContext';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const PostPropertyStep3 = ({route, navigation}) => {
  const postPropertyData = route.params;
  const postPropertyStep1Data = postPropertyData.postPropertyStep1Data;
  const [sucessVisibile, setSucessVisible] = useState(false);

  const [unitAmenities, setUnitAminities] = useState([
    {id: 1, icon: 'house', name: 'New Construction', selected: false},
    {
      id: 2,
      icon: 'weekend',
      name: 'Furnished',
      selected: false,
    },
    {
      id: 3,
      icon: 'local-fire-department',
      name: 'Firepits',
      selected: false,
    },
    {
      id: 4,
      icon: 'store',
      name: 'Storage Space',
      selected: false,
    },
    {
      id: 5,
      icon: 'opacity',
      name: 'Water Access',
      selected: false,
    },
    {
      id: 6,
      icon: 'nature-people',
      name: 'Doorman',
      selected: false,
    },
    {
      id: 7,
      icon: 'person',
      name: 'Maid Room',
      selected: false,
    },
    {
      id: 8,
      icon: 'local-laundry-service',
      name: 'Laundry',
      selected: false,
    },
    {
      id: 9,
      icon: 'wifi',
      name: 'High Speed Internet',
      selected: false,
    },
    {
      id: 10,
      icon: 'padding',
      name: 'Dishwasher',
      selected: false,
    },
    {
      id: 11,
      icon: 'accessible',
      name: 'Chair Accessibility',
      selected: false,
    },
    {
      id: 12,
      icon: 'car-repair',
      name: 'Car Garage',
      selected: false,
    },
    {
      id: 13,
      icon: 'accessible',
      name: 'Semi Furnished',
      selected: false,
    },
    {
      id: 14,
      icon: 'format-color-fill',
      name: 'Renovated',
      selected: false,
    },
    {
      id: 15,
      icon: 'roofing',
      name: 'Smart Home',
      selected: false,
    },
    {
      id: 16,
      icon: 'directions-car',
      name: 'Private Parking',
      selected: false,
    },
    {
      id: 17,
      icon: 'local-florist',
      name: 'Garden',
      selected: false,
    },
    {
      id: 18,
      icon: 'elevator',
      name: 'Elevator',
      selected: false,
    },
  ]);
  const [communityAmenities, setCommunityAmenities] = useState([
    {
      id: 1,
      icon: 'pool',
      name: 'Swimming Pool',
    },
    {
      id: 2,
      icon: 'local-florist',
      name: 'Garden',
    },
    {
      id: 3,
      icon: 'support',
      name: 'Playing Area',
    },
    {
      id: 4,
      icon: 'fitness-center',
      name: 'Gym',
    },
    {
      id: 5,
      icon: 'directions-car',
      name: 'Parking',
    },
    {
      id: 6,
      icon: 'restaurant-menu',
      name: 'Restaurant',
    },
    {
      id: 7,

      icon: 'spa',
      name: 'Spa',
    },
    {
      id: 8,
      icon: 'school',
      name: 'School',
    },
    {
      id: 9,
      icon: 'local-hospital',
      name: 'Hospital',
    },
    {
      id: 10,
      icon: 'beach-access',
      name: 'Beach',
    },
    {
      id: 11,
      icon: 'local-cafe',
      name: 'Coffee Shop',
    },
    {
      id: 12,
      icon: 'local-mall',
      name: 'Mall',
    },
    {
      id: 13,
      icon: 'shopping-cart',
      name: 'Supermarket',
    },
    {
      id: 14,
      icon: 'library-books',
      name: 'Library',
    },
    {
      id: 15,
      icon: 'wb-shade',
      name: 'Mosque',
    },
    {
      id: 16,
      icon: 'movie-creation',
      name: 'Movie Theatre',
    },
    {
      id: 17,
      icon: 'broken-image',
      name: 'Landscape',
    },
  ]);
  const [addUnit, setAddUnit] = useState(false);
  const [unitAmenityMore, setUnitAmenityMore] = useState('');
  const [addCommunity, setAddCommunity] = useState(false);
  const [communityAmenityMore, setCommunityAmenityMore] = useState('');
  const {userCred, language, selectedLanguage} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [unit, setUnit] = useState([]);
  const [community, setCommunity] = useState([]);
  const [unitId, setUnitid] = useState(18);
  const [communityId, setCommunityId] = useState(17);

  const jsonUserCred = JSON.parse(userCred);
  const token = jsonUserCred.data.token;

  const addProperty = async data => {
    setLoading(true);
    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/add-propertyand';
      let uploadData = new FormData();

      uploadData.append(
        'property_for',
        postPropertyStep1Data.propertyFor === 'rent' ? 'rent' : 'sale',
      );
      uploadData.append('product_type', postPropertyStep1Data.PropertyType);
      uploadData.append(
        'p_location',

        postPropertyStep1Data.step1FieldData.propertyAddress,
      );
      uploadData.append('contact_name', postPropertyData.step2FieldData.name);
      uploadData.append('contact_phone', postPropertyData.step2FieldData.phone);
      uploadData.append('contact_email', postPropertyData.step2FieldData.email);
      uploadData.append(
        'name',
        postPropertyStep1Data.step1FieldData.propertyName,
      );
      uploadData.append(
        'description',
        postPropertyStep1Data.step1FieldData.description,
      );
      uploadData.append(
        'real_estage_age',
        postPropertyStep1Data.step1FieldData.realEstateAge,
      );
      uploadData.append(
        'price',
        postPropertyStep1Data.step1FieldData.propertyPrice,
      );
      uploadData.append('bedrooms', postPropertyStep1Data.bedrooms);
      uploadData.append('bathrooms', postPropertyStep1Data.bathrooms);
      uploadData.append('living_rooms', postPropertyStep1Data.livingrooms);
      uploadData.append('kitchens', postPropertyStep1Data.kitchens);
      uploadData.append(
        'land_area',
        postPropertyStep1Data.step1FieldData.landArea,
      );
      uploadData.append(
        'street_width',
        postPropertyStep1Data.step1FieldData.streetWidth,
      );
      uploadData.append(
        'b_direction',
        postPropertyStep1Data.step1FieldData.buildingDirection,
      );
      // postPropertyData.videoData?.uri &&
      //   uploadData.append(
      //     'video',

      //     {
      //       uri: postPropertyData.videoData?.uri,
      //       name: postPropertyData.videoData?.name,
      //       type: postPropertyData.videoData?.type,
      //     },
      //   );
      postPropertyData.videoUrl &&
        uploadData.append('video_url', postPropertyData.videoUrl);

      postPropertyData?.floorData?.uri &&
        uploadData.append('floorplan', {
          uri: postPropertyData.floorData?.uri,
          name: postPropertyData.floorData?.name,
          type: postPropertyData.floorData?.type,
        });

      postPropertyData.images.forEach(img =>
        uploadData.append('product_img[]', {
          uri: img.uri,
          name: img.fileName,
          type: img.type,
        }),
      );

      uploadData.append('longitude', postPropertyStep1Data.pinProperty.lng);
      uploadData.append('latitude', postPropertyStep1Data.pinProperty.lat);
      postPropertyStep1Data.propertyFor === 'rent' &&
        uploadData.append(
          'lease_duration',
          postPropertyStep1Data.step1FieldData.leaseDuration,
        );
      postPropertyStep1Data.propertyFor === 'rent' &&
        uploadData.append(
          'security_deposit',
          postPropertyStep1Data.step1FieldData.securityDeposit,
        );
      postPropertyStep1Data.propertyFor === 'rent' &&
        uploadData.append('date_pro', postPropertyStep1Data.date);
      uploadData.append('in_unit_amenities', `${unit}`);
      uploadData.append('comamenities', `${community}`);
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
        headers: headers,
      });

      const responseData = await response.json();
      if (responseData.status === false) {
        throw new Error(responseData.message);
      } else {
        // setLoading(false)
        setSucessVisible(true);
      }
    } catch (error) {
      Alert.alert(error.message);

      // setLoading(false)
    }
    setLoading(false);
  };

  const successModal = () => {
    return (
      <Portal>
        <Modal
          visible={sucessVisibile}
          onDismiss={() => setSucessVisible(false)}
          contentContainerStyle={[
            styles.modalContainer,
            {width: '90%', alignItems: 'center', padding: 15},
          ]}>
          <View style={styles.titleView}>
            <Text style={styles.title}>{language.msaken}</Text>
            <Text style={styles.subTitle}>{language.realEstate}</Text>
            <Text style={[styles.successMessage, {marginVertical: 20}]}>
              {language.thankYou}
            </Text>
            <Text style={styles.successMessage}>
              {language.yourPropertyUnderPendingApprovalMessage}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              jsonUserCred.data.user.role === 'buyer'
                ? navigation.navigate('userDashBoard')
                : navigation.navigate('myListing');
              setSucessVisible(false);
            }}
            style={[styles.applyButton]}>
            <Text style={styles.applyText}>{language.continue}</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>
    );
  };

  const propertyStep3 = data => {
    addProperty(data);
  };

  const addCommunityAmenity = name => {
    if (community.includes(name)) {
      setCommunity(prev => prev.filter(item => item !== name));
    } else {
      setCommunity(prev => prev.concat(name));
    }
  };
  const addUnitAmenity = name => {
    if (unit.includes(name)) {
      setUnit(prev => prev.filter(item => item !== name));
    } else {
      setUnit(prev => prev.concat(name));
    }
  };

  const addUnitAmenityMore = text => {
    setUnitAmenityMore(text);
  };

  const addCommunityAmenityMore = text => {
    setCommunityAmenityMore(text);
  };

  const UnitAmenityAdded = unitAdded => {
    const newUnit = {id: unitId + 1, name: unitAdded};
    setUnitid(prev => prev + 1);
    setUnitAminities([...unitAmenities, newUnit]);
    setAddUnit(false);
    setUnitAmenityMore('');
  };

  const CommunityAmenityAdded = communityAdded => {
    const newCommunity = {id: communityId + 1, name: communityAdded};
    setCommunityId(prev => prev + 1);
    setCommunityAmenities([...communityAmenities, newCommunity]);
    setAddCommunity(false);
    setCommunityAmenityMore('');
  };

  const addUnitAmenities = () => {
    return (
      <Portal>
        <Modal
          visible={addUnit}
          onDismiss={() => setAddUnit(false)}
          contentContainerStyle={[styles.modalContainer, {width: '80%'}]}>
          <View style={styles.unitTilteContainer}>
            <Text style={styles.modalTiltle}>{language.addAInUnitAmenity}</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setAddUnit(false)}
              style={[styles.closeIcon]}>
              <Icon name="close" size={15} color={colors.grey} />
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 10}}>
            <View style={styles.unitField}>
              <Text
                style={[styles.addUnitTitle, {fontSize: 18, marginRight: 5}]}>
                {'\u25CF'}
              </Text>
              <TextInput
                placeholder={language.addAUnitAmenity}
                style={styles.inputText}
                placeholderTextColor={Colors.darkGrey}
                onChangeText={addUnitAmenityMore}
                multiline={true}
                value={unitAmenityMore}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => UnitAmenityAdded(unitAmenityMore)}
              style={[styles.applyButton, {width: '50%'}]}
              disabled={unitAmenityMore === '' && true}>
              <Text style={styles.applyText}>{language.add}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    );
  };

  const addCommunityAmenities = () => {
    return (
      <Portal>
        <Modal
          visible={addCommunity}
          onDismiss={() => setAddCommunity(false)}
          contentContainerStyle={[styles.modalContainer, {width: '80%'}]}>
          <View style={styles.unitTilteContainer}>
            <Text style={styles.modalTiltle}>
              {language.addAInCommunityAmenity}
            </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setAddCommunity(false)}
              style={[styles.closeIcon]}>
              <Icon name="close" size={15} color={colors.grey} />
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 10}}>
            <View style={styles.unitField}>
              <Text
                style={[styles.addUnitTitle, {fontSize: 18, marginRight: 5}]}>
                {'\u25CF'}
              </Text>
              <TextInput
                placeholder={language.addACommunityAmenity}
                style={styles.inputText}
                placeholderTextColor={Colors.darkGrey}
                onChangeText={addCommunityAmenityMore}
                multiline={true}
                value={communityAmenityMore}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => CommunityAmenityAdded(communityAmenityMore)}
              style={[styles.applyButton, {width: '50%'}]}
              disabled={communityAmenityMore === '' && true}>
              <Text style={styles.applyText}>{language.add}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    );
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     setUnitAminities([
  //       {
  //         id: 1,
  //         icon: 'house',
  //         name: 'New Consturction',
  //         selected: false,
  //       },
  //       {
  //         id: 2,
  //         icon: 'weekend',
  //         name: 'Furnished',
  //         selected: false,
  //       },
  //       {
  //         id: 3,
  //         icon: 'local-fire-department',
  //         name: 'Firepits',
  //         selected: false,
  //       },
  //       {
  //         id: 4,
  //         icon: 'store',
  //         name: 'Storage Space',
  //         selected: false,
  //       },
  //       {
  //         id: 5,
  //         icon: 'opacity',
  //         name: 'Water Access',
  //         selected: false,
  //       },
  //       {
  //         id: 6,
  //         icon: 'nature-people',
  //         name: 'Doorman',
  //         selected: false,
  //       },
  //       {
  //         id: 7,
  //         icon: 'person',
  //         name: 'Maid room',
  //         selected: false,
  //       },
  //       {
  //         id: 8,
  //         icon: 'local-laundry-service',
  //         name: 'Laundry',
  //         selected: false,
  //       },
  //       {
  //         id: 9,
  //         icon: 'wifi',
  //         name: 'High Speed Internet',
  //         selected: false,
  //       },
  //       {
  //         id: 10,
  //         icon: 'padding',
  //         name: 'Dishwasher',
  //         selected: false,
  //       },
  //       {
  //         id: 11,
  //         icon: 'accessible',
  //         name: 'Chair Accessibility',
  //         selected: false,
  //       },
  //       {
  //         id: 12,
  //         icon: 'car-repair',
  //         name: 'Car Garage',
  //         selected: false,
  //       },
  //       {
  //         id: 13,
  //         icon: 'accessible',
  //         name: 'Semi Furnished',
  //         selected: false,
  //       },
  //       {
  //         id: 14,
  //         icon: 'format-color-fill',
  //         name: 'Renovated',
  //         selected: false,
  //       },
  //       {
  //         id: 15,
  //         icon: 'roofing',
  //         name: 'Smart Home',
  //         selected: false,
  //       },
  //       {
  //         id: 16,
  //         icon: 'directions-car',
  //         name: 'Private Parking',
  //         selected: false,
  //       },
  //       {
  //         id: 17,
  //         icon: 'local-florist',
  //         name: 'Garden',
  //         selected: false,
  //       },
  //       {
  //         id: 18,
  //         icon: 'elevator',
  //         name: 'Elevator',
  //         selected: false,
  //       },
  //     ]);

  //     setCommunityAmenities([
  //       {
  //         id: 1,
  //         icon: 'pool',
  //         name: 'Swimming Pool',
  //       },
  //       {
  //         id: 2,
  //         icon: 'local-florist',
  //         name: 'Garden',
  //       },
  //       {
  //         id: 3,
  //         icon: 'support',
  //         name: 'Playing Area',
  //       },
  //       {
  //         id: 4,
  //         icon: 'fitness-center',
  //         name: 'Gym',
  //       },
  //       {
  //         id: 5,
  //         icon: 'directions-car',
  //         name: 'Parking',
  //       },
  //       {
  //         id: 6,
  //         icon: 'restaurant-menu',
  //         name: 'Restaurant',
  //       },
  //       {
  //         id: 7,

  //         icon: 'spa',
  //         name: 'Spa',
  //       },
  //       {
  //         id: 8,
  //         icon: 'school',
  //         name: 'School',
  //       },
  //       {
  //         id: 9,
  //         icon: 'local-hospital',
  //         name: 'Hospital',
  //       },
  //       {
  //         id: 10,
  //         icon: 'beach-access',
  //         name: 'Beach',
  //       },
  //       {
  //         id: 11,
  //         icon: 'local-cafe',
  //         name: 'Coffee Shop',
  //       },
  //       {
  //         id: 12,
  //         icon: 'local-mall',
  //         name: 'Mall',
  //       },
  //       {
  //         id: 13,
  //         icon: 'shopping-cart',
  //         name: 'Supermarket',
  //       },
  //       {
  //         id: 14,
  //         icon: 'library-books',
  //         name: 'Library',
  //       },
  //       {
  //         id: 15,
  //         icon: 'wb-shade',
  //         name: 'Mosque',
  //       },
  //       {
  //         id: 16,
  //         icon: 'movie-creation',
  //         name: 'Movie Theatre',
  //       },
  //       {
  //         id: 17,
  //         icon: 'broken-image',
  //         name: 'Landscape',
  //       },
  //     ]);
  //     setUnit([]);
  //     setCommunity([]);
  //     setUnitAmenityMore('');
  //     setCommunityAmenityMore('');
  //   }, []),
  // );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={colors.themeRed} />
    </View>
  ) : (
    <ScrollView
      contentContainerStyle={styles.screen}
      keyboardShouldPersistTaps={'handled'}>
      <View>
        <View style={styles.descriptionContainer}>
          <Text
            style={[
              styles.descriptionTitle,
              {marginBottom: 10},
              selectedLanguage === 'arabic' && {textAlign: 'right'},
            ]}>
            {language.inUnitAmenities}
          </Text>
          <View style={styles.unitInnerrContainer}>
            {unitAmenities.map((item, index) => {
              return (
                <View key={item.id} style={styles.unitMainViews}>
                  <TouchableOpacity
                    style={styles.unitViews}
                    activeOpacity={0.6}
                    onPress={addUnitAmenity.bind(this, item.name)}>
                    {item.icon ? (
                      <Icon
                        name={item.icon}
                        color={
                          unit.includes(item.name)
                            ? colors.themeRed
                            : colors.grey
                        }
                        size={20}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.dot,
                          {
                            color: unit.includes(item.name)
                              ? colors.themeRed
                              : colors.darkGrey,
                          },
                        ]}>
                        {' '}
                        {'\u25CF'}{' '}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.unitText,
                        {
                          color: unit.includes(item.name)
                            ? colors.themeRed
                            : colors.grey,
                        },
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={[
              styles.addUnitContainer,
              {
                flexDirection:
                  selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
              },
            ]}
            activeOpacity={0.6}
            onPress={() => setAddUnit(true)}>
            <Icon name="add" size={20} color={colors.themeRed} />
            <Text style={styles.addUnitTitle}>
              {language.addMoreInUnitAmenities}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.descriptionContainer, {marginVertical: 10}]}>
          <Text
            style={[
              styles.descriptionTitle,
              {marginBottom: 10},
              selectedLanguage === 'arabic' && {textAlign: 'right'},
            ]}>
            {language.communityAmenities}
          </Text>
          <View style={styles.unitInnerrContainer}>
            {communityAmenities.map((item, index) => {
              return (
                <View key={item.id} style={styles.unitMainViews}>
                  <TouchableOpacity
                    style={styles.unitViews}
                    activeOpacity={0.6}
                    onPress={addCommunityAmenity.bind(this, item.name)}>
                    {item.icon ? (
                      <Icon
                        name={item.icon}
                        color={
                          community.includes(item.name)
                            ? colors.themeRed
                            : colors.darkGrey
                        }
                        size={20}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.dot,
                          {
                            color: community.includes(item.name)
                              ? colors.themeRed
                              : colors.darkGrey,
                          },
                        ]}>
                        {' '}
                        {'\u25CF'}{' '}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.unitText,
                        {
                          color: community.includes(item.name)
                            ? colors.themeRed
                            : colors.darkGrey,
                        },
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={[
              styles.addUnitContainer,

              selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
            ]}
            activeOpacity={0.6}
            onPress={() => setAddCommunity(true)}>
            <Icon name="add" size={20} color={colors.themeRed} />
            <Text style={styles.addUnitTitle}>
              {language.addMoreCommunityAmenities}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={propertyStep3}
          style={styles.applyButton}>
          <Text style={styles.applyText}>{language.publish}</Text>
        </TouchableOpacity>
        {addUnitAmenities()}
        {addCommunityAmenities()}
        {successModal()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    // flex: 1,
    backgroundColor: colors.themeWhite,
  },

  inputText: {
    fontSize: 14,
    color: colors.darkGrey,
    fontFamily: 'Roboto-Regular',
    flexBasis: '90%',
  },
  priceText: {
    fontSize: 14,
    color: colors.grey,
    alignSelf: 'center',
    marginRight: 10,
  },

  applyButton: {
    backgroundColor: colors.themeRed,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'center',
    borderRadius: 30,
    marginVertical: 10,
  },
  applyText: {
    color: colors.themeWhite,
    fontSize: 14,
    // fontWeight: 'bold',
    fontFamily: 'Roboto_Bold',
  },

  modalContainer: {
    backgroundColor: colors.themeWhite,
    width: '90%',
    alignSelf: 'center',
  },
  modalTilteContainer: {
    backgroundColor: colors.inputBgGrey,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
  },
  modalTiltle: {
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

  alertHeading: {
    fontSize: 20,

    fontFamily: 'Roboto-Regular',
  },
  modalButtonsContainer: {
    marginTop: 20,
  },
  imagepickerMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginHorizontal: 10,
  },

  descriptionContainer: {
    paddingHorizontal: 10,

    marginTop: 20,

    paddingTop: 10,
  },
  descriptionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  unitInnerContainer: {
    width: '50%',
    marginHorizontal: 5,
  },
  unitInnerrContainer: {
    flexDirection: 'row',
    // marginHorizontal: 5,
    flexWrap: 'wrap',
  },
  unitViews: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginVertical: 8,
    width: '95%',
    // backgroundColor: 'red',
  },
  unitMainViews: {
    width: '50%',
    // paddingHorizontal: 10,
  },
  unitText: {
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'Roboto-Regular',
    width: '85%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bedroomText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  propertyImage: {
    marginRight: 2,
    width: 17,
    height: 17,
  },
  addUnitContainer: {
    marginTop: 10,
    alignItems: 'center',
    // marginHorizontal: 10,
  },
  addUnitTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: colors.themeRed,
  },
  unitTilteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#F2F2F2',
    height: 50,
    paddingHorizontal: 10,
  },
  unitField: {
    backgroundColor: colors.inputBgGrey,
    marginVertical: 20,
    width: '90%',
    alignSelf: 'center',
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: colors.inputBgGrey,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Roboto_Bold',
    color: colors.themeRed,
  },
  subTitle: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: '#3B3B3B',
    letterSpacing: 2,
  },
  titleView: {alignItems: 'center', marginVertical: 20},
  successMessage: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  dot: {
    fontFamily: 'Roboto_Bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default PostPropertyStep3;
