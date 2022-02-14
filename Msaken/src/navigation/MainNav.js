import React, {useState, useContext, useEffect, useCallback} from 'react';
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
import Dashboard from '../screens/Dashboard';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import {
  Image,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';
import Toast from 'react-native-simple-toast';
import color from '../common/colors';
import {grey100} from 'react-native-paper/lib/typescript/styles/colors';
import UserDashBoard from '../screens/User/UserDashBoard';
import UserFilter from '../screens/User/UserFilter';
import UserFindAgents from '../screens/User/FindAgents';
import {Modal, Portal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MyListing from '../screens/MyListing';
import Account from '../screens/Account';
import HelpUs from '../screens/HelpUs';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import EditProfile from '../screens/EditProfile';
import TermsConditions from '../screens/TermsConditions';
import InviteFriends from '../screens/InviteFriends';
import AboutUs from '../screens/AboutUs';
import Notifications from '../screens/Notifications';
import ResetPassword from '../screens/ResetPassword';
import AgentDetails from '../screens/User/AgentDetails';
import AgentHouseProperty from '../screens/Agent/AgentHouseProperty';
import MyFavourite from '../screens/User/MyFavourite';
import MyListingDetails from '../screens/MyListingDetails';
import SearchProperty from '../screens/SearchProperty';
import PostPropertyStep1 from '../screens/PostPropertyStep1';
import PostPropertyStep2 from '../screens/PostPropertyStep2';
import PostPropertyStep3 from '../screens/PostPropertyStep3';
import EditPropertyStep1 from '../screens/EditPropertyStep1';
import EditPropertyStep2 from '../screens/EditPropertyStep2';
import EditPropertyStep3 from '../screens/EditPropertyStep3';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const UserStack = createStackNavigator();
const PostPropertyStack = createStackNavigator();
const EditPropertyStack = createStackNavigator();

const SelectLanguage = props => {
  const {languageHandler, language, isSkip, selectedLanguage} =
    useContext(AuthContext);

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
                props.setLanguageSelected('arabic'),
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

function CustomDrawerContentAgent(props) {
  const {isLoggedIn, setIsLoggedIn, userCred, language, selectedLanguage} =
    useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const userParseData = JSON.parse(userCred);
  const userData = userParseData.data.user;
  const [SelectedLanguage, setSelectedLanguage] = useState('English');

  return (
    <DrawerContentScrollView {...props}>
      <SelectLanguage
        visible={modal}
        setVisible={setModal}
        setLanguageSelected={setSelectedLanguage}
        selectLanguage={SelectLanguage}
      />
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            props.navigation.navigate('account');
          }}>
          <Image
            style={styles.userIcon}
            source={require('../assets/profile-pic.png')}
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
              props.navigation.navigate('account');
            }}>
            <Text style={styles.profileTitle}>{userData.full_name}</Text>
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
          <ION name="list" color={colors.themeRed} size={18} />
        )}
        label={language?.myListing}
        onPress={() => {
          props.navigation.navigate('myListing');
        }}
      />

      <DrawerItem
        icon={({focused, color, size}) => (
          <AD name="addfile" color={colors.themeRed} size={18} />
        )}
        label={language?.postProperty}
        onPress={() =>
          props.navigation.navigate('postProperty', {
            screen: 'postPropertyStep1',
            params: {reset: true},
          })
        }
      />
      <DrawerItem
        icon={({focused, color, size}) => (
          <ION name="notifications" color={colors.themeRed} size={18} />
        )}
        label={language?.notifications}
        onPress={() => {
          props.navigation.navigate('notifications');
        }}
      />
      <DrawerItem
        icon={({focused, color, size}) => (
          <ION name="help-circle" color={colors.themeRed} size={18} />
        )}
        label={language?.help}
        onPress={() => props.navigation.navigate('helpUs')}
      />

      <DrawerItem
        icon={({focused, color, size}) => (
          <ION name="people" color={colors.themeRed} size={18} />
        )}
        label={language?.inviteFriends}
        onPress={() => props.navigation.navigate('inviteFriends')}
      />

      <DrawerItem
        icon={({focused, color, size}) => (
          <SLICO name="logout" color={colors.themeRed} size={18} />
        )}
        label={language?.logout}
        labelStyle={{color: color.themeRed}}
        onPress={async () => {
          const loginType = await AsyncStorage.getItem('loginType');
          if (loginType == 'google') {
            try {
              await GoogleSignin.signOut();
              await AsyncStorage.setItem('loginStatus', 'loggedOut');
              await AsyncStorage.setItem('userCredentials', '');
              setIsLoggedIn(false);
            } catch (error) {
              console.error(error);
              Toast.show('Something went wrong !', Toast.SHORT);
            }
          } else {
            await AsyncStorage.setItem('loginStatus', 'loggedOut');
            await AsyncStorage.setItem('userCredentials', '');
            setIsLoggedIn(false);
          }
        }}
      />
    </DrawerContentScrollView>
  );
}

function CustomDrawerContentUser(props) {
  const {isLoggedIn, setIsLoggedIn, userCred, language, selectedLanguage} =
    useContext(AuthContext);
  const userParseData = JSON.parse(userCred);
  const userData = userParseData.data.user;
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
            props.navigation.navigate('account');
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
              props.navigation.navigate('account');
            }}>
            <Text style={styles.profileTitle}>{userData.full_name}</Text>
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
          <ION name="heart" color={colors.themeRed} size={18} />
        )}
        label={language?.myFavorite}
        onPress={() => props.navigation.navigate('myFavourite')}
      />

      <DrawerItem
        icon={({focused, color, size}) => (
          <FA5 name="clipboard-list" color={colors.themeRed} size={18} />
        )}
        label={language?.myListing}
        onPress={() => navigation.navigate('myListing')}
      />
      <DrawerItem
        icon={({focused, color, size}) => (
          <AD name="addfile" color={colors.themeRed} size={18} />
        )}
        label={language?.postProperty}
        onPress={() =>
          navigation.navigate('postProperty', {
            screen: 'postPropertyStep1',
            params: {reset: true},
          })
        }
      />

      <DrawerItem
        icon={({focused, color, size}) => (
          <ION name="search" color={colors.themeRed} size={18} />
        )}
        label={language?.findAgents}
        onPress={() => {
          navigation.navigate('userFindAgents');
        }}
      />
      <DrawerItem
        icon={({focused, color, size}) => (
          <ION name="notifications" color={colors.themeRed} size={18} />
        )}
        label={language?.notifications}
        onPress={() => {
          props.navigation.navigate('notifications');
        }}
      />

      <DrawerItem
        icon={({focused, color, size}) => (
          <ION name="help-circle" color={colors.themeRed} size={18} />
        )}
        label={language.help}
        onPress={() => props.navigation.navigate('helpUs')}
      />

      <DrawerItem
        icon={({focused, color, size}) => (
          <ION name="people" color={colors.themeRed} size={18} />
        )}
        label={language?.inviteFriends}
        onPress={() => props.navigation.navigate('inviteFriends')}
      />

      <DrawerItem
        icon={({focused, color, size}) => (
          <SLICO name="logout" color={colors.themeRed} size={18} />
        )}
        label={language?.logout}
        labelStyle={{color: color.themeRed}}
        onPress={async () => {
          const loginType = await AsyncStorage.getItem('loginType');
          if (loginType == 'google') {
            try {
              await GoogleSignin.signOut();
              await AsyncStorage.setItem('loginStatus', 'loggedOut');
              await AsyncStorage.setItem('userCredentials', '');
              setIsLoggedIn(false);
            } catch (error) {
              console.error(error);
              Toast.show('Something went wrong !', Toast.SHORT);
            }
          } else {
            await AsyncStorage.setItem('loginStatus', 'loggedOut');
            await AsyncStorage.setItem('userCredentials', '');
            setIsLoggedIn(false);
          }
        }}
      />
    </DrawerContentScrollView>
  );
}

const PostPropertyStackNavigator = () => {
  const {language} = useContext(AuthContext);
  return (
    <PostPropertyStack.Navigator
      initialRouteName="postPropertyStep1"
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
          headerTitle: language.postProperty,

          headerLeft: () => (
            <TouchableOpacity
              style={{marginLeft: 20}}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-ios" size={25} color={'black'} />
            </TouchableOpacity>
          ),
        };
      }}>
      <PostPropertyStack.Screen
        name="postPropertyStep1"
        component={PostPropertyStep1}
      />
      <PostPropertyStack.Screen
        name="postPropertyStep2"
        component={PostPropertyStep2}
      />
      <PostPropertyStack.Screen
        name="postPropertyStep3"
        component={PostPropertyStep3}
      />
    </PostPropertyStack.Navigator>
  );
};

const EditPropertyStackNavigator = () => {
  const {language} = useContext(AuthContext);
  return (
    <EditPropertyStack.Navigator
      initialRouteName="editPropertyStep1"
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
          headerTitle: language.editProperty,

          headerLeft: () => (
            <TouchableOpacity
              style={{marginLeft: 20}}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-ios" size={25} color={'black'} />
            </TouchableOpacity>
          ),
        };
      }}>
      <EditPropertyStack.Screen
        name="editPropertyStep1"
        component={EditPropertyStep1}
      />
      <EditPropertyStack.Screen
        name="editPropertyStep2"
        component={EditPropertyStep2}
      />
      <EditPropertyStack.Screen
        name="editPropertyStep3"
        component={EditPropertyStep3}
      />
    </EditPropertyStack.Navigator>
  );
};

const Root = () => {
  const [tokenData, setTokenData] = useState();
  const [isLoading, setLoading] = useState(true);

  const {isLoggedIn, setIsLoggedIn, userCred, language, filterData} =
    useContext(AuthContext);
  const jsonUserCred = JSON.parse(userCred);
  const token = jsonUserCred.data.token;
  const [modalVisible, setModalVisible] = useState(true);
  useEffect(() => {
    // console.log((tokenData != undefined?.data.user.role) === 'buyer');
    try {
      setTokenData(JSON.parse(userCred));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const FilterTitle = () => {
    return (
      <View style={styles.filterTitleContainer}>
        <Text style={styles.titleRed}>{filterData.length}</Text>
        <Text style={styles.filterTitle}>{language.results}</Text>
      </View>
    );
  };

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={colors.themeRed} />
    </View>
  ) : tokenData?.data.user.role === 'buyer' ? (
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
        name="userDashBoard"
        component={UserDashBoard}
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
        options={{headerTitle: () => <FilterTitle />, swipeEnabled: false}}
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
        name="userFindAgents"
        component={UserFindAgents}
        options={{title: language.findAgents}}
      />
      <Drawer.Screen
        name="myListing"
        component={MyListing}
        options={{title: language.myListing}}
      />
      <Drawer.Screen
        name="postProperty"
        component={PostPropertyStackNavigator}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="editProperty"
        component={EditPropertyStackNavigator}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name="account"
        component={Account}
        options={{title: language.account}}
      />
      <Drawer.Screen
        name="privacyPolicy"
        component={PrivacyPolicy}
        options={{title: language.privacyPolicy}}
      />
      <Drawer.Screen
        name="helpUs"
        component={HelpUs}
        options={{title: language.letUsHelpYou}}
      />
      <Drawer.Screen
        name="editProfile"
        component={EditProfile}
        options={{title: language.editProfile}}
      />
      <Drawer.Screen
        name="termsConditions"
        component={TermsConditions}
        options={{title: language.termsOfUse}}
      />
      <Drawer.Screen
        name="inviteFriends"
        component={InviteFriends}
        options={{title: language.inviteFriends}}
      />
      <Drawer.Screen
        name="aboutUs"
        component={AboutUs}
        options={{title: language.aboutUs}}
      />
      <Drawer.Screen
        name="notifications"
        component={Notifications}
        options={{title: language.notifications}}
      />
      <Drawer.Screen
        name="changePassword"
        component={ResetPassword}
        options={{title: language.changePassword}}
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
              onPress={() => navigation.navigate('userFindAgents')}>
              <Icon name="arrow-back-ios" size={25} color={'white'} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="myFavourite"
        component={MyFavourite}
        options={{title: language.myFavourite}}
      />
      <Drawer.Screen
        name="myListingDetails"
        component={MyListingDetails}
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
        name="searchProperty"
        component={SearchProperty}
        options={{title: language.search}}
      />
    </Drawer.Navigator>
  ) : (
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
      drawerContent={props => <CustomDrawerContentAgent {...props} />}>
      <Drawer.Screen
        name="myListing"
        component={MyListing}
        options={({navigation}) => {
          return {
            title: language.myListing,

            headerLeft: () => (
              <TouchableOpacity
                style={{marginLeft: 20}}
                onPress={() => navigation.toggleDrawer()}>
                <FA5 name="grip-lines" size={25} color={colors.themeRed} />
              </TouchableOpacity>
            ),
          };
        }}
      />

      <Drawer.Screen
        name="houseProperty"
        component={AgentHouseProperty}
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
        name="account"
        component={Account}
        options={{title: language.account}}
      />
      <Drawer.Screen
        name="privacyPolicy"
        component={PrivacyPolicy}
        options={{title: language.privacyPolicy}}
      />
      <Drawer.Screen
        name="helpUs"
        component={HelpUs}
        options={{title: language.letUsHelpYou}}
      />
      <Drawer.Screen
        name="editProfile"
        component={EditProfile}
        options={{title: language.editProfile}}
      />
      <Drawer.Screen
        name="termsConditions"
        component={TermsConditions}
        options={{title: language.termsOfUse}}
      />
      <Drawer.Screen
        name="inviteFriends"
        component={InviteFriends}
        options={{title: language.inviteFriends}}
      />
      <Drawer.Screen
        name="aboutUs"
        component={AboutUs}
        options={{title: language.aboutUs}}
      />
      <Drawer.Screen
        name="notifications"
        component={Notifications}
        options={{title: language.notifications}}
      />
      <Drawer.Screen
        name="changePassword"
        component={ResetPassword}
        options={{title: language.changePassword}}
      />
      <Drawer.Screen
        name="myListingDetails"
        component={MyListingDetails}
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
        name="postProperty"
        component={PostPropertyStackNavigator}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="editProperty"
        component={EditPropertyStackNavigator}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="searchProperty"
        component={SearchProperty}
        options={{title: language.search}}
      />
    </Drawer.Navigator>
  );
};

function PublicNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}>
      <Stack.Screen name="Dashboard" component={Root} />
    </Stack.Navigator>
  );
}

// function UserNav() {
//   return (
//     <UserStack.Navigator
//       screenOptions={{
//         headerShown: false,
//         animationEnabled: false,
//       }}>
//       <UserStack.Screen name="userDashBoard" component={UserDashBoard} />
//       <UserStack.Screen
//         name="userFilter"
//         component={UserFilter}
//         options={{headerShown: false}}
//       />
//       <UserStack.Screen
//         name="userHouseProperty"
//         component={UserHouseProperty}
//         options={{headerShown: false}}
//       />
//       <UserStack.Screen
//         name="userFindAgents"
//         component={UserFindAgents}
//         options={{headerShown: false}}
//       />
//       <UserStack.Screen
//         name="userMyListing"
//         component={UserMyListing}
//         options={{headerShown: false}}
//       />
//       <UserStack.Screen
//         name="userPostProperty"
//         component={UserPostProperty}
//         options={{headerShown: false}}
//       />
//     </UserStack.Navigator>
//   )
// }

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
    fontFamily: 'Roboto-Bold',
  },
});

export default PublicNav;
