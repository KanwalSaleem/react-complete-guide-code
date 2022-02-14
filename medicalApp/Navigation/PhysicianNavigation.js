import React from 'react'
import {StyleSheet, TouchableOpacity, Image} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {useSelector} from 'react-redux'
import Dashboard from '../screens/Physician/Dashboard'
import ServiceRequest from '../screens/Physician/PhysicianServiceRequest'
import Reviews from '../screens/Physician/PhysicianReviews'
import Diagnostic from '../screens/Physician/DiagnosticTreatment'
import PhysicianServiceHistory from '../screens/Physician/PhysicianServiceHistory'
import CallScreen from '../screens/Physician/CallScreen'
import {APIURL} from '../constants/url'
import ManageBankAccount from '../screens/ManageBankAccount'
import SettingsScreen from '../screens/Settings'
import NotificationsScreen from '../screens/Notifications'
import Colors from '../constants/Colors'
import Reconnect from '../screens/Physician/Reconnect'
import {PROPERTY_TYPES} from '@babel/types'
import PhysicianServiceDetails from '../screens/Physician/PhysicianServiceDetails'
import ProfileInfo from '../screens/ProfileInfo'
import {useNavigation} from '@react-navigation/native'
import EditProfile from '../screens/EditProfile'

const BackLeft = (props) => (
  <TouchableOpacity
    onPress={() => props.navigation.goBack()}
    style={styles.iconView}>
    <Icon name="arrow-back-ios" color={Colors.backgroundColor} size={20} />
  </TouchableOpacity>
)

const Stack = createNativeStackNavigator()

const StackNavigator = () => {
  const navigation = useNavigation()

  const user = useSelector((state) => state.auth.user)
  console.log(user.image)
  const ImageLeft = (props) => (
    <TouchableOpacity onPress={() => navigation.navigate('profileInfo')}>
      <Image
        source={{uri: `${APIURL}/storage/uploads/${user.image}`}}
        style={styles.image}
      />
    </TouchableOpacity>
  )

  return (
    <Stack.Navigator
      screenOptions={(props) => ({
        headerLeft: () => <BackLeft {...props} />,

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
      })}
      // tabBar={(props) => <BottomBar {...props} />}
    >
      <Stack.Screen
        name="home"
        component={Dashboard}
        options={{title: '', headerLeft: () => <ImageLeft />}}
      />
      <Stack.Screen
        name="serviceRequest"
        component={ServiceRequest}
        options={{
          title: 'Service Request',
        }}
      />
      <Stack.Screen name="reviews" component={Reviews} />
      <Stack.Screen name="diagnostic" component={Diagnostic} />
      <Stack.Screen
        name="serviceHistory"
        component={PhysicianServiceHistory}
        options={{title: 'Service History', headerLeft: () => <ImageLeft />}}
      />
      <Stack.Screen name="reconnect" component={Reconnect} />
      <Stack.Screen name="call" component={CallScreen} />
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
        name="serviceDetails"
        component={PhysicianServiceDetails}
        options={{title: 'Service Details'}}
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
    marginLeft: 5,
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
