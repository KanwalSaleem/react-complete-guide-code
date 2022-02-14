import React, {useState, useContext, useCallback, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import colors from '../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Card, Modal, Portal, Button} from 'react-native-paper';
import MapView from 'react-native-maps';
import CheckBox from 'react-native-check-box';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useForm, Controller, useWatch} from 'react-hook-form';
import Input from '../components/Common/Input';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import RNPickerSelect from 'react-native-picker-select';
import color from '../common/colors';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import RNLocation from 'react-native-location';

const PostPropertyStep1 = ({route, navigation}) => {
  const {language, selectedLanguage} = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: {isValid, errors},
    watch,
    register,
    reset,
    setValue,
    clearErrors,
  } = useForm({
    mode: 'all',
  });

  const estateAge = [
    {label: '45-50 years', value: '45-50 years'},
    {label: '40-45 years', value: '40-45 years'},
    {label: '35-40 years', value: '35-40 years'},
    {label: '30-35 years', value: '30-35 years'},
    {label: '25-30 years', value: '25-30 years'},
    {label: '20-25 years', value: '20-25 years'},
    {label: '15-20 years', value: '15-20 years'},
    {label: '10-15 years', value: '10-15 years'},
    {label: '5-10 years', value: '5-10 years'},
    {label: '2-5 years', value: '2-5 years'},
    {label: 'New', value: 'New'},
  ];

  const leasePicker = [
    {label: '5 years', value: '5 years'},
    {label: '4 years', value: '4 years'},
    {label: '3 years', value: '3 years'},
    {label: '2 years', value: '2 years'},
    {label: '1 years', value: '1 years'},
  ];

  const buildingValues = [
    {label: 'North', value: 'North'},
    {label: 'South', value: 'South'},
    {label: 'East', value: 'East'},
    {label: 'West', value: 'West'},
  ];

  const [date, setDate] = useState('');
  const [showDate, setShowDate] = useState(false);

  const [pinProperty, setPinProperty] = useState();
  const [autoAddress, setAutoAddress] = useState('o');
  const [propertyFor, setPropertyFor] = useState('rent');
  const [PropertyType, setPropertyType] = useState('Offices');
  const [Bedrooms, setBedrooms] = useState(1);
  const [Bathrooms, setBathrooms] = useState(1);
  const [Kitchen, setKitchen] = useState(1);
  const [Livingrooms, setLivingrooms] = useState(1);
  const [BedroomsSelected, setSelectedBedroom] = useState([]);
  const [BathroomsSelected, setSelectedBathrooms] = useState([]);
  const [KitchensSelected, setSelectedKitchens] = useState([]);
  const [LivingroomsSelected, setSelectedLivingrooms] = useState([]);
  const [moreBedrooms, setMoreBedrooms] = useState(false);
  const [moreBathrooms, setMoreBathrooms] = useState(false);
  const [moreKitchens, setMoreKitchens] = useState(false);
  const [moreLivingrooms, setMoreLivingrooms] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [estateModalVisible, setEstateModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const focusRef = useRef();

  const getLocation = () => {
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
        rationale: {
          title: 'Location permission',
          message:
            'Need Location Permission for searching nearest Properties to you',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      },
    })
      .then(granted => {
        RNLocation.configure({
          distanceFilter: 5.0,
        });
        if (granted) {
          RNLocation.getLatestLocation({timeout: 60000})
            .then(latestLocation => {
              console.log(latestLocation);

              setPinProperty({
                lng: latestLocation.longitude,
                lat: latestLocation.latitude,
              });
              return latestLocation;
            })
            .then(location =>
              fetch(
                `https://us1.locationiq.com/v1/reverse.php?key=pk.bd733b0aaf436f3ad0ef530a41ab5ee3&lat=${location.latitude}&lon=${location.longitude}&format=json`,
              ),
            )
            .then(res => res.json())
            .then(resData => {
              setAutoAddress(resData.display_name);
              setValue('propertyAddress', resData.display_name);
            })
            .catch(e => console.log(e));
        }
      })

      .catch(e => console.log(e));
  };

  const SelectPropertyType = selected => {
    setPropertyType(selected);
  };

  const setBedRoom = selectedBedroom => {
    setBedrooms(selectedBedroom);
    var newindex = selectedBedroom - 1;
    var obj = [];
    BedroomsSelected.map((value, index) => {
      if (index === newindex) {
        obj.push(true);
      } else {
        obj.push(false);
      }
    });
    setSelectedBedroom(obj);
  };

  const setBathRoom = selectedBathroom => {
    setBathrooms(selectedBathroom);
    var newindex = selectedBathroom - 1;
    var obj = [];
    BathroomsSelected.map((value, index) => {
      if (index === newindex) {
        obj.push(true);
      } else {
        obj.push(false);
      }
    });
    setSelectedBathrooms(obj);
  };
  const setKitchens = selectedKitchen => {
    setKitchen(selectedKitchen);
    var newindex = selectedKitchen - 1;
    var obj = [];
    KitchensSelected.map((value, index) => {
      if (index === newindex) {
        obj.push(true);
      } else {
        obj.push(false);
      }
    });
    setSelectedKitchens(obj);
  };
  const setLivingRoom = selectedLivingroom => {
    setLivingrooms(selectedLivingroom);
    var newindex = selectedLivingroom - 1;
    var obj = [];
    LivingroomsSelected.map((value, index) => {
      if (index === newindex) {
        obj.push(true);
      } else {
        obj.push(false);
      }
    });
    setSelectedLivingrooms(obj);
  };

  const FetchCoordinates = async description => {
    try {
      let base_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${description}&key=AIzaSyD6H1cGAMzHOID3_rSUMB7Uxx1CE0SlP0c`;

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'get',
      });

      const responseData = await response.json();

      if (responseData.status != 'OK') {
        throw new Error(responseData.error_message);
      }

      console.log(responseData);
      const result = responseData.results;
      console.log(result[0]);
      console.log(result[0].geometry.location);
      setPinProperty(result[0].geometry.location);
    } catch (error) {
      Alert.alert(error.message);
      console.log(error.message);
    }
  };

  // const onDateChange = (e, selectedDate) => {
  //   console.log('yes',selectedDate );
  //   if (Platform.OS === 'ios') {
  //     try {
  //       setShowDate(true);

  //       if (selectedDate) {
  //         setDate(selectedDate);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   } else {
  //     if (selectedDate) {
  //       setShowDate(false);
  //       setDate(selectedDate);
  //     }
  //   }
  // };
  const onDateChange = (e, dateValue) => {
    try {
      setShowDate(Platform.OS === 'ios');
      if (dateValue) {
        if (Platform.OS === 'ios') {
          setSelectedDate(dateValue);
        } else {
          setDate(dateValue);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const dateSelected = () => {
    if (selectedDate) {
      setDate(selectedDate);
    } else {
      setDate(new Date());
    }

    setShowDate(false);
  };

  const selectLocation = event => {
    const latitude = event.nativeEvent.coordinate.latitude;
    const longitude = event.nativeEvent.coordinate.longitude;

    setPinProperty({lat: latitude, lng: longitude});
    fetch(
      `https://us1.locationiq.com/v1/reverse.php?key=pk.bd733b0aaf436f3ad0ef530a41ab5ee3&lat=${latitude}&lon=${longitude}&format=json`,
    )
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(res => {
        setAutoAddress(res.display_name);
        setValue('propertyAddress', res.display_name);

        console.log(res.display_name);
        // setPinProperty(res.display_name)
      })
      .catch(e => console.log(e));
  };

  const onSubmit = data => {
    !date ? setDateError(true) : setDateError(false);
    propertyFor === 'rent'
      ? date &&
        autoAddress &&
        navigation.navigate(
          'postPropertyStep2',

          {
            step1FieldData: data,
            propertyFor: propertyFor,
            PropertyType,
            date: `${JSON.parse(JSON.stringify(date))}`,
            bedrooms: Bedrooms,
            bathrooms: Bathrooms,
            livingrooms: Livingrooms,
            kitchens: Kitchen,
            pinProperty: pinProperty,
          },
        )
      : autoAddress &&
        navigation.navigate(
          'postPropertyStep2',

          {
            step1FieldData: data,
            propertyFor: propertyFor,
            PropertyType,
            date: `${JSON.parse(JSON.stringify(date))}`,
            bedrooms: Bedrooms,
            bathrooms: Bathrooms,
            livingrooms: Livingrooms,
            kitchens: Kitchen,
            pinProperty: pinProperty,
          },
        );
  };

  const realEstateModal = () => {
    return (
      <Portal>
        <Modal
          visible={estateModalVisible}
          onDismiss={() => setEstateModalVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Text style={styles.alertHeading}>{language.chooseAnOption}</Text>
          <View style={styles.modalButtonsContainer}></View>
        </Modal>
      </Portal>
    );
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params?.reset) {
        setSelectedDate('');
        setMoreBedrooms(false);
        setMoreBathrooms(false);
        setMoreKitchens(false);
        setMoreLivingrooms(false);
        setPropertyType('Offices'), setDate('');
        setAutoAddress('');
        setPropertyFor('rent');
        setPinProperty();

        setBathrooms(1);
        setKitchen(1);
        setLivingrooms(1);

        setSelectedBedroom([
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ]);
        setSelectedBathrooms([
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ]);
        setSelectedKitchens([
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ]);
        setSelectedLivingrooms([
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ]);
        clearErrors();
        reset({
          leaseDuration: '',
          realEstateAge: '',
          buildingDirection: '',
        });
      }
      return () => navigation.setParams({reset: false});
    }, [clearErrors, navigation, reset, route.params?.reset]),
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps={'handled'}>
        <View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setPropertyFor('rent')}
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
                  propertyFor === 'rent' && {color: colors.themeWhite},
                ]}>
                {language.forRent}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setPropertyFor('sale')}
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
                  propertyFor === 'sale' && {color: colors.themeWhite},
                ]}>
                {language.forSale}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.propertyContainer}>
            <Text
              style={[
                styles.propertyTitle,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.propertyType}
            </Text>
            <View
              style={[
                styles.propertyInnerContainer,
                selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
              ]}>
              <Card
                style={[
                  styles.propertyMainView,
                  PropertyType === 'Homes' && {
                    backgroundColor: colors.themeRed,
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => SelectPropertyType('Homes')}
                  style={[
                    styles.propertyView,
                    selectedLanguage === 'arabic' && {
                      flexDirection: 'row-reverse',
                    },
                  ]}>
                  <Image
                    source={
                      PropertyType === 'Homes'
                        ? require('../assets/home.png')
                        : require('../assets/home-gray.png')
                    }
                    style={styles.propertyImage}
                  />
                  <Text
                    style={[
                      styles.propertyText,
                      PropertyType === 'Homes' && {color: colors.themeWhite},
                    ]}>
                    {language.homes}
                  </Text>
                </TouchableOpacity>
              </Card>
              <Card
                style={[
                  styles.propertyMainView,
                  PropertyType === 'Apartments' && {
                    backgroundColor: colors.themeRed,
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => SelectPropertyType('Apartments')}
                  style={[
                    styles.propertyView,
                    selectedLanguage === 'arabic' && {
                      flexDirection: 'row-reverse',
                    },
                  ]}>
                  <Image
                    source={
                      PropertyType === 'Apartments'
                        ? require('../assets/apartments.png')
                        : require('../assets/apartments_gray.png')
                    }
                    style={styles.propertyImage}
                  />
                  <Text
                    style={[
                      styles.propertyText,
                      PropertyType === 'Apartments' && {
                        color: colors.themeWhite,
                      },
                    ]}>
                    {language.apartments}
                  </Text>
                </TouchableOpacity>
              </Card>
              <Card
                style={[
                  styles.propertyMainView,
                  PropertyType === 'Offices' && {
                    backgroundColor: colors.themeRed,
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => SelectPropertyType('Offices')}
                  style={[
                    styles.propertyView,
                    selectedLanguage === 'arabic' && {
                      flexDirection: 'row-reverse',
                    },
                  ]}>
                  <Image
                    source={
                      PropertyType === 'Offices'
                        ? require('../assets/office.png')
                        : require('../assets/office_gray.png')
                    }
                    style={styles.propertyImage}
                  />
                  <Text
                    style={[
                      styles.propertyText,
                      PropertyType === 'Offices' && {
                        color: colors.themeWhite,
                      },
                    ]}>
                    {language.offices}
                  </Text>
                </TouchableOpacity>
              </Card>
            </View>
            <View
              style={[
                styles.propertyInnerContainer,
                selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
              ]}>
              <Card
                style={[
                  styles.propertyMainView,
                  PropertyType === 'Retail' && {
                    backgroundColor: colors.themeRed,
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => SelectPropertyType('Retail')}
                  style={[
                    styles.propertyView,
                    selectedLanguage === 'arabic' && {
                      flexDirection: 'row-reverse',
                    },
                  ]}>
                  <Image
                    source={
                      PropertyType === 'Retail'
                        ? require('../assets/retail.png')
                        : require('../assets/retail_gray.png')
                    }
                    style={styles.propertyImage}
                  />
                  <Text
                    style={[
                      styles.propertyText,
                      PropertyType === 'Retail' && {color: colors.themeWhite},
                    ]}>
                    {language.retail}
                  </Text>
                </TouchableOpacity>
              </Card>

              <Card
                style={[
                  styles.propertyMainView,
                  PropertyType === 'Land' && {
                    backgroundColor: colors.themeRed,
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => SelectPropertyType('Land')}
                  style={[
                    styles.propertyView,
                    selectedLanguage === 'arabic' && {
                      flexDirection: 'row-reverse',
                    },
                  ]}>
                  <Image
                    source={
                      PropertyType === 'Land'
                        ? require('../assets/land.png')
                        : require('../assets/land_gray.png')
                    }
                    style={styles.propertyImage}
                  />
                  <Text
                    style={[
                      styles.propertyText,
                      PropertyType === 'Land' && {color: colors.themeWhite},
                    ]}>
                    {language.land}
                  </Text>
                </TouchableOpacity>
              </Card>
              <Card
                style={[
                  styles.propertyMainView,
                  PropertyType === 'Industry' && {
                    backgroundColor: colors.themeRed,
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => SelectPropertyType('Industry')}
                  style={[
                    styles.propertyView,
                    selectedLanguage === 'arabic' && {
                      flexDirection: 'row-reverse',
                    },
                  ]}>
                  <Image
                    source={
                      PropertyType === 'Industry'
                        ? require('../assets/industry.png')
                        : require('../assets/industry_gray.png')
                    }
                    style={styles.propertyImage}
                  />
                  <Text
                    style={[
                      styles.propertyText,
                      PropertyType === 'Industry' && {
                        color: colors.themeWhite,
                      },
                    ]}>
                    {language.industry}
                  </Text>
                </TouchableOpacity>
              </Card>
            </View>
            <View
              style={[
                styles.propertyInnerContainer,
                selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
              ]}>
              <Card
                style={[
                  styles.propertyMainView,
                  PropertyType === 'Warehouse' && {
                    backgroundColor: colors.themeRed,
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => SelectPropertyType('Warehouse')}
                  style={[
                    styles.propertyView,
                    selectedLanguage === 'arabic' && {
                      flexDirection: 'row-reverse',
                    },
                  ]}>
                  <Image
                    source={
                      PropertyType === 'Warehouse'
                        ? require('../assets/warehouse.png')
                        : require('../assets/warehouse_gray.png')
                    }
                    style={styles.propertyImage}
                  />
                  <Text
                    style={[
                      styles.propertyText,
                      PropertyType === 'Warehouse' && {
                        color: colors.themeWhite,
                      },
                    ]}>
                    {language.warehouse}
                  </Text>
                </TouchableOpacity>
              </Card>
            </View>
          </View>
          <View
            style={[
              styles.propertyNameContainer,
              errors.propertyName && styles.redBorder,
            ]}>
            <Input
              autoFocus={true}
              ref={focusRef}
              placeholder={language.propertyName}
              name="propertyName"
              control={control}
              rules={{required: true}}
              style={[
                styles.inputText,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}
              placeholderTextColor={Colors.darkGrey}
            />
          </View>

          <Text
            style={[
              styles.pinTitle,
              selectedLanguage === 'arabic' && {textAlign: 'right'},
            ]}>
            {language.pinTheProperty}
          </Text>

          <MapView
            style={{
              flex: 1,
              minHeight: 220,
              width: '90%',
              height: 220,
              marginTop: 10,
              alignSelf: 'center',
            }}
            onMapReady={() => setMapReady(true)}
            loadingEnabled={true}
            region={{
              latitude: pinProperty?.lat ? pinProperty.lat : 37.42220190984646,
              longitude: pinProperty?.lng
                ? pinProperty.lng
                : -122.08407897306436,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={selectLocation}
            initialRegion={{
              latitude: pinProperty?.lat ? 24.585445 : 37.42220190984646,
              longitude: pinProperty?.lng ? 73.712479 : -122.08407897306436,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            {mapReady && (
              <MapView.Marker
                coordinate={{
                  latitude: pinProperty?.lat
                    ? pinProperty.lat
                    : 37.42220190984646,
                  longitude: pinProperty?.lng
                    ? pinProperty.lng
                    : -122.08407897306436,
                }}
              />
            )}
          </MapView>
          <View
            style={[
              styles.typingContainer,
              {
                flexDirection:
                  selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
              },
            ]}>
            <ScrollView
              keyboardShouldPersistTaps={'always'}
              contentContainerStyle={{
                width: '100%',
              }}>
              <GooglePlacesAutocomplete
                nestedScrollEnabled={true}
                autoFocus={false}
                textInputProps={{
                  placeholderTextColor: colors.grey,
                  color: colors.grey,
                  returnKeyType: 'next',
                  fontSize: 14,
                  multiline: true,
                  fontFamily: 'Roboto-Regular',
                  value: autoAddress,
                  onChangeText: setAutoAddress,
                }}
                styles={{listView: {maxHeight: 150, width: '100%'}}}
                listViewDisplayed={false}
                placeholder={language.searchAdddress}
                placeholderTextColor={colors.lightGrey}
                onPress={data => {
                  console.log(data.description);
                  FetchCoordinates(data.description);
                  setAutoAddress(data.description);
                }}
                query={{
                  key: 'AIzaSyD6H1cGAMzHOID3_rSUMB7Uxx1CE0SlP0c',
                  language: 'en',
                }}
              />
            </ScrollView>
            <View
              style={[
                styles.iconContainer,
                {
                  flexDirection:
                    selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                },
              ]}>
              <TouchableOpacity onPress={() => getLocation()}>
                <Icon name="my-location" size={18} color={colors.lightGrey} />
              </TouchableOpacity>
              <Icon
                name="search"
                size={20}
                color={colors.lightGrey}
                style={{paddingLeft: 4}}
              />
            </View>
          </View>
          <View
            style={[
              styles.propertyNameContainer,
              errors.propertyAddress && styles.redBorder,
            ]}>
            <Input
              control={control}
              rules={{required: true}}
              placeholder={language.propertyAddress}
              name="propertyAddress"
              style={[
                styles.inputText,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}
              placeholderTextColor={Colors.darkGrey}
            />
          </View>

          {propertyFor === 'rent' ? (
            <View
              style={[
                styles.propertyNameContainer,
                {
                  flexDirection:
                    selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                  justifyContent: 'space-between',
                },
                errors.propertyPrice && styles.redBorder,
              ]}>
              <Input
                placeholder={language.rentPrice}
                name="propertyPrice"
                control={control}
                rules={{required: true}}
                style={[
                  styles.inputText,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}
                keyboardType="number-pad"
              />
              <Text style={styles.priceText}>SAR</Text>
            </View>
          ) : (
            <View
              style={[
                styles.propertyNameContainer,
                {
                  flexDirection:
                    selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                  justifyContent: 'space-around',
                },
                errors.propertyPrice && styles.redBorder,
              ]}>
              <Input
                placeholder={language.propertyPrice}
                name="propertyPrice"
                control={control}
                rules={{required: true}}
                style={[
                  styles.inputText,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}
                keyboardType="number-pad"
                placeholderTextColor={Colors.darkGrey}
              />
              <Text style={styles.priceText}>SAR</Text>
            </View>
          )}

          {propertyFor === 'rent' && (
            <>
              <View
                style={[
                  styles.propertyNameContainer,
                  errors.leaseDuration && styles.redBorder,
                ]}>
                <Controller
                  control={control}
                  name="leaseDuration"
                  rules={{required: true}}
                  style={{
                    width: '30%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  render={({field: {value, onChange}}) => (
                    <RNPickerSelect
                      placeholder={{
                        label: language.leaseDuration,
                        value: null,
                        color: colors.darkGrey,
                      }}
                      items={leasePicker.map(item => {
                        if (item.value === value) {
                          return {...item, color: color.themeRed};
                        }
                        return item;
                      })}
                      onValueChange={onChange}
                      style={{
                        inputAndroid: styles.inputText,
                      }}
                      value={value}
                      useNativeAndroidPickerStyle={false}
                      Icon={() => {
                        return (
                          <Icon
                            name="expand-more"
                            size={24}
                            color={color.darkGrey}
                            style={{top: 10}}
                          />
                        );
                      }}
                    />
                  )}
                />
              </View>

              <View
                style={[
                  styles.propertyNameContainer,
                  {
                    flexDirection:
                      selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                    justifyContent: 'space-around',
                  },
                  // errors.securityDeposit && styles.redBorder,
                ]}>
                <Input
                  control={control}
                  // rules={{required: true}}
                  placeholder={language.securityDepositOptional}
                  name="securityDeposit"
                  style={[
                    styles.inputText,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}
                  placeholderTextColor={Colors.darkGrey}
                  keyboardType="number-pad"
                />
                <Text style={styles.priceText}>SAR</Text>
              </View>

              <View
                style={[
                  styles.propertyNameContainer,
                  {
                    flexDirection:
                      selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                    justifyContent: 'space-between',
                  },
                  // !date && styles.redBorder,
                ]}>
                <TextInput
                  placeholder={
                    !dateError
                      ? language.dateAvailable
                      : language.selectTheDateAvailable
                  }
                  name="availableDate"
                  control={control}
                  rules={{required: true}}
                  style={[
                    styles.inputText,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}
                  keyboardType="number-pad"
                  placeholderTextColor={
                    !dateError ? colors.darkGrey : colors.themeRed
                  }
                  editable={false}
                  value={date ? dayjs(date).format('MM-DD-YYYY') : ''}
                />

                <TouchableOpacity
                  style={styles.priceText}
                  onPress={() => setShowDate(true)}>
                  <Icon name="event" color={colors.themeRed} size={25} />
                </TouchableOpacity>
              </View>
            </>
          )}
          {/* {showDate && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={showDate}
              onDismiss={() => setShowDate(false)}>
              <SafeAreaView
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date ? date : new Date()}
                  mode={'date'}
                  is24Hour={true}
                  display="default"
                  onChange={onDateChange}
                  shouldRasterizeIOS={true}
                  style={{width: 80, backgroundColor: 'white'}}
                />
              </SafeAreaView>
            </Modal>
          )} */}

          {showDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date ? date : new Date()}
              mode={'date'}
              textColor="black"
              is24Hour={true}
              display={Platform.OS === 'android' ? 'default' : 'spinner'}
              onChange={onDateChange}
              shouldRasterizeIOS={true}
              style={{backgroundColor: 'white', width: '100%'}}
            />
          )}
          {showDate && Platform.OS === 'ios' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignSelf: 'flex-end',
                marginBottom: 10,
              }}>
              <Button mode="text" onPress={() => setShowDate(false)}>
                Cancel
              </Button>
              <Button mode="text" onPress={dateSelected}>
                OK
              </Button>
            </View>
          )}

          <View style={styles.component_Filter}>
            <Text
              style={[
                styles.Label,
                {marginBottom: 10},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.howManyBedrooms}
            </Text>

            <View
              style={{
                flexDirection: 'row',
              }}>
              {!moreBedrooms ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: '90%',
                    }}>
                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BedroomsSelected[0]}
                        onClick={() => {
                          setBedRoom(1);
                        }}
                        checkBoxColor="#E32C46"
                      />
                      <Text style={styles.bedroomText}> 1</Text>
                    </View>
                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BedroomsSelected[1]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBedRoom(2);
                        }}
                      />
                      <Text style={styles.bedroomText}> 2</Text>
                    </View>

                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BedroomsSelected[2]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBedRoom(3);
                        }}
                      />
                      <Text style={styles.bedroomText}> 3</Text>
                    </View>

                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BedroomsSelected[3]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBedRoom(4);
                        }}
                      />
                      <Text style={styles.bedroomText}> 4</Text>
                    </View>

                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BedroomsSelected[4]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBedRoom(5);
                        }}
                      />
                      <Text style={styles.bedroomText}> 5</Text>
                    </View>

                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BedroomsSelected[5]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBedRoom(6);
                        }}
                      />
                      <Text style={styles.bedroomText}> 6</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setMoreBedrooms(true)}
                    style={styles.rightIcon}>
                    <Icon name="chevron-right" size={25} color={colors.grey} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setMoreBedrooms(false)}
                    style={styles.rightIcon}>
                    <Icon name={'chevron-left'} size={25} color={colors.grey} />
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: '90%',
                    }}>
                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BedroomsSelected[6]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBedRoom(7);
                        }}
                      />
                      <Text style={styles.bedroomText}> 7</Text>
                    </View>
                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BedroomsSelected[7]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBedRoom(8);
                        }}
                      />
                      <Text style={styles.bedroomText}> 8</Text>
                    </View>
                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BedroomsSelected[8]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBedRoom(9);
                        }}
                      />
                      <Text style={styles.bedroomText}> 9</Text>
                    </View>
                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BedroomsSelected[9]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBedRoom(10);
                        }}
                      />
                      <Text style={styles.bedroomText}> 10</Text>
                    </View>
                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BedroomsSelected[10]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBedRoom(11);
                        }}
                      />
                      <Text style={styles.bedroomText}> 11</Text>
                    </View>

                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BedroomsSelected[11]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBedRoom(12);
                        }}
                      />
                      <Text style={styles.bedroomText}> 12</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={styles.component_Filter}>
            <Text
              style={[
                styles.Label,
                {marginBottom: 10},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.howManyBathrooms}
            </Text>
            <View style={{flexDirection: 'row'}}>
              {!moreBathrooms ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: '90%',
                    }}>
                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BathroomsSelected[0]}
                        onClick={() => {
                          setBathRoom(1);
                        }}
                        checkBoxColor="#E32C46"
                      />
                      <Text style={styles.bedroomText}> 1 </Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={BathroomsSelected[1]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBathRoom(2);
                        }}
                      />
                      <Text style={styles.bedroomText}> 2</Text>
                    </View>

                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={BathroomsSelected[2]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBathRoom(3);
                        }}
                      />
                      <Text style={styles.bedroomText}> 3</Text>
                    </View>

                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={BathroomsSelected[3]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBathRoom(4);
                        }}
                      />
                      <Text style={styles.bedroomText}> 4</Text>
                    </View>

                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={BathroomsSelected[4]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBathRoom(5);
                        }}
                      />
                      <Text style={styles.bedroomText}> 5</Text>
                    </View>

                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={BathroomsSelected[5]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBathRoom(6);
                        }}
                      />
                      <Text style={styles.bedroomText}> 6</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setMoreBathrooms(true)}
                    style={styles.rightIcon}>
                    <Icon name="chevron-right" size={25} color={colors.grey} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setMoreBathrooms(false)}
                    style={styles.rightIcon}>
                    <Icon name="chevron-left" size={25} color={colors.grey} />
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: '90%',
                    }}>
                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={BathroomsSelected[6]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBathRoom(7);
                        }}
                      />
                      <Text style={styles.bedroomText}> 7</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={BathroomsSelected[7]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBathRoom(8);
                        }}
                      />
                      <Text style={styles.bedroomText}> 8</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={BathroomsSelected[8]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBathRoom(9);
                        }}
                      />
                      <Text style={styles.bedroomText}> 9</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={BathroomsSelected[9]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBathRoom(10);
                        }}
                      />
                      <Text style={styles.bedroomText}> 10</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={BathroomsSelected[10]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBathRoom(11);
                        }}
                      />
                      <Text style={styles.bedroomText}> 11</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={BathroomsSelected[11]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setBathRoom(12);
                        }}
                      />
                      <Text style={styles.bedroomText}> 12</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={styles.component_Filter}>
            <Text
              style={[
                styles.Label,
                {marginBottom: 10},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.howManyKitchens}
            </Text>
            <View style={{flexDirection: 'row'}}>
              {!moreKitchens ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: '90%',
                    }}>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={KitchensSelected[0]}
                        onClick={() => {
                          setKitchens(1);
                        }}
                        checkBoxColor="#E32C46"
                      />
                      <Text style={styles.bedroomText}> 1</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={KitchensSelected[1]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setKitchens(2);
                        }}
                      />
                      <Text style={styles.bedroomText}> 2</Text>
                    </View>

                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={KitchensSelected[2]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setKitchens(3);
                        }}
                      />
                      <Text style={styles.bedroomText}> 3</Text>
                    </View>

                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={KitchensSelected[3]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setKitchens(4);
                        }}
                      />
                      <Text style={styles.bedroomText}> 4</Text>
                    </View>

                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={KitchensSelected[4]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setKitchens(5);
                        }}
                      />
                      <Text style={styles.bedroomText}> 5</Text>
                    </View>

                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={KitchensSelected[5]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setKitchens(6);
                        }}
                      />
                      <Text style={styles.bedroomText}> 6</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setMoreKitchens(true)}
                    style={styles.rightIcon}>
                    <Icon name="chevron-right" size={25} color={colors.grey} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setMoreKitchens(false)}
                    style={styles.rightIcon}>
                    <Icon name="chevron-left" size={25} color={colors.grey} />
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: '90%',
                    }}>
                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={KitchensSelected[6]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setKitchens(7);
                        }}
                      />
                      <Text style={styles.bedroomText}> 7</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={KitchensSelected[7]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setKitchens(8);
                        }}
                      />
                      <Text style={styles.bedroomText}> 8</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={KitchensSelected[8]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setKitchens(9);
                        }}
                      />
                      <Text style={styles.bedroomText}> 9</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={KitchensSelected[9]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setKitchens(10);
                        }}
                      />
                      <Text style={styles.bedroomText}> 10</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={KitchensSelected[10]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setKitchens(11);
                        }}
                      />
                      <Text style={styles.bedroomText}> 11</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={KitchensSelected[11]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setKitchens(12);
                        }}
                      />
                      <Text style={styles.bedroomText}> 12</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={styles.component_Filter}>
            <Text
              style={[
                styles.Label,
                {marginBottom: 10},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.howManyLivingRooms}
            </Text>
            <View style={{flexDirection: 'row'}}>
              {!moreLivingrooms ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: '90%',
                    }}>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={LivingroomsSelected[0]}
                        onClick={() => {
                          setLivingRoom(1);
                        }}
                        checkBoxColor="#E32C46"
                      />
                      <Text style={styles.bedroomText}> 1</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={LivingroomsSelected[1]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setLivingRoom(2);
                        }}
                      />
                      <Text style={styles.bedroomText}> 2</Text>
                    </View>

                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={LivingroomsSelected[2]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setLivingRoom(3);
                        }}
                      />
                      <Text style={styles.bedroomText}> 3</Text>
                    </View>

                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={LivingroomsSelected[3]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setLivingRoom(4);
                        }}
                      />
                      <Text style={styles.bedroomText}> 4</Text>
                    </View>

                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={LivingroomsSelected[4]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setLivingRoom(5);
                        }}
                      />
                      <Text style={styles.bedroomText}> 5</Text>
                    </View>

                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={LivingroomsSelected[5]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setLivingRoom(6);
                        }}
                      />
                      <Text style={styles.bedroomText}> 6</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setMoreLivingrooms(true)}
                    style={styles.rightIcon}>
                    <Icon name="chevron-right" size={25} color={colors.grey} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setMoreLivingrooms(false)}
                    style={styles.rightIcon}>
                    <Icon name="chevron-left" size={25} color={colors.grey} />
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: '90%',
                    }}>
                    <View style={[styles.innerCheckBox]}>
                      <CheckBox
                        isChecked={LivingroomsSelected[6]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setLivingRoom(7);
                        }}
                      />
                      <Text style={styles.bedroomText}> 7</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={LivingroomsSelected[7]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setLivingRoom(8);
                        }}
                      />
                      <Text style={styles.bedroomText}> 8</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={LivingroomsSelected[8]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setLivingRoom(9);
                        }}
                      />
                      <Text style={styles.bedroomText}> 9</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={LivingroomsSelected[9]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setLivingRoom(10);
                        }}
                      />
                      <Text style={styles.bedroomText}> 10</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={LivingroomsSelected[10]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setLivingRoom(11);
                        }}
                      />
                      <Text style={styles.bedroomText}> 11</Text>
                    </View>
                    <View style={styles.innerCheckBox}>
                      <CheckBox
                        isChecked={LivingroomsSelected[11]}
                        checkBoxColor="#E32C46"
                        onClick={() => {
                          setLivingRoom(12);
                        }}
                      />
                      <Text style={styles.bedroomText}> 12</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View
            style={[
              styles.propertyNameContainer,
              {
                flexDirection:
                  selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                justifyContent: 'space-around',
                marginTop: 20,
              },
              errors.landArea && styles.redBorder,
            ]}>
            <Input
              placeholder={language.landArea}
              control={control}
              rules={{required: true}}
              name="landArea"
              style={[
                styles.inputText,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}
              keyboardType="number-pad"
              placeholderTextColor={Colors.darkGrey}
            />
            <Text style={styles.priceText}>sq.m</Text>
          </View>

          <View
            style={[
              styles.propertyNameContainer,
              errors.realEstateAge && styles.redBorder,
            ]}>
            <Controller
              control={control}
              name="realEstateAge"
              rules={{required: true}}
              style={{
                width: '30%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              render={({field: {value, onChange}}) => (
                <RNPickerSelect
                  placeholder={{
                    label: language.realEstateAge,
                    value: null,
                    color: colors.darkGrey,
                  }}
                  items={estateAge.map(item => {
                    if (item.value === value) {
                      return {...item, color: color.themeRed};
                    }
                    return item;
                  })}
                  onValueChange={onChange}
                  style={{
                    inputAndroid: styles.inputText,
                  }}
                  value={value}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => {
                    return (
                      <Icon
                        name="expand-more"
                        size={24}
                        color={color.darkGrey}
                        style={{top: 10}}
                      />
                    );
                  }}
                />
              )}
            />
          </View>

          <View
            style={[
              styles.propertyNameContainer,
              {
                flexDirection:
                  selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                justifyContent: 'space-around',
              },
              errors.streetWidth && styles.redBorder,
            ]}>
            <Input
              control={control}
              rules={{required: true}}
              placeholder={language.streetWidth}
              name="streetWidth"
              style={[
                styles.inputText,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}
              keyboardType="number-pad"
              placeholderTextColor={Colors.darkGrey}
            />

            <Text style={styles.priceText}>m</Text>
          </View>

          <View
            style={[
              styles.propertyNameContainer,

              errors.buildingDirection && styles.redBorder,
            ]}>
            <Controller
              control={control}
              name="buildingDirection"
              rules={{required: true}}
              style={{
                width: '30%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              render={({field: {value, onChange}}) => (
                <RNPickerSelect
                  placeholder={{
                    label: language.buildingDirection,
                    value: null,
                    color: colors.darkGrey,
                  }}
                  items={buildingValues.map(item => {
                    if (item.value === value) {
                      return {...item, color: color.themeRed};
                    }
                    return item;
                  })}
                  onValueChange={onChange}
                  style={{
                    inputAndroid: styles.inputText,
                  }}
                  value={value}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => {
                    return (
                      <Icon
                        name="expand-more"
                        size={24}
                        color={color.darkGrey}
                        style={{top: 10}}
                      />
                    );
                  }}
                />
              )}
            />
          </View>

          <View
            style={[
              styles.propertyNameContainer,
              {height: 120, borderRadius: 10},
              errors.description && styles.redBorder,
            ]}>
            <Input
              placeholder={language.description}
              control={control}
              rules={{required: true}}
              name="description"
              style={[
                styles.inputText,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
                {textAlignVertical: 'top'},
              ]}
              multiline={true}
              placeholderTextColor={Colors.darkGrey}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleSubmit(onSubmit)}
            style={styles.applyButton}>
            <Text style={styles.applyText}> {language.next}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.themeWhite,
    width: '90%',
    alignSelf: 'center',
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    // flex: 1,
    backgroundColor: colors.themeWhite,
  },
  buttonContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 30,
    width: '80%',
    borderWidth: 1,
    borderColor: color.lightGrey,
    alignItems: 'center',
  },
  buttonView: {
    width: '50%',
    // paddingVertical: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  redButtonView: {
    backgroundColor: colors.themeRed,
    borderRadius: 20,
  },

  propertyContainer: {
    marginHorizontal: 10,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    fontFamily: 'Roboto-Medium',
  },
  propertyInnerContainer: {
    flexDirection: 'row',
  },
  propertyMainView: {
    width: '31%',
    marginRight: 10,
    alignItems: 'center',
    paddingVertical: 15,
    marginVertical: 10,
  },
  propertyView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyText: {
    fontSize: 14,
    paddingHorizontal: 2,
    fontFamily: 'Roboto-Regular',
    color: Colors.darkGrey,
  },
  propertyNameContainer: {
    backgroundColor: colors.inputBgGrey,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: colors.inputBgGrey,
    flexBasis: '90%',
    justifyContent: 'center',
  },
  redBorder: {
    borderColor: colors.themeRed,
  },

  pinTitle: {
    marginTop: 10,
    fontSize: 16,
    color: colors.titleBlack,
    fontFamily: 'Roboto-Medium',
    marginHorizontal: 10,
  },
  typingContainer: {
    marginLeft: 5,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.themeRed,
    borderRadius: 30,
    paddingHorizontal: 25,
    marginVertical: 10,
    alignSelf: 'center',
    marginTop: 20,
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
  component_Filter: {
    marginVertical: 5,
  },
  Label: {
    // fontWeight: 'bold',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    paddingTop: 5,
    paddingHorizontal: 15,
  },
  innerCheckBox: {
    marginTop: 5,
    marginHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '10%',
  },
  expandIcon: {
    justifyContent: 'center',
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
    fontFamily: 'Roboto-Bold',
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

  errorText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: colors.themeRed,
  },
  iconContainer: {
    // width: '20%',
    flexDirection: 'row',
    // alignItems: 'center',
    top: 15,
  },
});

export default PostPropertyStep1;
