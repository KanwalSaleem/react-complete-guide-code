import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Avatar, Drawer} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';
import {AuthContext} from '../context/Auth';

const CustomDrawer = props => {
  const {isAuthenticated, Logout, isLoading} = useContext(AuthContext);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props} style={styles.drawerContent}>
        <View style={styles.mainContainer}>
          {isLoading ? (
            <View style={styles.activity}>
              <ActivityIndicator size="large" color={Colors.backgroundColor} />
            </View>
          ) : (
            <View style={styles.profileSection}>
              {!isAuthenticated && (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    props.navigation.navigate('authStack', {
                      screen: 'loginForm',
                    })
                  }>
                  <Avatar.Image
                    size={80}
                    source={require('../assets/avatar_profile.jpg')}
                  />
                </TouchableOpacity>
              )}

              {!isAuthenticated ? (
                <Text
                  style={styles.loginTitle}
                  onPress={() =>
                    props.navigation.navigate('authStack', {
                      screen: 'loginForm',
                    })
                  }>
                  Login
                </Text>
              ) : (
                <Text style={styles.loginTitle} onPress={() => Logout()}>
                  Logout
                </Text>
              )}
              <Icon
                color={Colors.backgroundColor}
                name="navigate-next"
                size={40}
              />
            </View>
          )}
          <View style={styles.deatilsContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                isAuthenticated
                  ? props.navigation.navigate('myOrders')
                  : props.navigation.navigate('authStack', {
                      screen: 'loginForm',
                    })
              }
              style={{alignItems: 'center'}}>
              <Icon color={Colors.backgroundColor} name="toc" size={32} />
              <Text style={styles.detailsText}>My Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => props.navigation.navigate('rewards')}
              style={{alignItems: 'center'}}>
              <Icon
                color={Colors.backgroundColor}
                name="card-giftcard"
                size={32}
              />
              <Text style={styles.detailsText}>Rewards</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => props.navigation.navigate('wallet')}
              activeOpacity={0.6}
              style={{alignItems: 'center'}}>
              <Icon
                color={Colors.backgroundColor}
                name="account-balance-wallet"
                size={32}
              />
              <Text style={styles.detailsText}>Wallet</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => props.navigation.navigate('cart')}
              style={{alignItems: 'center'}}>
              <Icon
                color={Colors.backgroundColor}
                name="shopping-cart"
                size={32}
              />
              <Text style={styles.detailsText}>Cart</Text>
            </TouchableOpacity>
          </View>
          <Drawer.Section>
            <View style={styles.drawerIem}>
              <DrawerItem
                onPress={() => props.navigation.navigate('shopNow')}
                icon={() => (
                  <View>
                    <Icon color={Colors.grey} name="house" size={25} />
                  </View>
                )}
                label="Shop Now"
                labelStyle={styles.label}
              />
              <DrawerItem
                onPress={() =>
                  isAuthenticated
                    ? props.navigation.navigate('myProfile')
                    : props.navigation.navigate('authStack', {
                        screen: 'loginForm',
                      })
                }
                icon={() => (
                  <View>
                    <Icon color={Colors.grey} name="account-box" size={25} />
                  </View>
                )}
                label="My Profile"
                labelStyle={styles.label}
              />
              <DrawerItem
                onPress={() => props.navigation.navigate('aboutUs')}
                icon={() => (
                  <View>
                    <Icon color={Colors.grey} name="person" size={25} />
                  </View>
                )}
                label="About Us"
                labelStyle={styles.label}
              />
              <DrawerItem
                onPress={() => props.navigation.navigate('termsPrivacy')}
                icon={() => (
                  <View>
                    <Icon
                      color={Colors.grey}
                      name="event-available"
                      size={30}
                    />
                  </View>
                )}
                label="Terms & Privacy"
                labelStyle={styles.label}
              />
              <DrawerItem
                onPress={() => props.navigation.navigate('contactUs')}
                icon={() => (
                  <View>
                    <Icon color={Colors.grey} name="location-on" size={25} />
                  </View>
                )}
                label="Contact Us"
                labelStyle={styles.label}
              />
            </View>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  activity: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerContent: {
    backgroundColor: Colors.primary,
  },
  mainContainer: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loginTitle: {
    fontFamily: 'OpenSans-Regular',
    color: Colors.backgroundColor,
    fontSize: 16,
  },
  drawerIem: {
    marginTop: 20,
  },
  label: {
    fontFamily: 'OpenSans-Regular',
    color: Colors.backgroundColor,
    fontSize: 16,
  },
  deatilsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 70,
    alignItems: 'center',
  },
  detailsText: {
    fontFamily: 'OpenSans-Regular',
    color: Colors.backgroundColor,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default CustomDrawer;
