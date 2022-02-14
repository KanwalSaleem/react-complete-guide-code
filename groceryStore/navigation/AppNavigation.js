import React, {useContext} from 'react';
import {Platform, TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Colors from '../constants/Colors';
import Dashboard from '../screens/Dashboard';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginForm from '../screens/LoginForm';
import RegisterForm from '../screens/RegisterForm';
import OTPScreen from '../screens/OTPScreen';
import Cart from '../screens/Cart';
import Products from '../screens/Products';
import Rewards from '../screens/Rewards';
import ContactUs from '../screens/ContactUs';
import ShopNow from '../screens/ShopNow';
import TermsPrivacy from '../screens/TermsPrivacy';
import AboutUs from '../screens/AboutUs';
import {AuthContext} from '../context/Auth';
import Wallet from '../screens/Wallet';
import MyOrders from '../screens/MyOrders';
import MyProfile from '../screens/MyProfile';
import Search from '../screens/Search';
import GoToCart from '../screens/GoToCart';
import SubCategory from '../screens/SubCategory';
import MyOrderDetails from '../screens/MyOrderDetails';

const Drawer = createDrawerNavigator();
const AuthStack = createNativeStackNavigator();

export const DrawerNavigator = () => {
  const {cart} = useContext(AuthContext);

  const defaultNavOptions = ({route, navigation}) => {
    return {
      headerStyle: {
        backgroundColor:
          Platform.OS === 'android' ? Colors.primary : Colors.primary,
      },
      headerTitleStyle: {
        // fontFamily: 'open-sans-bold',
      },
      headerBackTitleStyle: {
        // fontFamily: 'open-sans',
      },
      headerTintColor: Platform.OS === 'android' ? 'white' : 'white',
      headerShown: true,
      // headerTitleAlign: 'center',
      headerRight: data => {
        return (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              navigation.navigate('cart');
            }}
            style={styles.cartContainer}>
            <Icon
              name="shopping-cart"
              size={25}
              color={
                Colors.backgroundColor
                // Platform.OS === 'android'
                //   ? Colors.backgroundColor
                //   : Colors.primary
              }
            />
            <View style={styles.cartTextConatiner}>
              <Text style={styles.cartText}>{cart.items.length}</Text>
            </View>
          </TouchableOpacity>
        );
      },
    };
  };

  return (
    <Drawer.Navigator
      screenOptions={defaultNavOptions}
      backBehavior="history"
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="dashBoard"
        component={Dashboard}
        options={{headerTitle: ''}}
      />

      <Drawer.Screen
        name="authStack"
        component={AuthStackNavigator}
        options={{swipeEnabled: false, headerShown: false}}
      />

      <Drawer.Screen
        name="cart"
        component={Cart}
        options={{headerTitle: 'Cart'}}
      />
      <Drawer.Screen
        name="products"
        component={Products}
        options={{headerTitle: 'Products'}}
      />
      <Drawer.Screen
        name="rewards"
        component={Rewards}
        options={{headerTitle: 'Rewards'}}
      />
      <Drawer.Screen
        name="contactUs"
        component={ContactUs}
        options={{headerTitle: 'Contact Us'}}
      />
      <Drawer.Screen
        name="shopNow"
        component={ShopNow}
        options={{headerTitle: 'Shop Now'}}
      />
      <Drawer.Screen
        name="termsPrivacy"
        component={TermsPrivacy}
        options={{headerTitle: 'Terms & Privacy'}}
      />
      <Drawer.Screen
        name="aboutUs"
        component={AboutUs}
        options={{headerTitle: 'About Us'}}
      />
      <Drawer.Screen
        name="wallet"
        component={Wallet}
        options={{headerTitle: 'Wallet'}}
      />
      <Drawer.Screen
        name="myOrders"
        component={MyOrders}
        options={{headerTitle: 'My Orders'}}
      />
      <Drawer.Screen
        name="myProfile"
        component={MyProfile}
        options={{headerTitle: 'Edit Profile'}}
      />
      <Drawer.Screen
        name="search"
        component={Search}
        options={{headerTitle: 'Search'}}
      />
      <Drawer.Screen
        name="subCategory"
        component={SubCategory}
        options={{headerTitle: 'Products'}}
      />
      <Drawer.Screen
        name="goToCart"
        component={GoToCart}
        options={{headerTitle: 'Go To Cart'}}
      />
      <Drawer.Screen
        name="myOrderDetails"
        component={MyOrderDetails}
        options={{headerTitle: 'My Orders'}}
      />
    </Drawer.Navigator>
  );
};

export const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="loginForm"
        component={LoginForm}
        options={({navigation}) => ({
          headerShown: Platform.OS === 'ios' ? true : false,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" color={Colors.primary} size={25} />
            </TouchableOpacity>
          ),
        })}
      />
      <AuthStack.Screen
        name="registerForm"
        component={RegisterForm}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="otp"
        component={OTPScreen}
        options={{headerShown: false}}
      />
    </AuthStack.Navigator>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    flexDirection: 'row',
  },
  cartTextConatiner: {
    alignItems: 'center',
    justifyContent: 'center',
    right: 14,
    top: -10,
  },
  cartText: {
    color: Colors.backgroundColor,
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    backgroundColor: 'red',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 30,
  },
});
