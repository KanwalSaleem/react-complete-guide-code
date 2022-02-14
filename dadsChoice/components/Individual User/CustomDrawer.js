import React, {useState} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native'
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer'
import {Avatar, Drawer, Caption} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AwesomeIcon from 'react-native-vector-icons/FontAwesome'

import {useDispatch, useSelector} from 'react-redux'

import {logout} from '../../store/actions/auth'

import Colors from '../../constants/Colors'
import {APIURL} from '../../constants/url'

const CustomDrawer = (props) => {
  const {
    home,
    aboutUs,
    ourTeam,
    newInspection,
    pastInspection,
    settings,

    logoutText,
    individual,
  } = useSelector((state) => state.language)
  const {img, firstName, lastName} = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.profileSection}>
            <Avatar.Image
              size={100}
              source={{
                uri: `${APIURL}/storage/uploads/${img}`,
              }}
              // source={require('../../assets/40pxicon.png')}
              style={{marginRight: 10}}
            />
            <View style={styles.profileInfo}>
              <Text style={{fontSize: 20}}>{`${firstName} ${lastName}`}</Text>
              <Caption style={{fontSize: 16}}>{individual}</Caption>
            </View>
          </View>
          <Drawer.Section>
            <View style={{paddingLeft: 20}}>
              <DrawerItem
                onPress={() => props.navigation.navigate('home')}
                icon={() => (
                  <View style={{marginRight: -20}}>
                    <Icon color={Colors.primary} name="home" size={30} />
                  </View>
                )}
                label={home}
                labelStyle={styles.label}
              />
              <DrawerItem
                onPress={() => props.navigation.navigate('newInspection')}
                icon={() => (
                  <View style={{marginRight: -20}}>
                    <Icon color={Colors.primary} name="list-alt" size={30} />
                  </View>
                )}
                label={newInspection}
                labelStyle={styles.label}
              />
              <DrawerItem
                onPress={() => props.navigation.navigate('pastInspections')}
                icon={() => (
                  <View style={{marginRight: -20}}>
                    <Icon
                      color={Colors.primary}
                      name="content-paste"
                      size={32}
                    />
                  </View>
                )}
                label={pastInspection}
                labelStyle={styles.label}
              />
              <DrawerItem
                onPress={() => props.navigation.navigate('settings')}
                icon={() => (
                  <View style={{marginRight: -20}}>
                    <Icon color={Colors.primary} name="settings" size={30} />
                  </View>
                )}
                label={settings}
                labelStyle={styles.label}
              />
              <DrawerItem
                onPress={() => props.navigation.navigate('team')}
                icon={() => (
                  <View style={{marginRight: -20}}>
                    <Icon color={Colors.primary} name="group" size={30} />
                  </View>
                )}
                label={ourTeam}
                labelStyle={styles.label}
              />
              <DrawerItem
                onPress={() => props.navigation.navigate('about')}
                icon={() => (
                  <View style={{marginRight: -20}}>
                    <Icon color={Colors.primary} name="support" size={30} />
                  </View>
                )}
                label={aboutUs}
                labelStyle={styles.label}
              />
            </View>
          </Drawer.Section>
          <View style={styles.logoutContainer}>
            <DrawerItem
              onPress={() => {
                setLoading(true)
                dispatch(logout())
              }}
              icon={() => (
                <View style={{marginRight: -20}}>
                  {loading ? (
                    <ActivityIndicator color={Colors.primary} />
                  ) : (
                    <Icon
                      color={Colors.primary}
                      name="settings-power"
                      size={32}
                    />
                  )}
                </View>
              )}
              labelStyle={styles.label}
              label={logoutText}
            />
          </View>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://www.facebook.com/B-onet-106814018379583/',
                )
              }}>
              <AwesomeIcon color={Colors.primary} name="facebook" size={32} />
            </TouchableOpacity>
            <TouchableOpacity>
              <AwesomeIcon color={Colors.primary} name="linkedin" size={32} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://www.instagram.com/b_onet_/')
              }}>
              <AwesomeIcon color={Colors.primary} name="instagram" size={32} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://twitter.com/B_onet_?s=08')
              }}>
              <AwesomeIcon color={Colors.primary} name="twitter" size={32} />
            </TouchableOpacity>
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    margin: 10,
    paddingTop: 20,
    paddingLeft: 20,
  },
  profileInfo: {
    maxWidth: 100,
  },
  label: {
    fontSize: 16,
    color: 'black',
  },
  logoutContainer: {
    marginTop: 50,
    paddingLeft: 20,
  },
  socialContainer: {
    flexDirection: 'row',

    marginTop: 30,

    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
  },
})

export default CustomDrawer
