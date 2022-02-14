import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import colors from '../../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import HouseDetails from '../../components/Common/HouseDetails';
import MapView, {Callout, Marker} from 'react-native-maps';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import AgentInfo from '../../components/Common/AgentInfo';
import color from '../../common/colors';
import {AuthContext} from '../../context/AuthContext';
import Toast from 'react-native-simple-toast';

const SkipFindAgents = props => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [isLoading, setLoading] = useState(false);
  const {userCred, language, selectedLanguage} = useContext(AuthContext);
  const [AgentData, setAgentData] = useState([]);

  const updateSearch = text => {
    setSearch(text);
  };

  const getAgents = useCallback(async () => {
    setLoading(true);

    try {
      let base_url = 'https://xionex.in/msaken/admin/public/api/get-agent';
      let uploadData = new FormData();

      uploadData.append('search_key', search);
      uploadData.append('userid', null);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.status === false) {
        setAgentData([]);
        // throw new Error(responseData.message);
      } else {
        setAgentData(responseData.data);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const likeHandler = id => {
    Toast.show(
      language.pleaseLoginYourAccountToLikeThePropertyThanks,
      Toast.SHORT,
    );
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     return setSearch(''), setAgentData([]);
  //   }, []),
  // );
  useFocusEffect(
    useCallback(() => {
      return setSearch(''), setAgentData([]);
    }, []),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={colors.themeRed} />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.screen}>
        <View style={[styles.searchContainer]}>
          <Text style={styles.title}>
            {language.findyourtrustedRealEstateAgent}
          </Text>
          <View style={{alignItems: 'center', width: '100%'}}>
            <Text style={styles.text}>
              {language.findingARealEstateProfessionalWhoCanHelpYou}
            </Text>
            <Text style={styles.text}>
              {language.whetherYoureBuyingOrSellingRentingOr}
            </Text>
            <Text tyle={styles.text}>
              {language.relocatingWeHaveGotYouCovered}
            </Text>
          </View>

          <View
            style={[
              styles.searchView,
              selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
            ]}>
            <TextInput
              placeholder={language.enteryourCityAddressOrAgentName}
              placeholderTextColor={color.lightGrey}
              value={search}
              name="search"
              style={[
                styles.searchInput,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}
              onChangeText={updateSearch}
            />
            <TouchableOpacity
              style={styles.serachIcon}
              activeOpacity={0.6}
              onPress={() => setSearch('')}>
              <Icon name="close" size={15} color={colors.lightGrey} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.searchButton]}
            activeOpacity={0.6}
            onPress={() => getAgents()}>
            <Text style={styles.buttonText}>{language.findAnAgent}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            initialNumToRender={2}
            data={AgentData}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View>
                <Text
                  style={[
                    styles.noData,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}>
                  {language.noAgentsToShow}
                </Text>
              </View>
            )}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <AgentInfo data={item} agent={true} likeHandler={likeHandler} />
              );
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.themeWhite,
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    margin: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginBottom: 10,
    color: color.titleBlack,
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: color.titleBlack,
    textAlign: 'center',
  },
  searchView: {
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: '#B9B9B9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '90%',
    height: 45,
  },
  searchInput: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    flexBasis: '90%',
  },
  serachIcon: {
    borderWidth: 1,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderColor: color.lightGrey,
  },
  searchButton: {
    marginTop: 20,
    backgroundColor: '#000000',
    width: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    color: colors.themeWhite,
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
  },
  listContainer: {
    height: '60%',
    // marginHorizontal: 15,
  },
  noData: {
    // fontWeight: 'bold',
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: 16,
    marginHorizontal: 15,
  },
});

export default SkipFindAgents;
