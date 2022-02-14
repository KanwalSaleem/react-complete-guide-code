import React, {useState, useRef, useContext} from 'react';

import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Share,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import colors from '../../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {Modal, Portal} from 'react-native-paper';
import MapView, {Marker} from 'react-native-maps';
import SliderComp from './SliderComp';
import {SliderBox} from 'react-native-image-slider-box';
import color from '../../common/colors';
import Video from 'react-native-video';
import {AuthContext} from '../../context/AuthContext';
import Pdf from 'react-native-pdf';
import HouseInfoSingle from './HouseInfoSingle';
import dayjs from 'dayjs';
import {Card, Title} from 'react-native-paper';
import Toast from 'react-native-simple-toast';

const HouseSingleProperty = props => {
  const [propertyData, setPropertyData] = useState(props.data.data);
  const {userCred, language, isSkip, selectedLanguage} =
    useContext(AuthContext);

  const [showMore, setShowMore] = useState(false);

  const navigation = useNavigation();
  const picture = require('../../assets/placeholder.jpg');
  const map = require('../../assets/map.jpg');
  const floorPlan = require('../../assets/floorplan.png');
  const noFloor = require('../../assets/placeholder.jpg');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [floorModalVisible, setFloorModalVisible] = useState(false);
  const [floorLoading, setFloorLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const player = useRef();

  const images = [require('../../assets/placeholder.jpg')];
  const [unitAmenities, setUnitAminities] = useState([
    {id: 1, icon: 'house', name: 'New Construction', selected: false},
    {
      id: 2,
      icon: 'weekend',
      name: 'Furnished',
    },
    {
      id: 3,
      icon: 'local-fire-department',
      name: 'Firepits',
    },
    {
      id: 4,
      icon: 'store',
      name: 'Storage Space',
    },
    {
      id: 5,
      icon: 'opacity',
      name: 'Water Access',
    },
    {
      id: 6,
      icon: 'nature-people',
      name: 'Doorman',
    },
    {
      id: 7,
      icon: 'person',
      name: 'Maid Room',
    },
    {
      id: 8,
      icon: 'local-laundry-service',
      name: 'Laundry',
    },
    {
      id: 9,
      icon: 'wifi',
      name: 'High Speed Internet',
    },
    {
      id: 10,
      icon: 'padding',
      name: 'Dishwasher',
    },
    {
      id: 11,
      icon: 'accessible',
      name: 'Chair Accessibility',
    },
    {
      id: 12,
      icon: 'car-repair',
      name: 'Car Garage',
    },
    {
      id: 13,
      icon: 'accessible',
      name: 'Semi Furnished',
    },
    {
      id: 14,
      icon: 'format-color-fill',
      name: 'Renovated',
    },
    {
      id: 15,
      icon: 'roofing',
      name: 'Smart Home',
    },
    {
      id: 16,
      icon: 'directions-car',
      name: 'Private Parking',
    },
    {
      id: 17,
      icon: 'local-florist',
      name: 'Garden',
    },
    {
      id: 18,
      icon: 'elevator',
      name: 'Elevator',
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

  const imageModal = () => {
    return (
      <Portal>
        <Modal
          // style={{justifyContent: 'flex-start'}}
          visible={imageModalVisible}
          onDismiss={() => setImageModalVisible(false)}
          contentContainerStyle={[styles.modalContainer]}>
          <SliderBox
            images={
              propertyData?.multiple_image?.length > 0
                ? propertyData?.multiple_image.map(item => ({
                    uri: `https://xionex.in/msaken/admin/public/uploads/products/${item.image}`,
                  }))
                : images
            }
            ImageComponentStyle={{width: '100%', height: 310}}
            disableOnPress
            activeOpacity={0.6}
            circleLoop={true}
            dotColor={colors.themeRed}
            inactiveDotColor={colors.themeWhite}
          />
        </Modal>
      </Portal>
    );
  };

  const floorModal = () => {
    return (
      <Portal>
        <Modal
          // style={{justifyContent: 'flex-start'}}
          visible={floorModalVisible}
          onDismiss={() => setFloorModalVisible(false)}
          contentContainerStyle={[styles.modalContainer]}>
          {propertyData?.floorplan?.includes('pdf') ? (
            <View style={styles.pdfContainer}>
              {floorLoading && (
                // <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator color={color.themeRed} size={'large'} />
                // </View>
              )}

              <Pdf
                source={{
                  uri: `https://xionex.in/msaken/admin/public/uploads/products/${propertyData.floorplan}`,
                  cache: true,
                }}
                onLoadComplete={(numberOfPages, filePath) => {}}
                onPageChanged={(page, numberOfPages) => {
                  console.log(`Current page: ${page}`);
                }}
                onError={error => {
                  console.log(error);
                }}
                style={styles.pdf}
              />
            </View>
          ) : (
            <SliderBox
              images={
                propertyData?.floorplan
                  ? [
                      {
                        uri: `https://xionex.in/msaken/admin/public/uploads/products/${propertyData.floorplan}`,
                      },
                    ]
                  : images
              }
              ImageComponentStyle={{width: '100%', height: 300}}
              disableOnPress
              activeOpacity={0.6}
              circleLoop={true}
              currentImageEmitter={index => {}}
              dotColor={colors.themeRed}
              inactiveDotColor={colors.themeWhite}
              dotStyle={{
                marginHorizontal: -15,
              }}
            />
          )}
        </Modal>
      </Portal>
    );
  };

  const ShareProperty = () => {
    Share.share({
      message: propertyData.prourl,
    });
  };

  const showMarkers = () => {
    return (
      <Marker
        coordinate={{
          latitude: propertyData?.latitude
            ? parseFloat(propertyData?.latitude)
            : 37.42305396683122,
          longitude: propertyData?.longitude
            ? parseFloat(propertyData?.longitude)
            : -122.0875014718816,
        }}
        calloutOffset={{x: 0.1, y: 0.2}}
        calloutAnchor={{x: -0.4, y: 0.2}}
        style={{width: '15%'}}
        stopPropagation={true}>
        {/* <TouchableOpacity style={styles.markerContaier}>
          <Text style={styles.markerText}>{reports.distance}</Text>
        </TouchableOpacity> */}
      </Marker>
    );
  };
  const mapModal = () => {
    return (
      <Portal>
        <Modal
          // style={{justifyContent: 'flex-start'}}
          visible={mapModalVisible}
          onDismiss={() => setMapModalVisible(false)}
          contentContainerStyle={[styles.modalContainer]}>
          <MapView
            region={{
              latitude: propertyData?.latitude
                ? parseFloat(propertyData?.latitude)
                : 37.42305396683122,
              longitude: propertyData?.longitude
                ? parseFloat(propertyData?.longitude)
                : -122.0875014718816,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            initialRegion={{
              latitude: propertyData?.latitude
                ? parseFloat(propertyData?.latitude)
                : 37.42305396683122,
              longitude: propertyData?.longitude
                ? parseFloat(propertyData?.longitude)
                : -122.0875014718816,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={{height: 310}}>
            {showMarkers()}
          </MapView>
        </Modal>
      </Portal>
    );
  };

  const videoModal = () => {
    return (
      <Portal>
        <Modal
          // style={{justifyContent: 'flex-start'}}
          visible={videoModalVisible}
          onDismiss={() => setVideoModalVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          {loading && (
            // <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator color={color.themeRed} size={'large'} />
            // </View>
          )}
          <Video
            source={{
              uri: propertyData.video
                ? `https://xionex.in/msaken/admin/public/uploads/products/${propertyData.video}`
                : propertyData.video_url,
            }}
            ref={ref => {
              player.current = ref;
            }}
            style={[
              styles.backgroundVideo,
              {display: loading ? 'none' : 'flex', height: 300},
            ]}
            controls={true}
            resizeMode={'cover'}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
            onBuffer={e => console.log(e, 'heelo')}
            onVideoBuffer={e => console.log(e, 'video')}
            onLoad={e => setLoading(false)}
            onLoadStart={e => {
              setLoading(true);
            }}
            posterResizeMode="cover"
            poster={`https://www.meditatecenter.com/howtomeditate/wp-content/uploads/2015/02/video-placeholder.jpg%60%7D`}
          />
        </Modal>
      </Portal>
    );
  };

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
        setPropertyData(prev => {
          return {...prev, likestatus: prev.likestatus == 0 ? 1 : 0};
        });
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const skipLikeHandler = () => {
    Toast.show(
      language.pleaseLoginYourAccountToLikeThePropertyThanks,
      Toast.SHORT,
    );
  };

  const unitIconHandler = iconValue => {
    let iconName;
    unitAmenities.map(item => {
      if (item.name === iconValue.value) {
        iconName = item.icon;
      }
    });

    if (iconName) {
      return iconName;
    } else {
      return 'fiber-manual-record';
    }
  };
  const communityIconHandler = iconValue => {
    let iconName;
    communityAmenities.map(item => {
      if (item.name === iconValue.value) {
        iconName = item.icon;
      }
    });

    if (iconName) {
      return iconName;
    } else {
      return 'fiber-manual-record';
    }
  };
  return !propertyData ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={colors.themeRed} />
    </View>
  ) : (
    <ScrollView
      contentContainerStyle={[
        styles.screen,
        (imageModalVisible ||
          videoModalVisible ||
          floorModalVisible ||
          mapModalVisible) && {
          // backgroundColor: 'rgba(52, 52, 52, 0.1)',
          // backgroundColor: 'black',
          display: 'none',
          opacity: 1,
        },
      ]}>
      <SliderBox
        images={
          propertyData?.multiple_image?.length > 0
            ? propertyData?.multiple_image.map(item => ({
                uri: `https://xionex.in/msaken/admin/public/uploads/products/${item.image}`,
              }))
            : images
        }
        ImageComponentStyle={{width: '100%', height: 300}}
        dotStyle={{
          marginHorizontal: -15,
        }}
        activeOpacity={0.6}
        circleLoop={true}
        dotColor={colors.themeRed}
        inactiveDotColor={colors.themeWhite}
      />

      <View style={styles.mainContainer}>
        <View style={styles.picturesContainer}>
          <ImageBackground
            source={
              propertyData?.multiple_image?.length > 0
                ? {
                    uri: `https://xionex.in/msaken/admin/public/uploads/products/${propertyData?.multiple_image[0].image}`,
                  }
                : require('../../assets/placeholder.jpg')
            }
            style={[styles.pictureContainer]}
            imageStyle={styles.picture}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setImageModalVisible(true)}
              style={[
                styles.picturesView,
                selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
              ]}>
              <Icon name="collections" color={colors.themeWhite} size={15} />
              <Text style={styles.picText}>{language.pictures}</Text>
            </TouchableOpacity>
          </ImageBackground>

          <ImageBackground
            source={map}
            style={styles.pictureContainer}
            imageStyle={styles.picture}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setMapModalVisible(true)}
              style={[
                styles.picturesView,
                selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
              ]}>
              <Icon name="location-on" color={colors.themeWhite} size={15} />
              <Text style={styles.picText}>{language.map}</Text>
            </TouchableOpacity>
          </ImageBackground>

          <ImageBackground
            source={
              propertyData.video
                ? {
                    uri: `https://www.meditatecenter.com/howtomeditate/wp-content/uploads/2015/02/video-placeholder.jpg`,
                  }
                : picture
            }
            style={styles.pictureContainer}
            imageStyle={styles.picture}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                propertyData.video
                  ? setVideoModalVisible(true)
                  : Alert.alert('', language.noVideoPresent)
              }
              style={[
                styles.picturesView,
                selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
              ]}>
              <Icon name="videocam" color={colors.themeWhite} size={15} />
              <Text style={styles.picText}>{language.video}</Text>
            </TouchableOpacity>
          </ImageBackground>

          <ImageBackground
            source={
              propertyData?.floorplan != null
                ? propertyData?.floorplan.includes('pdf')
                  ? floorPlan
                  : {
                      uri: `https://xionex.in/msaken/admin/public/uploads/products/${propertyData?.floorplan}`,
                    }
                : noFloor
            }
            // source={images}
            style={styles.pictureContainer}
            imageStyle={styles.picture}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                propertyData?.floorplan
                  ? setFloorModalVisible(true)
                  : Alert.alert('', language.noFloorplanPresent)
              }
              style={[
                styles.picturesView,
                selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
              ]}>
              <Icon name="view-module" color={colors.themeWhite} size={15} />
              <Text style={styles.picText}>{language.floorplan}</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View style={styles.apatmentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{propertyData.name}</Text>
            <View
              style={[
                styles.socialContainer,
                props.myListing && {width: '10%'},
              ]}>
              {!props.myListing && (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={
                    isSkip
                      ? skipLikeHandler
                      : likeHandler.bind(
                          this,
                          propertyData.id,
                          propertyData.likestatus,
                        )
                  }
                  style={styles.icon}>
                  <Icon
                    name={
                      propertyData.likestatus == 1
                        ? 'favorite'
                        : 'favorite-border'
                    }
                    color={colors.themeRed}
                    size={23}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => ShareProperty()}
                style={styles.icon}>
                <Image
                  style={styles.shareImage}
                  source={require('../../assets/share.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',

              justifyContent: 'space-between',
              marginTop: 5,
              alignItems: 'center',
              width: '100%',
            }}>
            <View
              style={[
                styles.addressContainer,

                {
                  width: props.myListing ? '65%' : '90%',
                },
              ]}>
              <Icon name="location-on" size={20} color={colors.themeRed} />
              <Text style={[styles.address]}>{propertyData.p_location}</Text>
            </View>
            {props.myListing && (
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  {
                    backgroundColor:
                      propertyData.status === 1
                        ? '#077E8C'
                        : propertyData.status === 2
                        ? '#595BD4'
                        : '#F29339',
                    borderRadius: 5,
                  },
                ]}
                activeOpacity={0.6}
                onPress={() => {}}>
                {propertyData.status === 1 ? (
                  <Text style={styles.status}>{language.active}</Text>
                ) : propertyData.status === 2 ? (
                  <Text style={styles.status}>{language.pending}</Text>
                ) : (
                  <Text style={styles.status}>{language.disabled}</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        <HouseInfoSingle data={propertyData} myListing={true} />

        <View>
          <View style={styles.descriptionContainer}>
            <Text
              style={[
                styles.descriptionTitle,
                {paddingBottom: 10},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.description}
            </Text>
            <View
              style={[
                styles.descriptionMoreContainer,
                propertyData.description.length > 100 &&
                  !showMore && {height: 80},
              ]}>
              <Text style={[styles.descriptionText, {textAlign: 'left'}]}>
                {propertyData.description}
              </Text>
              <View style={{}} />
            </View>

            {propertyData.description.length > 100 && (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setShowMore(prev => !prev)}
                style={styles.expandIcon}>
                <Icon
                  name={showMore ? 'expand-more' : 'expand-less'}
                  color={colors.grey}
                  size={30}
                />
              </TouchableOpacity>
            )}
          </View>

          {propertyData?.property_for === 'rent' && (
            <View style={styles.streetsContainer}>
              <View style={styles.streetsView}>
                <Text style={[styles.descriptionTitle]}>
                  {language.leaseDuration}
                </Text>
                <Text style={[styles.descriptionText]}>
                  {propertyData.lease_duration
                    ? propertyData.lease_duration
                    : '-'}
                </Text>
              </View>

              <View
                style={[
                  styles.streetsView,
                  {
                    borderLeftWidth: 2,
                    borderRightWidth: 2,
                    borderColor: colors.inputBgGrey,
                    alignItems: 'center',
                    width: '33%',
                  },
                ]}>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.descriptionTitle}>
                    {language.dateAvailable}
                  </Text>
                  <Text style={styles.descriptionText}>
                    {propertyData?.date_pro
                      ? dayjs(propertyData?.date_pro).format('DD MMMM YYYY')
                      : '-'}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.streetsView,
                  {
                    marginLeft: 5,
                  },
                ]}>
                <Text style={styles.descriptionTitle}>
                  {language.securityDeposit}
                </Text>

                {propertyData.security_deposit === 'undefined' ? (
                  <Text style={styles.descriptionText}>
                    {language.none} SAR
                  </Text>
                ) : (
                  <Text style={styles.descriptionText}>
                    {propertyData.security_deposit
                      ? propertyData.security_deposit
                      : '-'}{' '}
                    SAR
                  </Text>
                )}
              </View>
            </View>
          )}
          <View style={styles.streetsContainer}>
            <View style={styles.streetsView}>
              <Text style={[styles.descriptionTitle]}>
                {language.realEstateAge}
              </Text>
              <Text style={[styles.descriptionText]}>
                {propertyData.real_estage_age}
              </Text>
            </View>

            <View
              style={[
                styles.streetsView,
                {
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  borderColor: colors.inputBgGrey,
                  alignItems: 'center',
                  width: '33%',
                },
              ]}>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.descriptionTitle}>
                  {language.streetWidth}
                </Text>
                <Text style={styles.descriptionText}>
                  {propertyData.street_width}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.streetsView,
                {
                  marginLeft: 5,
                },
              ]}>
              <Text style={styles.descriptionTitle}>
                {language.buildingDirection}
              </Text>
              <Text style={styles.descriptionText}>
                {propertyData.b_direction}
              </Text>
            </View>
          </View>

          <View style={[styles.descriptionContainer, {marginTop: 10}]}>
            <Text
              style={[
                styles.descriptionTitle,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.inUnitAmenities}
            </Text>

            <View style={[styles.unitInnerrContainer]}>
              {props.data.unit_amenities.map((item, index) => {
                return (
                  <View key={item.value} style={[styles.unitMainViews]}>
                    <View style={[styles.unitViews]}>
                      <Icon
                        name={unitIconHandler(item)}
                        color={colors.themeRed}
                        size={20}
                      />
                      <Text style={[styles.unitText]}>{item.value}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={(styles.descriptionContainer, {marginVertical: 10})}>
            <Text
              style={[
                styles.descriptionTitle,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.communityAmenities}
            </Text>

            <View style={[styles.unitInnerrContainer]}>
              {props.data.comunit_amenities.map((item, index) => {
                return (
                  <View key={item.value} style={[styles.unitMainViews]}>
                    <View style={[styles.unitViews]}>
                      <Icon
                        name={communityIconHandler(item)}
                        color={colors.themeRed}
                        size={20}
                      />
                      <Text style={[styles.unitText]}>{item.value}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {!props.myListing && (
            <View style={styles.descriptionContainer}>
              <Text
                style={[
                  styles.descriptionTitle,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}>
                {language.listedBy}
              </Text>
              <View
                style={[
                  styles.addressConatiner,
                  {
                    flexDirection:
                      selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                    marginTop: 5,
                  },
                ]}>
                <Icon name="person" size={20} color={colors.themeRed} />
                <Text style={[styles.address, {marginLeft: 5}]}>
                  {propertyData.name}
                </Text>
              </View>
              <View
                style={[
                  styles.addressConatiner,
                  {
                    flexDirection:
                      selectedLanguage === 'arabic' ? 'row-reverse' : 'row',
                    marginTop: 5,
                    width: '100%',
                  },
                ]}>
                <Icon name="location-on" size={20} color={colors.themeRed} />
                <Text
                  style={[
                    styles.address,
                    selectedLanguage === 'arabic'
                      ? {marginRight: 5}
                      : {marginLeft: 5},
                  ]}>
                  {propertyData.p_location}
                </Text>
              </View>
            </View>
          )}
        </View>
        {props.myListing && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() =>
              navigation.navigate('editProperty', {
                screen: 'editPropertyStep1',
                params: {
                  reset: true,
                  postPropertyData: props.data,
                  pId: props.pId,
                },
              })
            }
            style={styles.editContainer}>
            <Icon name="edit" size={25} color="white" />
          </TouchableOpacity>
        )}
        {imageModal()}
        {videoModal()}
        {floorModal()}
        {mapModal()}
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
    flexGrow: 1,
    backgroundColor: colors.themeWhite,
  },
  mainContainer: {
    marginHorizontal: 10,
  },
  picturesContainer: {
    flexDirection: 'row',
    width: window.width,
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  picturesView: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pictureContainer: {
    width: '23%',
    height: 50,
    resizeMode: 'contain',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 3,
  },
  picture: {
    width: '100%',
  },
  // picDetailsContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingHorizontal: 5,
  //   borderRadius: 10,
  // },
  picText: {
    marginLeft: 3,
    marginRight: 3,
    color: colors.themeWhite,
    fontSize: 9,
    fontFamily: 'Roboto-Medium',
  },
  apatmentContainer: {},
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {fontWeight: 'bold', fontSize: 16, fontFamily: 'Roboto-Medium'},
  addressContainer: {
    marginTop: 5,
    flexDirection: 'row',
    // width: '70%',
    // alignItems: 'center',
  },
  address: {
    fontSize: 14,
    color: colors.darkGrey,
    fontFamily: 'Roboto-Regular',
    flexWrap: 'wrap',
  },
  socialContainer: {
    width: '15%',
    flexDirection: 'row',
    marginLeft: 5,
  },
  icon: {
    marginHorizontal: 2,
    justifyContent: 'center',
  },

  descriptionContainer: {
    marginBottom: 10,
  },
  descriptionTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: color.darkGrey,
    textAlign: 'center',
  },
  streetsContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    marginBottom: 20,
  },
  streetsView: {
    width: '33%',
    // backgroundColor: 'blue',
    // alignItems: 'center',
  },

  unitContainer: {
    flexDirection: 'row',
  },
  unitView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  unitText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.darkGrey,
    paddingLeft: 3,
    paddingRight: 3,
  },

  unitInnerrContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',

    // marginHorizontal: 5,
  },
  unitViews: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingRight: 5,
  },
  unitMainViews: {
    width: '50%',
    // paddingHorizontal: 5,
  },
  modalContainer: {
    backgroundColor: colors.themeWhite,
    width: '100%',
    alignSelf: 'flex-start',
    marginTop: -30,
    height: 310,
  },
  markerContaier: {
    height: 30,
    borderColor: colors.themeRed,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.themeWhite,
  },
  markerText: {
    fontSize: 14,
    color: colors.themeRed,
  },
  editContainer: {
    backgroundColor: color.themeRed,
    width: '15%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  statusButton: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 6,
    marginLeft: 10,
  },
  pdfContainer: {
    height: 310,
    width: '100%',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  shareImage: {
    width: 14,
    height: 16,
    marginLeft: 5,
  },
  descriptionMoreContainer: {
    alignItems: 'center',
  },
  expandIcon: {
    alignItems: 'center',
  },
});

export default HouseSingleProperty;
