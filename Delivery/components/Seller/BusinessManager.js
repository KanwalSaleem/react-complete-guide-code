import React, {useEffect, useState, useContext} from 'react'

import {View, Text, StyleSheet, Linking, TouchableOpacity} from 'react-native'
import {Avatar, List} from 'react-native-paper'
import {ActivityIndicator} from 'react-native-paper'
import {AppContext} from '../../context/auth'
import moment from 'moment'
import BlueButton from '../Seller/BlueButton'

import colors from '../../constants/colors'
import {GraphRequest, GraphRequestManager} from 'react-native-fbsdk-next'

const BusinessManager = () => {
  const [businessManagers, setBusinessManagers] = useState([])
  const [loading, setLoading] = useState(false)
  const {user, updateUserProfile, login} = useContext(AppContext)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user.fbMarket?.business?.id) {
      console.log('dsaads')
      fetch(
        `https://graph.facebook.com/me?fields=businesses{picture{url},name,id,created_time}&access_token=${user.fbMarket.user.access_token}`,
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.businesses) {
            setBusinessManagers(res.businesses.data)
          }
        })
        .catch((e) => console.log(e))
    }
  }, [user])
  return (
    <List.Accordion
      expanded={user.fbMarket?.user?.id !== undefined && open}
      onPress={() =>
        user.fbMarket?.user?.id !== undefined && setOpen((prev) => !prev)
      }
      style={{
        // borderRadius: 10,
        backgroundColor: 'white',
      }}
      // titleStyle={{borderRadius: 10}}
      title="Business Manager"
      // left={(props) => <List.Icon {...props} icon="folder" />}
    >
      {user.fbMarket?.businessManager?.id ? (
        <>
          <Text style={styles.subtitle}>
            The Business Manager that owns all your Facebook business accounts.
          </Text>
          <View style={styles.businessItem}>
            <View style={styles.itemDetail}>
              <Avatar.Image
                source={{uri: user.fbMarket.businessManager.profileImg}}
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
                  {user.fbMarket.businessManager.name}
                </Text>
              </TouchableOpacity>
              <Text>ID: {user.fbMarket.businessManager.id}</Text>
              <Text>
                Created at:
                {moment(user.fbMarket.businessManager.created_item).format(
                  'DD MMM YYYY, HH:mm a',
                )}
              </Text>
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
                    'fbMarket.businessManager': {},
                    'fbMarket.facebookPage': {},
                    'fbMarket.commerceAccount': {},
                    'fbMarket.userAgreement': false,
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
            Connect the Business Manager you use to manage your business Page,
            accounts, and product catalog. You can only connect a Business
            Manager you have admin access to.
          </Text>
          <Text style={styles.subtitle}>
            After you connect, you may receive a verification email from
            Facebook. If so, you’ll need to confirm your business email address
            before proceeding.
          </Text>
          <View style={{paddingHorizontal: 5, paddingTop: 10}}>
            {businessManagers.map((item) => (
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
                  <Text>ID: {item.id}</Text>
                  <Text>
                    Created at:
                    {moment(item.created_item).format('DD MMM YYY, HH:mm a')}
                  </Text>
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
                        'fbMarket.businessManager.id': item.id,
                        'fbMarket.businessManager.name': item.name,
                        'fbMarket.businessManager.createdAt': item.created_time,
                        'fbMarket.businessManager.profileImg':
                          item.picture.data.url,
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
                <Avatar.Image style={styles.profileImage} />
                <Text style={{fontSize: 16, fontFamily: 'Poppins-Regular'}}>
                  Create Business Manager
                </Text>
              </View>
              <BlueButton
                onPress={() => {
                  const infoRequest = new GraphRequest(
                    `/${user.fbMarket?.user?.id}/businesses`,

                    {
                      name: 'Delivery Pay Business Manager',
                      vertical: 'ECOMMERCE',
                    },

                    function (error, res) {
                      setLoading(false)
                      console.log(res)
                      if (res.id) {
                        const subRequest = new GraphRequest(
                          '/me',
                          'GET',
                          {
                            fields:
                              'businesses{picture{url},name,id,created_time}',
                          },
                          function (res) {
                            if (res.businesses) {
                              setBusinessManagers(res.businesses.data)
                            }
                          },
                        )
                        new GraphRequestManager().addRequest(subRequest).start()
                      }
                      if (error) {
                        if (error.code === 1) {
                          // setErr(
                          //   <>
                          //     You have reached maximum number of business
                          //     manager one user can have. Use one of existing
                          //     business manager instead of creating a new one.
                          //   </>
                          // );
                          console.log(res.error.toString())
                        } else if (res.error.code === 3947) {
                          // setErr(
                          //   <>
                          //     You already have a Business Manager with the same
                          //     name. Select "Delivery Pay Business Manager"
                          //     instead of creating a new one. or Choose another.
                          //   </>
                          // );
                          console.log(res.error.toString())
                        } else {
                          // setErr(
                          //   <>{res.error.error_user_msg || res.error.message}</>
                          // );
                          console.log(res.error.toString())
                        }
                      }
                    },
                  )
                  new GraphRequestManager().addRequest(infoRequest).start()
                }}>
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
