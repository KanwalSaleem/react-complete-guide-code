import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import colors from '../../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HouseDetails from '../../components/Common/HouseDetails';
import MapView, {Marker} from 'react-native-maps';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthContext';
import color from '../../common/colors';
import {Modal, Portal} from 'react-native-paper';
import HouseInfo from '../../components/Common/HouseInfo';
import {Card, Title} from 'react-native-paper';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import RNLocation from 'react-native-location';
import Toast from 'react-native-simple-toast';

const SkipDashBoard = ({route, navigation}) => {
  const mapRef = useRef();
  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE = 37.78825;
  const LONGITUDE = -122.4324;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const SPACE = 0.01;

  const {
    filterData,

    setFilterData,
    userCred,
    // selectedBathrooms,
    // unit,
    // PurchaseType,
    // landArea,
    // selectedBedrooms,
    // price,
    // selectedPropertyType,
    // address,
    // community,
    language,
    dashBoardLoading,
    getPropertiesSkip,
  } = useContext(AuthContext);

  const [sortVisible, setSortVisible] = useState(false);
  const [sortType, setSortType] = useState('');
  const [sortStatus, setSortStatus] = useState('');
  const [singleProperty, setSingleProperty] = useState();
  const [userLocation, setUserLocation] = useState();
  const [isLoading, setLoading] = useState(false);
  const location = route.params;

  const [mapRegion, setMapRegion] = useState(false);

  const likeHandler = (id, likeStatus) => {
    Toast.show(
      language.pleaseLoginYourAccountToLikeThePropertyThanks,
      Toast.SHORT,
    );
  };

  const SortBy = () => {
    return (
      <Portal>
        <Modal
          visible={sortVisible}
          onDismiss={() => setSortVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <View>
            <View style={styles.modalTilteContainer}>
              <Text style={styles.modalTiltle}>{language.sortBy}</Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setSortVisible(false)}
                style={styles.closeIcon}>
                <Icon name="close" size={15} color={colors.grey} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sortContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={getSortBy.bind(this, 'best_match')}
              style={styles.sortView}>
              <Text
                style={[
                  styles.sortTitle,
                  sortStatus === 'best_match' && {color: colors.themeRed},
                ]}>
                {language.bestMatch}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={getSortBy.bind(this, 'premium')}
              style={styles.sortView}>
              <Text
                style={[
                  styles.sortTitle,
                  sortStatus === 'premium' && {color: colors.themeRed},
                ]}>
                {language.premium}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={getSortBy.bind(this, 'new_property')}
              style={styles.sortView}>
              <Text
                style={[
                  styles.sortTitle,
                  sortStatus === 'new_property' && {color: colors.themeRed},
                ]}>
                {language.new}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={getSortBy.bind(this, 'price_high_low')}
              style={styles.sortView}>
              <Text
                style={[
                  styles.sortTitle,
                  sortStatus === 'price_high_low' && {color: colors.themeRed},
                ]}>
                {language.priceHighToLow}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={getSortBy.bind(this, 'price_low_high')}
              style={styles.sortView}>
              <Text
                style={[
                  styles.sortTitle,
                  sortStatus === 'price_low_high' && {color: colors.themeRed},
                ]}>
                {language.priceLowToHigh}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    );
  };
  const singlePropertyHandler = item => {
    const newData = filterData.filter(
      filterItem =>
        // filterItem.id != item.id
        // console.log('id', item.id, filterItem.id),
        filterItem.id != item.id,
    );
    // mapRef.current.animateToRegion(
    //   {
    //     longitude: item.longitude,
    //     latitude: item.latitude,
    //     latitudeDelta: 0.0922,
    //     longitudeDelta: 0.00421,
    //   },
    //   1000,
    // );

    newData.unshift(item);

    setFilterData(newData);
    setMapRegion(true);
  };

  const numFormatter = num => {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  };

  const showMarkers = () => {
    return filterData.map(item => {
      return (
        <Marker
          key={item.id}
          coordinate={{
            latitude: item?.latitude ? item?.latitude : 37.42220190984646,
            longitude: item?.longitude ? item?.longitude : -122.08407897306436,
          }}
          identifier={`${item.id}`}
          stopPropagation={true}
          onPress={singlePropertyHandler.bind(this, item)}>
          <TouchableOpacity style={{}}>
            <Icon
              name="location-on"
              color={filterData[0].id === item.id ? 'black' : colors.themeRed}
              size={30}
            />
          </TouchableOpacity>
          {/* <View style={{width: 70, height: 40}}>
            <View
              style={[
                styles.box,
                filterData[0].id === item.id && {
                  backgroundColor: color.themeRed,
                },
              ]}>
              <View style={styles.triangle} />

              <Text
                style={[
                  styles.markerText,
                  filterData[0].id === item.id && {
                    color: color.themeWhite,
                  },
                ]}>
                {numFormatter(item.price)}
              </Text>
              <View
                style={[
                  styles.triangle2,
                  filterData[0].id === item.id && {
                    borderTopColor: color.themeRed,
                  },
                ]}
              />
            </View>
          </View> */}
        </Marker>
      );
    });
  };

  const getSortBy = async filterType => {
    setSortStatus(filterType);
    setSortVisible(false);
    setLoading(true);
    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/batch-match-property';
      let formdata = new FormData();

      formdata.append('filter_type', filterType);
      formdata.append('userid', null);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: formdata,
      });

      const responseData = await response.json();
      const parseData = responseData.data.map(item => ({
        ...item,
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
      }));
      setFilterData(parseData);
    } catch (error) {
      Alert.alert(error.message);
      setLoading(false);
    }
    setLoading(false);
  };

  const getUserLocation = () => {
    setMapRegion(false);
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
              setUserLocation({
                longitude: latestLocation.longitude,
                latitude: latestLocation.latitude,
              });
              return latestLocation;
            })

            .catch(e => console.log(e));
        } else if (!granted) {
          Alert.alert('Allow to access your location', '', [
            {onPress: () => {}},
          ]);
        }
      })

      .catch(e => console.log(e));
  };

  useFocusEffect(
    useCallback(() => {
      getPropertiesSkip();
      setMapRegion(false);
      getUserLocation();
      setSortVisible(false);
      setSortStatus('');
      setSingleProperty();
    }, [getPropertiesSkip]),
  );

  useEffect(() => {
    getPropertiesSkip();
  }, []);

  return dashBoardLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={colors.themeRed} />
    </View>
  ) : isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={colors.themeRed} />
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={styles.myLocationContainer}>
        <TouchableOpacity activeOpacity={0.6} onPress={getUserLocation}>
          <Icon
            style={styles.locationIcon}
            name="my-location"
            size={20}
            color="#696969"
          />
        </TouchableOpacity>
      </View>
      <MapView
        ref={mapRef}
        region={{
          latitude: mapRegion
            ? filterData[0]?.latitude
              ? filterData[0]?.latitude
              : 37.42220190984646
            : location?.latitude
            ? location?.latitude
            : userLocation?.latitude
            ? userLocation?.latitude
            : 37.42220190984646,

          longitude: mapRegion
            ? filterData[0]?.longitude
              ? filterData[0]?.longitude
              : 37.42220190984646
            : location?.longitude
            ? location?.longitude
            : userLocation?.longitude
            ? userLocation?.longitude
            : 37.42220190984646,
          // latitudeDelta: 0.0922,
          // longitudeDelta: 0.00421,
          latitudeDelta: mapRegion ? 0.0922 : 0.922,
          longitudeDelta: mapRegion ? 0.00421 : 0.0421,
        }}
        // region={{
        //   latitude: mapRegion
        //     ? filterData[0]?.latitude
        //       ? filterData[0]?.latitude
        //       : 37.42220190984646
        //     : userLocation?.latitude
        //     ? userLocation?.latitude
        //     : filterData[0]?.latitude
        //     ? filterData[0]?.latitude
        //     : 37.42220190984646,
        //   longitude: mapRegion
        //     ? filterData[0]?.longitude
        //       ? filterData[0]?.longitude
        //       : 37.42220190984646
        //     : userLocation?.longitude
        //     ? userLocation?.longitude
        //     : filterData[0]?.longitude
        //     ? filterData[0]?.longitude
        //     : -122.08407897306436,

        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.00421,
        // }}

        // initialRegion={mapRegion}
        // initialRegion={{
        //   latitude: userLocation?.latitude
        //     ? userLocation?.latitude
        //     : filterData[0]?.latitude
        //     ? filterData[0]?.latitude
        //     : 37.42220190984646,
        //   longitude: userLocation?.longitude
        //     ? userLocation?.longitude
        //     : filterData[0]?.longitude
        //     ? filterData[0]?.longitude
        //     : -122.08407897306436,

        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.00421,
        // }}
        style={{
          minHeight: 300,
          maxHeight: 300,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        // followsUserLocation={true}
        userLocationPriority="balanced"
        // onUserLocationChange={getUserLocation}
        // onLayout={() => mapRef.current.fitToElements(true)}
      >
        {filterData.length > 0 ? showMarkers() : null}
      </MapView>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('userFilter')}
          style={styles.optionsView}>
          <Image
            source={require('../../assets/filter.png')}
            style={styles.icon}
          />
          <Text style={styles.optionTitle}>{language.filter}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setSortVisible(true)}
          style={[
            styles.optionsView,
            {borderLeftWidth: 2, borderColor: colors.inputBgGrey},
          ]}>
          <Image
            source={require('../../assets/sort.png')}
            style={styles.icon}
          />
          <Text style={styles.optionTitle}>{language.sortBy}</Text>
        </TouchableOpacity>
      </View>
      <HouseDetails
        data={filterData.length > 0 ? filterData : []}
        style={{height: '50%'}}
        price={true}
        likeHandler={likeHandler}
      />

      {SortBy()}
    </View>
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
    backgroundColor: colors.themeWhite,
  },

  optionsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  optionsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  optionTitle: {
    fontSize: 14,
    color: color.darkGrey,
    fontFamily: 'Roboto-Medium',
    marginLeft: 5,
  },
  markerContaier: {
    borderRadius: 5,
    height: 30,
    borderColor: colors.themeRed,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.themeWhite,
  },
  markerText: {
    fontSize: 12,
    color: colors.themeRed,
  },
  modalContainer: {
    backgroundColor: colors.themeWhite,
    width: '80%',
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
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 80,
    fontFamily: 'Roboto-Medium',
    color: color.titleBlack,
  },
  closeIcon: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 15,
    alignItems: 'center',
  },
  sortContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  sortView: {
    marginVertical: 5,
  },
  sortTitle: {
    fontSize: 14,
    color: colors.darkGrey,
    fontFamily: 'Roboto-Regular',
  },
  icon: {
    width: 17,
    height: 17,
    resizeMode: 'center',
  },
  price: {
    fontSize: 14,
    color: colors.themeRed,
    fontFamily: 'Roboto-Bold',
  },
  singlepPropertyContainer: {
    marginHorizontal: 10,
  },

  box: {
    width: 70,
    height: 30,
    backgroundColor: colors.themeWhite,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.themeRed,
    borderWidth: 1,
    borderRadius: 3,
  },
  triangle: {
    width: 10,
    height: 10,
    position: 'absolute',
    bottom: -10,
    right: 23,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: colors.themeRed,
  },
  triangle2: {
    width: 10,
    height: 10,
    position: 'absolute',
    bottom: -10,
    right: 24,
    borderLeftWidth: 9,
    borderLeftColor: 'transparent',
    borderRightWidth: 9,
    borderRightColor: 'transparent',
    borderTopWidth: 9,
    borderTopColor: colors.themeWhite,
  },
  myLocationContainer: {
    position: 'absolute',
    top: 250,
    alignSelf: 'flex-end',
    backgroundColor: colors.themeWhite,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    zIndex: 10,
  },
});

export default SkipDashBoard;
