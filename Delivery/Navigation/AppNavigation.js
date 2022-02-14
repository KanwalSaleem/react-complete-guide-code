import React, {useEffect, useState, useContext} from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Login from '../screens/Auth/Login'
import SignUp from '../screens/Auth/SignUp'
import OtpScreen from '../screens/Auth/OtpScreen'
import CustomerCategory from '../screens/Auth/CustomerCategory'
import ForgotPassword from '../screens/Auth/ForgotPassword'
import NewPassword from '../screens/Auth/NewPassword'
import AddAddress from '../screens/AddAddress'
import EditAddress from '../screens/EditAddress'
import BuyerStartTransaction from '../screens/Buyer/StartTransaction'
import SellerStartTransaction from '../screens/Seller/StartTransaction'
import UserCategory from '../screens/UserCategory'
import HoleTransaction from '../screens/HoleTransaction'

import Wallet from '../screens/Wallet'

import Hold from '../screens/Hold'
import ContactUs from '../screens/ContactUs'
import PaymentMethod from '../screens/PaymentMethod'
import Deal from '../screens/Deal'
import TransactionHistory from '../screens/TransactionHistory'

import AccountSettings from '../screens/AccountSettings'
import ChatScreen from '../screens/ChatScreen'
import MyOrders from '../screens/Buyer/MyOrders'
import DisputeResloution from '../screens/Buyer/DisputeResolution'
import PendingOrders from '../screens/Buyer/PendingOrders'
import CurrentOrders from '../screens/Buyer/CurrentOrders'
import {io} from 'socket.io-client'

import {AppContext} from '../context/auth'
import OrderHistory from '../screens/Buyer/OrderHistory'
import OrderSummary from '../screens/Buyer/OrderSummary'
import DisputeSummary from '../screens/Buyer/DisputeSummary'
import Tickets from '../screens/Tickets'
import TicketDetails from '../screens/TicketDetail'
import ProductList from '../screens/Seller/ProductList'
import SingleProduct from '../screens/Seller/SingleProduct'
import Cart from '../screens/Cart'

import MyShop from '../screens/Seller/MyShop'
import ProductsServices from '../screens/Seller/ProductsServices'
import Orders from '../screens/Seller/Orders'
import Refunds from '../screens/Seller/Refunds'
import Campaigns from '../screens/Seller/Campaigns'
import FbMarketPlace from '../screens/Seller/FbMarketPlace'
import Settings from '../screens/Seller/Settings'

import SingleProductService from '../screens/Seller/SingleProductService'

const AuthStack = createStackNavigator()
const MainStack = createStackNavigator()

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator headerMode={'none'} initialRouteName="login">
      <AuthStack.Screen name="login" component={Login} />
      <AuthStack.Screen name="signup" component={SignUp} />
      <AuthStack.Screen name="otp" component={OtpScreen} />
      <AuthStack.Screen name="customerCategory" component={CustomerCategory} />
      <AuthStack.Screen name="forgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="newPassword" component={NewPassword} />
    </AuthStack.Navigator>
  )
}

export const MainNavigator = () => {
  const {user} = useContext(AppContext)
  const [rooms, setRooms] = useState([])
  const socket = io('https://deliverypay.in', {
    extraHeaders: {
      test: '1',
      cookie: user.cookie,
    },
    transports: ['polling'],
  })
  socket.connect()
  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }
  }, [socket])

  return (
    <>
      <MainStack.Navigator headerMode={false} initialRouteName="chooseCategory">
        <MainStack.Screen name="home/chooseCategory" component={UserCategory} />
        <MainStack.Screen
          name="home/buying"
          component={BuyerStartTransaction}
        />
        <MainStack.Screen
          name="home/selling"
          component={SellerStartTransaction}
        />
        <MainStack.Screen name="wallet" component={Wallet} />
        <MainStack.Screen name="addAddress" component={AddAddress} />
        <MainStack.Screen name="editAdress" component={EditAddress} />
        <MainStack.Screen name="deal">
          {(props) => (
            <Deal
              {...props}
              socket={socket}
              rooms={rooms}
              setRooms={setRooms}
            />
          )}
        </MainStack.Screen>

        <MainStack.Screen
          name="wallet/history"
          component={TransactionHistory}
        />
        <MainStack.Screen name="contact" component={ContactUs} />
        <MainStack.Screen name="hold" component={Hold} />
        <MainStack.Screen name="paymentMethod" component={PaymentMethod} />
        <MainStack.Screen name="holeTransaction" component={HoleTransaction} />
        <MainStack.Screen name="chat">
          {(props) => <ChatScreen {...props} socket={socket} rooms={rooms} />}
        </MainStack.Screen>
        <MainStack.Screen name="settings" component={AccountSettings} />
        <MainStack.Screen name="orders/myOrders" component={MyOrders} />
        <MainStack.Screen
          name="orders/pendingOrders"
          component={PendingOrders}
        />
        <MainStack.Screen
          name="orders/disputes"
          component={DisputeResloution}
        />
        <MainStack.Screen
          name="orders/CurrentOrders"
          component={CurrentOrders}
        />
        <MainStack.Screen name="orders/orderHistory" component={OrderHistory} />
        <MainStack.Screen name="orders/summary" component={OrderSummary} />
        <MainStack.Screen
          name="orders/disputeSummary"
          component={DisputeSummary}
        />
        <MainStack.Screen name="tickets" component={Tickets} />
        <MainStack.Screen name="ticketDetail" component={TicketDetails} />
        <MainStack.Screen name="products" component={ProductList} />
        <MainStack.Screen name="singleProduct" component={SingleProduct} />
        <MainStack.Screen name="cart" component={Cart} />
        <MainStack.Screen name="shop/myShop" component={MyShop} />
        <MainStack.Screen
          name="shop/productsServices"
          component={ProductsServices}
        />
        <MainStack.Screen name="shop/orders" component={Orders} />
        <MainStack.Screen name="shop/refunds" component={Refunds} />
        <MainStack.Screen name="shop/campaigns" component={Campaigns} />
        <MainStack.Screen name="shop/fbMarket" component={FbMarketPlace} />
        <MainStack.Screen name="shop/settings" component={Settings} />
        <MainStack.Screen
          name="shop/singleProduct"
          component={SingleProductService}
        />
      </MainStack.Navigator>
    </>
  )
}
