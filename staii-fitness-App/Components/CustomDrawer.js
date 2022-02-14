import React, {useContext} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer'
import {Avatar, Drawer} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../Constants/Colors'
import AppContext from '../Context/AppContext'
import BlueButton from './BlueButton'

const CustomDrawer = (props) => {
  const {user, setUser, setIsUserSaved} = useContext(AppContext)
  const navigateToUpload = () => {
    if (user.user_type === 'teacher') {
      return props.navigation.navigate('uploadExpertVideo')
    }
    Alert.alert('', 'Restricted Access')
  }
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}>
      <TouchableOpacity
        style={styles.imageContainer}
        activeOpacity={0.6}
        // onPress={() => props.navigation.navigate('bottomBar')}
        onPress={() => props.navigation.closeDrawer()}>
        <Image
          source={require('../assets/drawerMenu.png')}
          style={styles.image}
        />
      </TouchableOpacity>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.titleContainer}
          activeOpacity={0.6}
          onPress={() => {}}>
          <Text style={styles.title}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.titleContainer}
          activeOpacity={0.6}
          onPress={() => {
            props.navigation.navigate('profile')
          }}>
          <Text style={styles.title}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.titleContainer}
          activeOpacity={0.6}
          onPress={() => {}}>
          <Text style={styles.title}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.titleContainer}
          activeOpacity={0.6}
          onPress={navigateToUpload}>
          <Text style={styles.title}>Upload Expert Video </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.titleContainer}
          activeOpacity={0.6}
          onPress={async () => {
            AsyncStorage.removeItem(
              'email',
              () => {
                setUser(null)

                setIsUserSaved(false)
              },
              (error) => console.log(error),
            )
          }}>
          <Text style={styles.title}>Logout</Text>
        </TouchableOpacity>
      </View>
      <BlueButton
        style={styles.button}
        onPress={() => props.navigation.navigate('analyse')}>
        Analyse
      </BlueButton>
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 10,
    justifyContent: 'center',
  },

  mainContainer: {alignItems: 'center', justifyContent: 'center'},
  image: {width: 24, height: 24},
  imageContainer: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 10,
    right: 10,
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
  button: {
    position: 'absolute',
    bottom: 50,
  },
})

export default CustomDrawer
