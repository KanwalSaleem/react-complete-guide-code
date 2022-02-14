import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  Share,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Text,
  FlatList,
  ActivityIndicatorBase,
} from 'react-native';
import colors from '../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Menu} from 'react-native-paper';
import {AuthContext} from '../context/AuthContext';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import color from '../common/colors';
import HouseInfo from '../components/Common/HouseInfo';
import SliderComp from '../components/Common/SliderComp';

const MyListingScreen = ({route, navigation}) => {
  const location = route.params;
  const [selected, setSelected] = useState('rent');
  const [menu, setMenu] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const {userCred, language, selectedLanguage} = useContext(AuthContext);
  const jsonUserCred = JSON.parse(userCred);
  const token = jsonUserCred.data.token;
  const [rentData, setRentData] = useState([]);
  const [saleData, setSaleData] = useState([]);
  const [status, setStatus] = useState('');
  const images = [require('../assets/placeholder.jpg')];
  const [visible, setVisible] = useState();
  const [activate, setActivte] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{marginRight: 5}}
            onPress={() => navigation.navigate('searchProperty')}>
            <Icon name="search" size={25} color={colors.titleBlack} />
          </TouchableOpacity>
          <Menu
            visible={menu}
            onDismiss={() => setMenu(false)}
            style={{height: 120, top: 50}}
            anchor={
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setMenu(true)}
                style={{marginRight: 6}}>
                <Icon name="more-vert" size={25} color={colors.titleBlack} />
              </TouchableOpacity>
            }>
            <Menu.Item
              onPress={getMyListing.bind(this, selected, '')}
              title={language.all}
              titleStyle={[
                selectedLanguage === 'arabic' && {textAlign: 'right'},
                styles.menuItem,
                status === '' && {color: colors.themeRed},
              ]}
              style={{height: 30}}
            />
            <Menu.Item
              onPress={getMyListing.bind(this, selected, 1)}
              title={language.active}
              titleStyle={[
                selectedLanguage === 'arabic' && {textAlign: 'right'},
                styles.menuItem,
                status === 1 && {color: colors.themeRed},
              ]}
              style={{height: 30}}
            />
            <Menu.Item
              onPress={getMyListing.bind(this, selected, 2)}
              title={language.pending}
              titleStyle={[
                selectedLanguage === 'arabic' && {textAlign: 'right'},
                styles.menuItem,
                status === 2 && {color: colors.themeRed},
              ]}
              style={{height: 30}}
            />
            <Menu.Item
              onPress={getMyListing.bind(this, selected, 3)}
              title={language.disabled}
              titleStyle={[
                selectedLanguage === 'arabic' && {textAlign: 'right'},
                styles.menuItem,
                status === 3 && {color: colors.themeRed},
              ]}
              style={{height: 30}}
            />
          </Menu>
        </View>
      ),
    });
  }, [
    getMyListing,
    language.active,
    language.all,
    language.disabled,
    language.pending,
    menu,
    navigation,
    selected,
    selectedLanguage,
    status,
  ]);

  const getMyListing = useCallback(
    async (selected = 'rent', status = '') => {
      setSelected(selected);
      setStatus(status);
      setLoading(true);
      setMenu(false);

      try {
        let base_url =
          'https://xionex.in/msaken/admin/public/api/properties-with-login';

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);

        let formdata = new FormData();
        formdata.append('property_for', selected);
        formdata.append('status', status);
        formdata.append('location', location ? location : '');
        formdata.append('userid', jsonUserCred.data.user.id);

        // eslint-disable-next-line no-undef
        const response = await fetch(base_url, {
          method: 'post',
          headers: headers,
          body: formdata,
        });

        const responseData = await response.json();

        if (selected === 'rent') {
          setRentData(responseData.data);
        } else {
          setSaleData(responseData.data);
        }
      } catch (error) {
        Alert.alert(error.message);
      } finally {
        setLoading(false);
      }
    },
    [jsonUserCred.data.user.id, location, token],
  );

  const closeMenu = item => {
    setVisible(item);
  };

  const ShareProperty = (shareLink, id) => {
    const data = selected === 'rent' ? rentData : saleData;
    data.map(item => {
      id === item.id &&
        Share.share({
          message: shareLink,
        });
    });
  };

  const deleteProperty = async id => {
    setLoading(true);
    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/properties-delete';

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);

      let formdata = new FormData();
      formdata.append('id', id);

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
        Alert.alert(responseData.message);
        getMyListing(selected, status);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };

  const deactivateProperty = async id => {
    setLoading(true);
    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/properties-active-deactive';

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);

      let formdata = new FormData();
      formdata.append('id', id);

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
        Alert.alert(responseData.message);
        getMyListing(selected, status);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };

  const getSingleProperty = async id => {
    setLoading(true);

    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/single-properties';
      let uploadData = new FormData();

      uploadData.append('p_id', id);
      uploadData.append('userid', jsonUserCred.data.user.id);
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.status === false) {
        throw new Error(responseData.message);
      } else {
        navigation.navigate('editProperty', {
          screen: 'editPropertyStep1',
          params: {reset: true, postPropertyData: responseData?.data, pId: id},
        });
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };
  useFocusEffect(
    useCallback(() => {
      getMyListing();
      // setSelected('rent');
      setMenu(false);
    }, [getMyListing]),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={colors.themeRed} />
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={getMyListing.bind(this, 'rent', status)}
          style={[
            styles.buttonView,
            selected === 'rent' && styles.redButtonView,
          ]}>
          <Text
            style={[
              {
                fontSize: 16,
                fontFamily: 'Roboto-Medium',
                fontWeight: 'bold',
              },
              selected === 'rent' && {color: colors.themeWhite},
            ]}>
            {language.forRent}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={getMyListing.bind(this, 'sale', status)}
          style={[
            styles.buttonView,
            selected === 'sale' && styles.redButtonView,
          ]}>
          <Text
            style={[
              {
                fontSize: 16,
                fontFamily: 'Roboto-Medium',
                fontWeight: 'bold',
              },
              selected === 'sale' && {color: colors.themeWhite},
            ]}>
            {language.forSale}
          </Text>
        </TouchableOpacity>
      </View>
      {selected === 'rent' && !rentData.length && (
        <View style={styles.noPropertyContainer}>
          <Text
            style={[
              styles.title,
              selectedLanguage === 'arabic' && {textAlign: 'right'},
            ]}>
            {language.noProperties}
          </Text>
        </View>
      )}

      {selected === 'sale' && !saleData.length && (
        <View style={styles.noPropertyContainer}>
          <Text
            style={[
              styles.title,
              selectedLanguage === 'arabic' && {textAlign: 'right'},
            ]}>
            {language.noProperties}
          </Text>
        </View>
      )}

      <View>
        <View style={styles.listContainer}>
          <FlatList
            data={selected === 'rent' ? rentData : saleData}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() =>
                    navigation.navigate('myListingDetails', {
                      p_id: item.id,
                    })
                  }>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    // onPress={() => navigation.navigate('houseProperty')}
                    onPress={() => console.log('dd')}
                    style={styles.sliderConatiner}>
                    <SliderComp
                      images={
                        // item.single_image.image.length > 0
                        //   ? item.single_image.image.map(item => ({
                        //       uri: `https://xionex.in/msaken/admin/public/uploads/products/${item.image}`,
                        //     }))
                        //   :
                        // images
                        item.single_image
                          ? [
                              {
                                uri: `https://xionex.in/msaken/admin/public/uploads/products/${item.single_image.image}`,
                              },
                            ]
                          : images
                      }
                      // sliderStyle={{width: '100%'}}
                      onCurrentImagePressed={() =>
                        navigation.navigate('myListingDetails', {
                          p_id: item.id,
                        })
                      }
                    />
                  </TouchableOpacity>

                  <View style={styles.detailsContainer}>
                    <View style={styles.optionConatiner}>
                      <Text style={styles.propertyTitle}>{item.name}</Text>
                      <View style={styles.iconView}>
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => ShareProperty(item.prourl, item.id)}>
                          <Icon
                            name="share"
                            size={20}
                            color={colors.darkGrey}
                          />
                        </TouchableOpacity>
                        <Menu
                          visible={index === visible}
                          onDismiss={closeMenu}
                          style={{height: 60}}
                          anchor={
                            <TouchableOpacity
                              activeOpacity={0.6}
                              onPress={() => setVisible(index)}
                              style={{marginLeft: 5}}>
                              <Icon
                                name="more-vert"
                                size={20}
                                color={colors.darkGrey}
                              />
                            </TouchableOpacity>
                          }>
                          <Menu.Item
                            onPress={deleteProperty.bind(this, item.id)}
                            title={language.delete}
                            titleStyle={[
                              styles.menuItem,
                              selectedLanguage === 'arabic' && {
                                textAlign: 'right',
                              },
                            ]}
                            style={{height: 30}}
                          />
                          <Menu.Item
                            onPress={deactivateProperty.bind(this, item.id)}
                            title={
                              item.status === 1
                                ? language.disabled
                                : language.activate
                            }
                            titleStyle={[
                              styles.menuItem,
                              selectedLanguage === 'arabic' && {
                                textAlign: 'right',
                              },
                            ]}
                            style={{height: 30}}
                            disabled={item.status === 2 && true}
                          />
                        </Menu>
                      </View>
                    </View>
                    <View style={styles.addressContainer}>
                      <Text style={styles.address}>{item.p_location}</Text>
                    </View>
                    <View style={{marginTop: 10}}>
                      <HouseInfo data={item} price={false} />
                    </View>

                    <View style={styles.priceContainer}>
                      <View style={{width: '40%'}}>
                        <Text style={styles.price}>
                          {item.price + 'SAR'}
                          {item.property_for === 'rent' && (
                            <Text
                              style={[
                                styles.price,
                                {fontSize: 10, fontFamily: 'Roboto-Medium'},
                              ]}>
                              /{language.month}
                            </Text>
                          )}
                        </Text>
                      </View>
                      <View style={styles.statusContainer}>
                        <TouchableOpacity
                          style={[
                            styles.statusButton,
                            {
                              backgroundColor:
                                item.status === 1
                                  ? '#077E8C'
                                  : item.status === 2
                                  ? '#595BD4'
                                  : '#F29339',
                              borderRadius: 5,
                            },
                          ]}>
                          {item.status === 1 ? (
                            <Text style={styles.status}>{language.active}</Text>
                          ) : item.status === 2 ? (
                            <Text style={styles.status}>
                              {language.pending}
                            </Text>
                          ) : (
                            <Text style={styles.status}>
                              {language.disabled}
                            </Text>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.statusButton,
                            {
                              backgroundColor: colors.themeRed,
                              borderRadius: 20,
                            },
                          ]}
                          activeOpacity={0.6}
                          onPress={getSingleProperty.bind(this, item.id)}>
                          <Text style={styles.status}>{language.edit}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.addContainer}
        onPress={() =>
          navigation.navigate('postProperty', {
            screen: 'postPropertyStep1',
            params: {reset: true},
          })
        }>
        <Icon name="add" color="white" size={30} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    // marginBottom: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 30,
    width: '80%',
    borderWidth: 1,
    borderColor: '#B9B9B9',
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
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    paddingTop: 15,
    flex: 1,
    backgroundColor: colors.themeWhite,
  },
  addContainer: {
    backgroundColor: color.themeRed,

    alignSelf: 'flex-end',

    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  noPropertyContainer: {
    margin: 20,
  },
  title: {
    // fontWeight: 'bold',
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
  },
  menuItem: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: color.darkGrey,
  },
  listContainer: {
    height: '93%',
    // paddingHorizontal: 20,
    marginVertical: 10,
  },
  itemContainer: {
    backgroundColor: colors.themeWhite,
    marginBottom: 10,
    elevation: 1,
    width: '95%',
    alignSelf: 'center',
  },

  sliderConatiner: {},
  image: {
    width: '100%',
    height: 150,
  },
  detailsContainer: {
    padding: 10,
  },
  optionConatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  iconView: {
    flexDirection: 'row',
  },
  address: {
    fontSize: 12,
    color: '#6B6B6B',
    fontFamily: 'Roboto-Regular',
  },
  addressContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  houseContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  houseItem: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    color: colors.grey,
    marginLeft: 5,
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.themeRed,
  },
  statusButton: {
    marginLeft: 5,
    width: '45%',
    padding: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    width: '60%',
    marginLeft: 5,
  },
  status: {
    fontSize: 12,
    color: colors.themeWhite,
    fontFamily: 'Roboto-regular',
  },
});

export default MyListingScreen;
