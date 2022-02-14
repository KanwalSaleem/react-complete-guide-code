import React, {useEffect} from 'react'
import {Platform} from 'react-native'
import {createDrawerNavigator} from '@react-navigation/drawer'

import {useSelector, useDispatch} from 'react-redux'
import Colors from '../constants/Colors'

import CustomDrawer from '../components/Specialist User/CustomDrawer'

import Map from '../screens/Specialist User/Map'
import AboutUs from '../screens/Aboutus'
// import NewInspection from '../screens/Specialist User/NewInspection'
// import PastInspections from '../screens/Specialist User/PastInspections'
import Settings from '../screens/Settings'
import OurTeam from '../screens/OurTeam'
import ScheduleCalendar from '../screens/Specialist User/ScheduleCalender'

import InspectionsDetails from '../screens/Specialist User/InspectionsDetails'
import EditProfile from '../screens/EditProfile'
import {getUser} from '../store/actions/user'
import {setLang} from '../store/actions/language'
import AsyncStorage from '@react-native-async-storage/async-storage'

const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
  },

  headerShown: true,
  headerTitleAlign: 'center',
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
}

const Drawer = createDrawerNavigator()

export const DrawerNavigator = () => {
  const {
    map,
    aboutUs,
    ourTeam,
    scheduleCalendar,
    settings,
    editProfile,
    inspectionDetails,
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
      initialRouteName="map"
      drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="map"
        component={Map}
        options={{headerTitle: map.toUpperCase()}}
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
        name="calendar"
        component={ScheduleCalendar}
        options={{headerTitle: scheduleCalendar}}
      />

      <Drawer.Screen
        name="settings"
        component={Settings}
        options={{headerTitle: settings}}
      />
      <Drawer.Screen
        name="inspectionDetails"
        component={InspectionsDetails}
        options={{headerTitle: inspectionDetails}}
      />
      <Drawer.Screen
        name="editProfile"
        component={EditProfile}
        options={{headerTitle: editProfile}}
      />
    </Drawer.Navigator>
  )
}
