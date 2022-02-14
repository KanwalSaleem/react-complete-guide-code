import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import color from '../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {onChange} from 'react-native-reanimated';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const SeacrhProperty = () => {
  const [searchProperty, setSearchProperty] = useState('');
  const [recentSearchProperty, setRecentSearchProperty] = useState([]);
  const navigation = useNavigation();
  const setSearch = text => {
    setSearchProperty(text);
  };
  const {language, selectedLanguage} = useContext(AuthContext);

  const recentSearch = () => {
    if (
      searchProperty === '' ||
      recentSearchProperty.includes(searchProperty)
    ) {
      setRecentSearchProperty(recentSearchProperty);
    } else {
      setRecentSearchProperty(prev => prev.concat(searchProperty));
    }

    const recentProperty = JSON.stringify(recentSearchProperty);
    AsyncStorage.setItem('recentSearch', recentProperty);

    navigation.navigate('myListing', searchProperty);
  };

  const removeSearch = name => {
    setRecentSearchProperty(prev => prev.filter(item => item != name));
  };

  const getSearchDetails = async () => {
    const recentProperty = await AsyncStorage.getItem('recentSearch');
    if (recentProperty != null) {
      setRecentSearchProperty(JSON.parse(recentProperty));
    } else {
      setRecentSearchProperty([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setSearchProperty('');
    }, []),
  );

  useEffect(() => {
    getSearchDetails();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.screen}
      keyboardShouldPersistTaps={'handled'}>
      <View
        style={[
          styles.inputContainer,
          selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
        ]}>
        <TextInput
          placeholder={language.startTyping}
          multiline={true}
          value={searchProperty}
          onChangeText={setSearch}
          style={styles.inputText}
          placeholderTextColor={color.lightGrey}
        />
        {/* <ScrollView
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{
            width: '100%',
          }}>
          <GooglePlacesAutocomplete
            nestedScrollEnabled={true}
            autoFocus={false}
            textInputProps={{
              placeholderTextColor: Colors.lightGrey,
              color: Colors.lightGrey,
              returnKeyType: 'next',
              fontSize: 14,
              multiline: true,
              fontFamily: 'Roboto-Regular',
              value: searchProperty,
              onChangeText: setSearchProperty,
            }}
            styles={{listView: {maxHeight: 150, width: '100%'}}}
            listViewDisplayed={false}
            placeholder={language.startTyping}
            placeholderTextColor={Colors.lightGrey}
            onPress={data => {
              setSearchProperty(data.description);
            }}
            query={{
              key: 'AIzaSyD6H1cGAMzHOID3_rSUMB7Uxx1CE0SlP0c',
              language: 'en',
            }}
          />
        </ScrollView> */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={recentSearch}
          style={styles.icon}>
          <Icon name="search" color={color.lightGrey} size={20} />
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.recentTitle,
          selectedLanguage === 'arabic' && {textAlign: 'right'},
        ]}>
        {language.recentSearches}
      </Text>
      <View style={{marginTop: 20}}>
        {recentSearchProperty.map((item, index) => {
          return (
            <View key={index} style={styles.recentSearchContainer}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.navigate('myListing', item)}>
                <Text style={styles.recentSearchTitle}>{item}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={removeSearch.bind(this, item)}
                style={styles.closeIcon}>
                <Icon name="close" color={color.lightGrey} size={15} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: color.themeWhite,
    flexGrow: 1,
    padding: 15,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: color.themeRed,
    borderRadius: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    alignItems: 'center',
  },
  inputText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: color.inputFontBlack,
    width: '90%',
    flexBasis: '90%',
  },
  icon: {
    // top: 15,
  },

  recentTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: color.titleBlack,
    marginTop: 20,
  },
  recentSearchContainer: {
    backgroundColor: color.inputBgGrey,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    width: '100%',
    alignSelf: 'center',
  },
  recentSearchTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: color.inputFontBlack,
  },
  closeIcon: {
    marginHorizontal: 3,
    borderWidth: 1,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderColor: color.lightGrey,
  },
});

export default SeacrhProperty;
