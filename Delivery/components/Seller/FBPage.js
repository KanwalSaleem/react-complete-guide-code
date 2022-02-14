import React, {useEffect, useState, useContext} from 'react'

import {View, Text, StyleSheet, Touchable, Linking} from 'react-native'
import {Avatar, List} from 'react-native-paper'
import {ActivityIndicator} from 'react-native-paper'
import {AppContext} from '../../context/auth'
import moment from 'moment'
import BlueButton from '../Seller/BlueButton'
import {TouchableOpacity} from 'react-native-gesture-handler'
import colors from '../../constants/colors'
import {GraphRequest, GraphRequestManager} from 'react-native-fbsdk-next'

const BusinessManager = () => {
  //   const [businessManagers, setBusinessManagers] = useState([])
  const [loading, setLoading] = useState(false)
  const {user, updateUserProfile, login} = useContext(AppContext)
  const [fbPages, setFbPages] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user.fbMarket?.business?.id) {
      console.log('dsaads')
      fetch(
        `https://graph.facebook.com/me/accounts?fields=picture{url},access_token,name,category,business&access_token=${user.fbMarket.user.access_token}`,
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.data) {
            setFbPages(res.data)
          }
          console.log(res)
        })
    }
  }, [user])
  return (
    <List.Accordion
      expanded={user.fbMarket?.businessManager?.id !== undefined && open}
      onPress={() =>
        user.fbMarket?.businessManager?.id && setOpen((prev) => !prev)
      }
      style={{
        // borderRadius: 10,
        backgroundColor: 'white',
      }}
      // titleStyle={{borderRadius: 10}}
      title="Facebook Page"
      // left={(props) => <List.Icon {...props} icon="folder" />}
    >
      {user.fbMarket?.facebookPage?.id ? (
        <>
          <Text style={styles.subtitle}>
            The Facebook business Page that you use to sell your products or
            post ads.
          </Text>
          <View style={styles.businessItem}>
            <View style={styles.itemDetail}>
              <Avatar.Image
                source={{uri: user.fbMarket.facebookPage.profileImg}}
                style={styles.profileImage}
              />
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  Linking.openURL(
                    `https://business.facebook.com/latest/home?nav_ref=bm_home_redirect&business_id=${user.fbMarket.businessManager.id}`,
                  )
                }>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.blue,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {user.fbMarket.facebookPage.name}
                </Text>
              </TouchableOpacity>
              <Text>Category: {user.fbMarket.facebookPage.category}</Text>
              {/* <Text>
                Created at:
                {moment(user.fbMarket.businessManager.created_item).format(
                  'DD MMM YYY, HH:mm a',
                )}
              </Text> */}
            </View>
            {loading ? (
              <ActivityIndicator
                color={colors.blue}
                style={{flexBasis: '31%'}}
              />
            ) : (
              <BlueButton
                onPress={() => {
                  setLoading(true)
                  updateUserProfile({
                    fbMarket: {
                      user: user.fbMarket.user,
                      businessManager: user.fbMarket.businessManager,
                    },
                  }).then(({user: newUser}) => {
                    setLoading(false)
                    login((prev) => ({
                      ...prev,
                      fbMarket: newUser.fbMarket,
                    }))
                  })
                }}>
                Disconnect
              </BlueButton>
            )}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>
            Connect the business Page you use to sell products or post ads. You
            can only connect a Page you have admin access to.
          </Text>

          <View style={{paddingHorizontal: 5, paddingTop: 10}}>
            {fbPages.map((item) => (
              <View key={item.id} style={styles.businessItem}>
                <View style={styles.itemDetail}>
                  <Avatar.Image
                    source={{uri: item.picture.data.url}}
                    style={styles.profileImage}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() =>
                      Linking.openURL(
                        `https://business.facebook.com/latest/home?nav_ref=bm_home_redirect&business_id=${item.business_id}&asset_id=${item.asset_id}`,
                      )
                    }>
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.blue,
                        fontFamily: 'Poppins-Regular',
                      }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                  <Text>{item.category}</Text>
                  {/* <Text>
                    Created at:
                    {moment(item.created_item).format('DD MMM YYY, HH:mm a')}
                  </Text> */}
                </View>
                {loading ? (
                  <ActivityIndicator
                    color={colors.blue}
                    style={{flexBasis: '31%'}}
                  />
                ) : (
                  <BlueButton
                    onPress={() => {
                      setLoading(true)
                      updateUserProfile({
                        'fbMarket.facebookPage.id': item.id,
                        'fbMarket.facebookPage.name': item.name,
                        'fbMarket.facebookPage.access_token': item.access_token,
                        'fbMarket.facebookPage.profileImg':
                          item.picture.data.url,
                        'fbMarket.facebookPage.category': item.category,
                      }).then(({user: newUser}) => {
                        setLoading(false)
                        login((prev) => ({
                          ...prev,
                          fbMarket: newUser.fbMarket,
                        }))
                      })
                    }}>
                    Connect
                  </BlueButton>
                )}
              </View>
            ))}
            <View style={styles.businessItem}>
              <View>
                <Avatar.Image style={styles.profileImage} source={{}} />
                <Text style={{fontSize: 16, fontFamily: 'Poppins-Regular'}}>
                  Create Page
                </Text>
              </View>
              <BlueButton
                // onPress={() => {
                //   const infoRequest = new GraphRequest(
                //     `/${user.fbMarket?.user?.id}/businesses`,

                //     {
                //       name: 'Delivery Pay Business Manager',
                //       vertical: 'ECOMMERCE',
                //     },

                //     function (error, res) {
                //       setLoading(false)
                //       console.log(res)
                //       if (res.id) {
                //         const subRequest = new GraphRequest(
                //           '/me',
                //           'GET',
                //           {
                //             fields:
                //               'businesses{picture{url},name,id,created_time}',
                //           },
                //           function (res) {
                //             if (res.businesses) {
                //               setFbPages(res.businesses.data)
                //             }
                //           },
                //         )
                //         new GraphRequestManager().addRequest(subRequest).start()
                //       }
                //       if (error) {
                //         if (error.code === 1) {
                //           // setErr(
                //           //   <>
                //           //     You have reached maximum number of business
                //           //     manager one user can have. Use one of existing
                //           //     business manager instead of creating a new one.
                //           //   </>
                //           // );
                //           console.log(res.error.toString())
                //         } else if (res.error.code === 3947) {
                //           // setErr(
                //           //   <>
                //           //     You already have a Business Manager with the same
                //           //     name. Select "Delivery Pay Business Manager"
                //           //     instead of creating a new one. or Choose another.
                //           //   </>
                //           // );
                //           console.log(res.error.toString())
                //         } else {
                //           // setErr(
                //           //   <>{res.error.error_user_msg || res.error.message}</>
                //           // );
                //           console.log(res.error.toString())
                //         }
                //       }
                //     },
                //   )
                //   new GraphRequestManager().addRequest(infoRequest).start()
                // }}
                onPress={() =>
                  Linking.openURL(
                    'https://www.facebook.com/pages/create/?ref_type=hc',
                  )
                }>
                Create New
              </BlueButton>
            </View>
          </View>
        </>
      )}
    </List.Accordion>
  )
}
const styles = StyleSheet.create({
  subtitle: {
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 10,
  },
  businessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 0.5,
    padding: 5,
  },
  itemDetail: {
    // alignItems: 'center',
  },
  profileImage: {marginLeft: 20},
})

export default BusinessManager
