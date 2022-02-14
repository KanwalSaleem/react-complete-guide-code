import React, {useEffect} from 'react'
import {Platform} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {createDrawerNavigator} from '@react-navigation/drawer'
import AsyncStorage from '@react-native-async-storage/async-storage'

import CustomDrawer from '../components/Individual User/CustomDrawer'
import {AuthNavigator} from './AppNavigation'

import Home from '../screens/Individual User/Home'
import AboutUs from '../screens/Aboutus'
import NewInspection from '../screens/Individual User/NewInspection'
import PastInspections from '../screens/Specialist User/PastInspections'
import Settings from '../screens/Settings'
import OurTeam from '../screens/OurTeam'
import Map from '../screens/Individual User/Map'
import EditProfile from '../screens/EditProfile'

import {setLang} from '../store/actions/language'
import {getUser} from '../store/actions/user'
// import InspectionDetails from '../screens/Specialist User/InspectionsDetails'
import Colors from '../constants/Colors'

const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
  },
  // headerTitleStyle: {
  //   fontFamily: 'open-sans-bold',
  // },
  // headerBackTitleStyle: {
  //   fontFamily: 'open-sans',
  // },
  headerShown: true,
  headerTitleAlign: 'center',
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
}

const Drawer = createDrawerNavigator()

export const DrawerNavigator = () => {
  const {
    home,
    aboutUs,
    ourTeam,
    pastInspection,
    settings,
    editProfile,
    selectPlace,
    newInspection,
  } = useSelector((state) => state.language)
  const dispatch = useDispatch()

  useEffect(
    () => {
      // setIsStarting(true)
      dispatch(getUser())
    },
    [dispatch],
  )
  useEffect(
    () => {
      const getLang = async () => {
        const language = await AsyncStorage.getItem('language')
        if (language) {
          dispatch(setLang(language))
        }
      }
      getLang()
    },
    [dispatch],
  )
  return (
    <Drawer.Navigator
      screenOptions={defaultStackNavOptions}
      drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="home"
        component={Home}
        options={{headerTitle: home}}
      />
      <Drawer.Screen
        name="about"
        component={AboutUs}
        options={{headerTitle: aboutUs}}
      />
      <Drawer.Screen
        name="team"
        component={OurTeam}
        options={{headerTitle: ourTeam}}
      />
      <Drawer.Screen
        name="pastInspections"
        component={PastInspections}
        options={{headerTitle: pastInspection}}
      />
      <Drawer.Screen
        name="newInspection"
        component={NewInspection}
        options={{headerTitle: newInspection}}
      />
      <Drawer.Screen
        name="signup"
        component={AuthNavigator}
        options={{headerTitle: 'Sign Up', headerShown: false}}
      />
      <Drawer.Screen
        name="settings"
        component={Settings}
        options={{headerTitle: settings}}
      />
      <Drawer.Screen
        name="editProfile"
        component={EditProfile}
        options={{headerTitle: editProfile}}
      />
      <Drawer.Screen
        name="map"
        component={Map}
        options={{headerTitle: selectPlace}}
      />
    </Drawer.Navigator>
  )
}
