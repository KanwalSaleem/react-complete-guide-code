import React, {useContext, useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import {List} from 'react-native-paper'
import Header from '../../components/Header'
import BottomBar from '../../components/BottomBar'
import CommerceAccount from '../../components/Seller/CommerceAccount'
import {AppContext} from '../../context/auth'

import ConnectFB from '../../components/Seller/ConnectFB'
import BusinessManager from '../../components/Seller/BusinessManager'
import FBPage from '../../components/Seller/FBPage'
import InstagramAccount from '../../components/Seller/InstagramAccount'
import TermsCondition from '../../components/Seller/TermsCondition'

const FbMarketPlace = () => {
  const {login, user} = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  return (
    <>
      <View style={styles.screen}>
        <Header />
        <ScrollView style={{flex: 1, padding: 5}}>
          <List.Section
            title="Facebook marketplace"
            titleStyle={{
              fontFamily: 'Poppins-Regular',
              fontSize: 20,
              // borderRadius: 10,
            }}
            style={{
              borderRadius: 10,
              elevation: 6,
              backgroundColor: 'white',
              paddingBottom: 10,
            }}>
            <ConnectFB loading={loading} setLoading={setLoading} />
            <BusinessManager />
            <FBPage />
            <InstagramAccount />
            <CommerceAccount />
            <TermsCondition />
          </List.Section>
        </ScrollView>
      </View>
      <BottomBar style={{bottom: 0}} />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 10,
  },
})

export default FbMarketPlace
