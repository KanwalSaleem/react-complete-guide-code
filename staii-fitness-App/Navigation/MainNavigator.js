import React, {useContext} from 'react';
import {TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

import DashBoard from '../Screens/DashBoard';
import ExpertDashboard from '../Screens/ExpertDashboard';
import Profile from '../Screens/Profile';
import Search from '../Screens/Search';
import SearchDetails from '../Screens/SearchDetails';
import Analysis1 from '../Screens/Analysis1';
import Analyse from '../Screens/Analyse';
import UploadExpertVideo from '../Screens/UploadExpertVideo';
import Improvements from '../Screens/Improvements';
import CustomDrawer from '../Components/CustomDrawer';

import AppContext from '../Context/AppContext';
import Colors from '../Constants/Colors';
// import AgeSelection from '../Screens/AgeSelection'
// import close from '../assets/Close.png'// import back from '../assets/back.png'// import menu from '../assets/Menu.png'// import Menu from '../Screens/Menu'

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const MainNavigator = () => {
  const {user} = useContext(AppContext);
  return (
    <Stack.Navigator
      initialRouteName={'dashBoardStack'}
      screenOptions={{
        animationTypeForReplace: 'pop',
        headerBackTitleVisible: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="dashBoardStack"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />

      {/* <Stack.Group
        screenOptions={({navigation}) => {
          return {
            animation: 'slide_from_right',
            headerBackImageSource: back,
            contentStyle: {
              backgroundColor: 'black',
              paddingTop: 20,
            },
            headerStyle: {
              backgroundColor: 'black',
            },
            headerBackVisible: true,
            headerTitle: '',
            headerRight: () => (
              <></>
              // <TouchableOpacity
              //   onPress={() => navigation.replace('dashBoardStack')}>
              //   <Image source={close} style={{width: 16, height: 16}} />
              // </TouchableOpacity>
            ),
          }
        }}>
        <Stack.Screen
          name="selectSport"
          component={SportSelection}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="selectAge"
          component={AgeSelection}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Group> */}
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  const {user} = useContext(AppContext);
  return (
    <Drawer.Navigator
      backBehavior="history"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={({navigation}) => {
        return {
          drawerStyle: {width: '100%'},
          swipeEnabled: false,

          contentStyle: {
            backgroundColor: 'black',
            paddingTop: 20,
          },
          headerStyle: {
            backgroundColor: 'black',
          },

          headerBackVisible: true,
          headerShown: false,
          // title: '',
          // headerLeft: () => (
          //   <TouchableOpacity style={{marginLeft: 10}}>
          //     <Image source={menu} style={{width: 26, height: 30}} />
          //   </TouchableOpacity>
          // ),
        };
      }}>
      {/* <Drawer.Screen name="bottomBar" component={BottomBar} /> */}

      <Drawer.Screen
        name="dashBoard"
        component={user.user_type === 'teacher' ? ExpertDashboard : DashBoard}
        // component={user.user_type === 'teacher' ? DashBoard : ExpertDashboard}
        options={({navigation}) => {
          return {
            headerTransparent: true,
            headerTitle: '',
            headerShown: true,
            headerLeftContainerStyle: {
              // backgroundColor: 'red',
              paddingLeft: 20,
            },
            headerRight: () => (
              <>
                {user.user_type === 'teacher' && (
                  <TouchableOpacity
                    style={{marginRight: 10}}
                    onPress={() => navigation.navigate('uploadExpertVideo')}>
                    <Icon name="add-circle" color={Colors.primary} size={43} />
                  </TouchableOpacity>
                )}
              </>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Image
                  source={require('../assets/Menu.png')}
                  style={{width: 26, height: 30}}
                />
              </TouchableOpacity>
            ),
          };
        }}
      />
      <Drawer.Group
        screenOptions={({navigation}) => {
          return {
            contentStyle: {
              backgroundColor: 'black',
            },
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTitleAlign: 'center',
            headerBackVisible: true,
            headerShown: true,
            title: 'Analyse',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{marginLeft: 10}}>
                <Icon name="arrow-back" color={'#EDECF4'} size={25} />
              </TouchableOpacity>
            ),
          };
        }}>
        <Drawer.Screen name="analyse" component={Analyse} />
        <Drawer.Screen name="improvements" component={Improvements} />
        <Drawer.Screen
          name="profile"
          component={Profile}
          options={{title: 'Profile'}}
        />
        <Drawer.Screen name="analysis1" component={Analysis1} />
      </Drawer.Group>
      <Drawer.Group>
        <Drawer.Screen
          name="search"
          component={Search}
          options={({navigation}) => {
            return {
              headerTransparent: true,
              headerTitle: '',
              headerShown: true,
              headerLeftContainerStyle: {
                // backgroundColor: 'red',
                paddingLeft: 20,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                  <Image
                    source={require('../assets/drawerMenu.png')}
                    style={styles.searchHeader}
                  />
                </TouchableOpacity>
              ),
            };
          }}
        />
        <Drawer.Screen
          name="uploadExpertVideo"
          component={UploadExpertVideo}
          options={props => {
            console.log(props.navigation.openDrawer);
            return {
              title: '',
              headerShown: true,
              headerLeft: () => <></>,
              headerRight: ({pressOpacity}) => (
                <TouchableOpacity
                  style={styles.titleContainer}
                  activeOpacity={pressOpacity}
                  onPress={() => props.navigation.openDrawer()}>
                  <Image
                    source={require('../assets/drawerMenu.png')}
                    style={styles.image}
                  />
                </TouchableOpacity>
              ),
            };
          }}
        />
        <Drawer.Screen
          name="searchDetails"
          component={SearchDetails}
          options={({navigation}) => {
            return {
              animation: 'slide_from_bottom',
              headerTransparent: true,
              headerTitle: '',
              headerShown: true,
              headerLeftContainerStyle: {
                // backgroundColor: 'red',
                paddingLeft: 20,
              },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={styles.closeIcon}>
                  <Icon name="close" color={Colors.white} size={34} />
                </TouchableOpacity>
              ),
            };
          }}
        />
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  searchHeader: {width: 31, height: 31},
  closeIcon: {
    marginTop: 10,
    backgroundColor: '#212121',
    width: 49,
    height: 49,
    borderRadius: 49,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    marginVertical: 7,
  },
  title: {
    color: Colors.offWhite,
    fontSize: 32,
    fontFamily: 'Epilogue-VariableFont_wght',
    fontWeight: 'bold',
  },
});

export default MainNavigator;
