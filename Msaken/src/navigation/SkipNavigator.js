import React, {useState, useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContent,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import ION from 'react-native-vector-icons/Ionicons';
import AD from 'react-native-vector-icons/AntDesign';
import MON from 'react-native-vector-icons/MaterialIcons';
import SLICO from 'react-native-vector-icons/SimpleLineIcons';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import UserHouseProperty from '../screens/User/UserHouseProperty';
import {useNavigation} from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import colors from '../common/colors';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';
import Toast from 'react-native-simple-toast';
import color from '../common/colors';
import SkipDashBoard from '../screens/SkipNavigator/SkipDashBoard';
import UserFilter from '../screens/User/UserFilter';
import SkipFindAgents from '../screens/SkipNavigator/SkipFindAgents';
import {Modal, Portal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HelpUs from '../screens/HelpUs';
import AboutUs from '../screens/AboutUs';
import AgentDetails from '../screens/User/AgentDetails';

const Drawer = createDrawerNavigator();

const SelectLanguage = props => {
  const {languageHandler, language, selectedLanguage} = useContext(AuthContext);

  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={() => props.setVisible(false)}
        contentContainerStyle={styles.modalContainer}>
        <View>
          <View
            style={[
              styles.modalTilteContainer,
              selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
            ]}>
            <Text style={styles.modalTiltle}>{language.selectLanguage}</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => props.setVisible(false)}
              style={styles.closeIcon}>
              <Icon name="close" size={15} color={colors.grey} />
            </TouchableOpacity>
          </View>
          <View style={styles.languageContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                props.setLanguageSelected('Arabic'),
                  props.setVisible(false),
                  languageHandler('arabic');
              }}
              style={styles.languageView}>
              <Text
                style={[
                  styles.languageText,
                  selectedLanguage === 'arabic' && {
                    color: colors.themeRed,
                  },
                ]}>
                {language.arabic}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                props.setLanguageSelected('English'),
                  props.setVisible(false),
                  languageHandler('english');
              }}
              style={styles.languageView}>
              <Text
                style={[
                  styles.languageText,
                  selectedLanguage === 'english' && {
                    color: colors.themeRed,
                  },
                ]}>
                {language.english}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const CustomDrawerContentUser = props => {
  const {
    isLoggedIn,
    setIsLoggedIn,
    userCred,
    language,
    setIsSkip,
    selectedLanguage,
  } = useContext(AuthContext);

  const [SelectedLanguage, setSelectedLanguage] = useState('English');
  const navigation = useNavigation();
  const [modal, setModal] = useState(false);

  return (
    <DrawerContentScrollView {...props}>
      <SelectLanguage
        visible={modal}
        setVisible={setModal}
        setLanguageSelected={setSelectedLanguage}
        selectedLanguage={SelectedLanguage}
      />

      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            setIsSkip(false);
          }}>
          <Image
            style={styles.userIcon}
            source={require('../assets/user_pic.png')}
          />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'space-evenly',
            paddingVertical: 10,
            width: '66%',
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setIsSkip(false);
            }}>
            <Text style={styles.profileTitle}>{language.signIn}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} onPress={() => setModal(true)}>
            <Text style={styles.profileTitle}>
              {selectedLanguage === 'english'
                ? language.english
                : language.arabic}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: 0.6,
          opacity: 0.5,
          flex: 0.9,
        }}
      />

      <DrawerItem
        icon={({focused, color, size}) => (
          <AD name="addfile" color={colors.themeRed} size={18} />
        )}
        label={language?.postProperty}
        onPress={() => setIsSkip(false)}
      />

      <DrawerItem
        icon={({focused, color, size}) => (
          <ION name="search" color={colors.themeRed} size={18} />
        )}
        label={language?.findAgents}
        onPress={() => {
          navigation.navigate('skipFindAgents');
        }}
      />
      <DrawerItem
        icon={({focused, color, size}) => (
          <MON name="info" color={colors.themeRed} size={18} />
        )}
        label={language?.aboutUs}
        onPress={() => props.navigation.navigate('aboutUs')}
      />

      <DrawerItem
        icon={({focused, color, size}) => (
          <ION name="help-circle" color={colors.themeRed} size={18} />
        )}
        label={language.help}
        onPress={() => props.navigation.navigate('helpUs')}
      />
    </DrawerContentScrollView>
  );
};

const SkipNavigator = () => {
  const {language, filterData, selectedLanguage} = useContext(AuthContext);

  const FilterTitle = () => {
    return (
      <View style={styles.filterTitleContainer}>
        <Text style={styles.titleRed}>{filterData.length}</Text>
        <Text style={styles.filterTitle}>{language.results}</Text>
      </View>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={({navigation}) => {
        return {
          headerTitleAlign: 'center',
          headerShadowVisible: true,
          headerStyle: {
            elevation: 10,
            shadowOpacity: 0.26,
            shadowColor: 'black',
          },
          headerLeftContainerStyle: {
            color: 'white',
          },
          // drawerPosition: selectedLanguage == 'arabic' ? 'right' : 'left',

          headerLeft: () => (
            <TouchableOpacity
              style={{marginLeft: 20}}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-ios" size={25} color={'black'} />
            </TouchableOpacity>
          ),
        };
      }}
      backBehavior="history"
      drawerContent={props => <CustomDrawerContentUser {...props} />}>
      <Drawer.Screen
        name="skipDashBoard"
        component={SkipDashBoard}
        options={({navigation}) => {
          return {
            headerTransparent: true,
            headerTitle: '',
            headerLeftContainerStyle: {
              // backgroundColor: 'red',
              paddingLeft: 20,
            },
            headerLeft: () => (
              <TouchableOpacity
                style={{
                  backgroundColor: colors.themeRed,
                  padding: 10,

                  borderRadius: 100,
                  marginTop: 10,
                  elevation: 5,
                }}
                onPress={() => navigation.toggleDrawer()}>
                <Icon name="menu" size={25} color="white" />
              </TouchableOpacity>
            ),
          };
        }}
      />
      <Drawer.Screen
        name="userFilter"
        component={UserFilter}
        options={{
          headerTitle: () => <FilterTitle />,
          // swipeEnabled: false
        }}
      />
      <Drawer.Screen
        name="houseProperty"
        component={UserHouseProperty}
        options={({navigation}) => ({
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              style={{marginLeft: 20}}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-ios" size={25} color={'white'} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="skipFindAgents"
        component={SkipFindAgents}
        options={{title: language.findAgents}}
      />

      <Drawer.Screen
        name="helpUs"
        component={HelpUs}
        options={{title: language.letUsHelpYou}}
      />

      <Drawer.Screen
        name="aboutUs"
        component={AboutUs}
        options={{title: language.aboutUs}}
      />

      <Drawer.Screen
        name="agentDetails"
        component={AgentDetails}
        options={({navigation}) => ({
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              style={{marginLeft: 20}}
              onPress={() => navigation.navigate('skipFindAgents')}>
              <Icon name="arrow-back-ios" size={25} color={'white'} />
            </TouchableOpacity>
          ),
        })}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
  },
  modalTiltle: {
    width: '90%',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colors.titleBlack,
  },
  closeIcon: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 15,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  languageContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  languageView: {
    marginVertical: 5,
  },
  languageText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.darkGrey,
  },
  profileTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.titleBlack,
  },
  userIcon: {
    height: 50,
    width: 50,
    paddingBottom: 20,
    margin: 20,
    alignSelf: 'center',
  },

  button: {
    margin: 12,
    padding: 10,
    backgroundColor: color.themeRed,
    borderRadius: 40,
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    margin: 10,
    backgroundColor: color.inputBgGrey,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    borderRadius: 20,
    backgroundColor: color.inputBgGrey,
    color: '#424242',
  },
  socialLogo: {
    height: 22,
    resizeMode: 'contain',
    width: 22,
    margin: 5,
  },
  closeDrawer: {
    alignSelf: 'flex-end',
  },
  filterTitleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  filterTitle: {
    color: colors.titleBlack,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    paddingLeft: 5,
  },
  titleRed: {
    color: colors.themeRed,
    fontSize: 20,
    fontFamily: 'Roboto_Bold',
  },
});

export default SkipNavigator;
