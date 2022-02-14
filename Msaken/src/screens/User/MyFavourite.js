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
  FlatList,
} from 'react-native';
import color from '../../common/colors';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import MON from 'react-native-vector-icons/MaterialIcons';
import HouseDetails from '../../components/Common/HouseDetails';
import {Menu} from 'react-native-paper';
import {AuthContext} from '../../context/AuthContext';
import AgentInfo from '../../components/Common/AgentInfo';
import FavoriteAll from '../../components/Common/FavoriteAll';

const MyFavourite = props => {
  const [saleData, setSaleData] = useState([]);
  const [rentData, setRentData] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [status, setStatus] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [menu, setMenu] = useState(false);
  const {userCred, language, selectedLanguage} = useContext(AuthContext);
  const jsonUserCred = JSON.parse(userCred);
  const token = jsonUserCred.data.token;

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => props.navigation.navigate('searchProperty')}>
            <MON name="search" size={25} color={color.titleBlack} />
          </TouchableOpacity>
          <Menu
            visible={menu}
            onDismiss={() => setMenu(false)}
            anchor={
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setMenu(true)}
                style={{marginRight: 5}}>
                <MON name="more-vert" size={25} color={color.titleBlack} />
              </TouchableOpacity>
            }>
            <Menu.Item
              onPress={() => {
                setStatus('all'), setMenu(false);
              }}
              title={language.all}
              titleStyle={[
                styles.menuItem,
                status === 'all' && {color: color.themeRed},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}
              style={{height: 30}}
            />
            <Menu.Item
              onPress={() => {
                setStatus('sale'), setMenu(false);
              }}
              title={language.toBuy}
              titleStyle={[
                styles.menuItem,
                status === 'sale' && {color: color.themeRed},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}
              style={{height: 30}}
            />
            <Menu.Item
              onPress={() => {
                setStatus('rent'), setMenu(false);
              }}
              title={language.toRent}
              titleStyle={[
                styles.menuItem,
                status === 'rent' && {color: color.themeRed},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}
              style={{height: 30}}
            />
            <Menu.Item
              titleStyle={[
                styles.menuItem,
                status === 'agent' && {color: color.themeRed},
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}
              onPress={() => {
                setStatus('agent'), setMenu(false);
              }}
              title={language.agents}
              style={{height: 30}}
            />
          </Menu>
        </View>
      ),
    });
  }, [
    language.agents,
    language.all,
    language.toBuy,
    language.toRent,
    menu,
    props.navigation,
    selectedLanguage,
    status,
  ]);

  const getProperties = useCallback(async () => {
    setLoading(true);
    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/get-my-favorite';

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      let uploadData = new FormData();

      uploadData.append('userid', jsonUserCred.data.user.id);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        headers: headers,
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.error === false) {
        setAllData(
          responseData?.data?.sale
            .concat(responseData?.data?.rent)
            .concat(responseData?.data?.users),
        );

        setRentData(responseData?.data?.rent);
        setSaleData(responseData?.data?.sale);
        setAgentData(responseData?.data?.users);
      } else {
        setRentData([]);
        setSaleData([]);
        setAllData([]);
        setAgentData([]);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }, [jsonUserCred.data.user.id, token]);

  const likeHandler = async (id, likeStatus) => {
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
        if (status === 'rent') {
          setRentData(prev => prev.filter(item => item.id != id));
          setAllData(prev => prev.filter(item => item.id != id));
        }
        if (status === 'sale') {
          setSaleData(prev => prev.filter(item => item.id != id));
          setAllData(prev => prev.filter(item => item.id != id));
        }
        if (status === 'all') {
          setAllData(prev => prev.filter(item => item.id != id)),
            setSaleData(prev => prev.filter(item => item.id != id));
          setRentData(prev => prev.filter(item => item.id != id));
        }
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const agentLikeHandler = async id => {
    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/red-heart-like-user';

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      let formdata = new FormData();
      formdata.append('id', id);
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
        setAgentData(prev => prev.filter(item => item.id != id));

        setAllData(prev => prev.filter(item => item.id != id));
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getProperties();
      setMenu(false);
      setStatus('all');
    }, [getProperties]),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={color.themeRed} />
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={styles.mainContainer}>
        {allData?.length > 0 ? (
          status === 'all' ? (
            <FavoriteAll
              data={allData}
              agentLikeHandler={agentLikeHandler}
              likeHandler={likeHandler}
            />
          ) : status != 'agent' ? (
            <HouseDetails
              data={
                status === 'rent'
                  ? rentData?.length > 0
                    ? rentData
                    : []
                  : saleData?.length > 0
                  ? saleData
                  : []
              }
              style={{height: '98%'}}
              likeHandler={likeHandler}
              myFavourite={true}
            />
          ) : (
            <View style={styles.listContainer}>
              <FlatList
                initialNumToRender={2}
                data={agentData}
                keyExtractor={item => item.id}
                ListEmptyComponent={() => (
                  <View>
                    <Text
                      style={[
                        styles.title,
                        selectedLanguage === 'arabic' && {textAlign: 'right'},
                      ]}>
                      {language.noAgentsToShow}
                    </Text>
                  </View>
                )}
                renderItem={({item}) => {
                  return (
                    <AgentInfo
                      data={item}
                      agent={true}
                      likeHandler={agentLikeHandler}
                    />
                  );
                }}
              />
            </View>
          )
        ) : (
          <Text style={styles.title}>
            {language.noListFoundPleaseAddPropertiesOrAgentsIntoYourFavorites}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activity: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flexGrow: 1,
    backgroundColor: color.themeWhite,
  },
  mainContainer: {
    marginVertical: 10,
    height: '98%',
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
    // paddingHorizontal: 20,
    height: '96%',
  },
  noData: {
    // fontWeight: 'bold',
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: 14,
  },
  title: {
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default MyFavourite;
