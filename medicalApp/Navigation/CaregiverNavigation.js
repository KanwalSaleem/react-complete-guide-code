import React, {useEffect} from 'react'
import {TouchableOpacity, Image, StyleSheet} from 'react-native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Dashboard from '../screens/Caregiver/Dashboard'
import Map from '../screens/Caregiver/Map'
import TreatmentScreen from '../screens/Caregiver/TreatmentScreen'
import Reviews from '../screens/Caregiver/CaregiverReviews'
import RateReview from '../screens/Caregiver/CaregiverRateReview'
import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import BottomBar from '../components/BottomBar'
import ServiceRequest from '../screens/Caregiver/ServiceRequest'
import ServiceRequestDetails from '../screens/Caregiver/ServiceRequestDetail'
import AfterTreatmentChecklist from '../screens/Caregiver/AfterTreatmentChecklist'
import {useSelector, useDispatch} from 'react-redux'
import {APIURL} from '../constants/url'
import NetworkGroups from '../screens/Caregiver/NetworkGroups'
import ManageBankAccount from '../screens/ManageBankAccount'
import SettingsScreen from '../screens/Settings'
import NotificationsScreen from '../screens/Notifications'
import NetworkMembers from '../screens/Caregiver/NetworkMembers'
import CaregiverServiceHistory from '../screens/Caregiver/CaregiverServiceHistory'
import CareGiverServiceDetails from '../screens/Caregiver/CaregiverServiceDetails'
import ReportScreen from '../screens/Report'
import ProfileInfo from '../screens/ProfileInfo'
import {useNavigation} from '@react-navigation/native'
import EditProfile from '../screens/EditProfile'

// import {getItem} from '../store/actions/careGiver'

const BackLeft = (props) => (
  <TouchableOpacity
    onPress={() => props.navigation.goBack()}
    style={styles.iconView}>
    <Icon name="arrow-back-ios" color={Colors.backgroundColor} size={20} />
  </TouchableOpacity>
)
const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const StackNavigator = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector((state) => state.auth.user)
  const ImageLeft = (props) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('profileInfo')}>
        <Image
          source={{uri: `${APIURL}/storage/uploads/${user.image}`}}
          style={styles.image}
        />
      </TouchableOpacity>
    )
  }

  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={(props) => ({
        headerLeft: () => <BackLeft {...props} />,
        title: '',
        headerStyle: {
          backgroundColor: 'black',
          borderBottomWidth: 0,
          shadowColor: 'transparent',
        },

        headerLeftContainerStyle: {
          marginLeft: 10,
          marginTop: 10,
        },
        headerRightContainerStyle: {
          marginRight: 5,
        },

        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Roboto-Bold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('notificationsScreen')}>
            <Icon
              name="notifications"
              color={Colors.backgroundColor}
              size={30}
            />
          </TouchableOpacity>
        ),
      })}>
      <Stack.Screen
        name="home"
        component={Dashboard}
        options={{headerLeft: () => <ImageLeft />}}
      />
      <Stack.Screen name="map" component={Map} />
      <Stack.Screen name="treatment" component={TreatmentScreen} />
      <Stack.Screen
        name="serviceRequest"
        component={ServiceRequest}
        options={{
          title: 'Service Request',
        }}
      />
      <Stack.Screen
        name="serviceDetail"
        component={ServiceRequestDetails}
        options={{
          title: 'Service Request',

          headerTransparent: true,
        }}
      />

      <Stack.Screen
        name="reviews"
        component={Reviews}
        options={{
          title: 'Reviews',
          headerLeft: () => <ImageLeft />,
        }}
      />
      <Stack.Screen
        name="rateReview"
        component={RateReview}
        options={{
          title: 'Rate & Reviews',
        }}
      />
      <Stack.Screen
        name="afterTreatment"
        component={AfterTreatmentChecklist}
        options={{
          title: 'Diagnostic Check List',
        }}
      />
      <Stack.Screen
        name="networkGroups"
        component={NetworkGroups}
        options={{headerLeft: () => <ImageLeft />}}
      />
      <Stack.Screen
        name="manageBankAccount"
        component={ManageBankAccount}
        options={{
          title: 'Manage Bank Account',
          headerRight: () => false,
        }}
      />
      <Stack.Screen
        name="settingsScreen"
        component={SettingsScreen}
        options={{title: 'Settings', headerLeft: () => <ImageLeft />}}
      />
      <Stack.Screen
        name="notificationsScreen"
        component={NotificationsScreen}
        options={{title: 'Notifications', headerRight: () => false}}
      />
      <Stack.Screen
        name="networkMembers"
        component={NetworkMembers}
        options={{
          title: 'Network Members',
        }}
      />

      <Stack.Screen
        name="careGiverServiceHistory"
        component={CaregiverServiceHistory}
        options={{
          title: 'Service History',
          headerLeft: () => <ImageLeft />,
        }}
      />
      <Stack.Screen
        name="serviceDetails"
        component={CareGiverServiceDetails}
        options={{
          title: 'Service Details',
        }}
      />
      <Stack.Screen
        name="reportScreen"
        component={ReportScreen}
        options={{
          title: 'Report',
          headerLeft: () => <ImageLeft />,
        }}
      />
      <Stack.Screen
        name="profileInfo"
        component={ProfileInfo}
        options={{title: 'Profile'}}
      />
      <Stack.Screen
        name="editProfile"
        component={EditProfile}
        options={{
          title: 'Edit Profile',
        }}
      />
    </Stack.Navigator>
  )
}
const styles = StyleSheet.create({
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: 'black',
    // paddingTop: 20,
  },
  imageView: {
    width: '20%',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  title: {
    color: Colors.backgroundColor,
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
  iconView: {
    borderRadius: 100,
    // marginLeft: 5,
    backgroundColor: Colors.primary,
    width: 40,

    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 5,
    textAlign: 'center',
  },
})

export default StackNavigator
