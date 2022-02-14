import React, {useEffect, useState, useContext} from 'react'

import {View, Text, StyleSheet, Linking} from 'react-native'
import {Avatar, List} from 'react-native-paper'
import {ActivityIndicator} from 'react-native-paper'
import {AppContext} from '../../context/auth'

import BlueButton from '../Seller/BlueButton'

import colors from '../../constants/colors'

const CommerceAccount = () => {
  const {user, updateUserProfile, login} = useContext(AppContext)
  const [catalogs, setCatalogs] = useState([])
  const [catalog, setCatalog] = useState(
    user.fbMarket?.commerceAccount?.catalog,
  )
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setCatalog(user.fbMarket?.commerceAccount?.catalog)
    if (!user.fbMarket?.commerceAccount?.catalog?.id) {
      fetch(
        `https://graph.facebook.com/${user.fbMarket?.businessManager?.id}/owned_product_catalogs?fields=name&access_token=${user.fbMarket.user.access_token}`,
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res.data)
          setCatalogs(res.data)
        })
        .catch((e) => {
          setError(e.message)
          console.log(e)
        })
    }
  }, [user])
  return (
    <List.Accordion
      expanded={user.fbMarket?.facebookPage?.id !== undefined && open}
      onPress={() =>
        user.fbMarket?.facebookPage?.id && setOpen((prev) => !prev)
      }
      style={{
        // borderRadius: 10,
        backgroundColor: 'white',
      }}
      // titleStyle={{borderRadius: 10}}
      title="Commerce Account">
      <Text style={styles.subtitle}>
        Create a Commerce account to start selling on Facebook, Instagram, or
        both. Once you have an account you’ll be able to customize your Shop and
        collections in the{' '}
        <Text
          style={styles.blueText}
          onPress={() =>
            Linking.openURL(
              'https://www.facebook.com/business/help/2371372636254534',
            )
          }>
          Facebook Commerce Manager.
        </Text>
      </Text>
      {error && (
        <View style={styles.error}>
          <Text>{error}</Text>
        </View>
      )}
      <View style={{paddingHorizontal: 5, paddingTop: 10}}>
        {!user.fbMarket?.commerceAccount?.catalog?.id &&
          catalogs &&
          catalogs.map((item) => (
            <View key={item.id} style={styles.businessItem}>
              <View style={styles.itemDetail}>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'black',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {item.name}
                </Text>

                <Text>
                  ID:
                  {item.id}
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
                      'fbMarket.commerceAccount.catalog': item,
                    }).then(({user: newUser}) => {
                      setLoading(false)
                      if (newUser) {
                        login((prev) => ({
                          ...prev,
                          fbMarket: newUser.fbMarket,
                        }))
                      }
                    })
                  }}>
                  Connect
                </BlueButton>
              )}
            </View>
          ))}
        {catalog && (
          <View style={{borderWidth: 0.5}}>
            <Text style={[styles.subtitle, {fontSize: 16}]}>
              PRODUCTS WILL BE SYNCED TO THIS CATALOG
            </Text>
            <View style={styles.businessItem}>
              <View style={styles.itemDetail}>
                {catalog && (
                  <>
                    <Text style={styles.subtitle}>{catalog.name}</Text>
                    <Text style={styles.subtitle}>{catalog.id}</Text>
                  </>
                )}
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
                      'fbMarket.commerceAccount.catalog': null,
                    }).then(({user: newUser}) => {
                      setLoading(false)
                      if (newUser) {
                        login((prev) => ({
                          ...prev,
                          fbMarket: newUser.fbMarket,
                        }))
                      }
                    })
                  }}>
                  Disconnect
                </BlueButton>
              )}
            </View>
          </View>
        )}
        {!catalog && (
          <View
            style={[styles.businessItem, {justifyContent: 'space-between'}]}>
            {/* <View style={styles.itemDetail}> */}
            <Avatar.Image />
            {/* </View> */}
            <BlueButton
              onPress={async () => {
                setLoading(true)
                fetch(
                  `https://graph.facebook.com/${user.fbMarket.businessManager.id}/owned_product_catalogs?access_token=${user.fbMarket.user.access_token}`,
                )
                  .then((res) => res.json())
                  .then(async (res) => {
                    // console.log(data, 'data')
                    const delCatalog =
                      res.data?.find(
                        (item) => item.name === 'Delivery Pay Product Catalog',
                      ) ||
                      (await fetch(
                        `https://graph.facebook.com/${user.fbMarket.businessManager.id}/owned_product_catalogs?access_token=${user.fbMarket.user.access_token}&name=Delivery Pay Product Catalog`,
                      )
                        .then((res) => res.json())
                        .then((res) => {
                          console.log('hello')
                          setLoading(false)
                          if (res.id) {
                            return {
                              ...res,
                              name: 'Delivery Pay Product Catalog',
                            }
                          }
                          if (res.error) {
                            console.log(res.error)
                          }
                        }))
                    if (delCatalog) {
                      setCatalog(delCatalog)
                      setLoading(true)
                      updateUserProfile({
                        'fbMarket.commerceAccount.catalog': delCatalog,
                      }).then(({user: newUser}) => {
                        setLoading(false)
                        login((prev) => ({
                          ...prev,
                          fbMarket: newUser.fbMarket,
                        }))
                      })
                    }
                    setError(null)
                  })
                  .catch((e) => setError(e.message))
                setLoading(false)
              }}>
              Create New
            </BlueButton>
          </View>
        )}
      </View>
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
    // borderWidth: 0.5,
    padding: 5,
    // marginHorizontal: 5,

    paddingVertical: 10,
  },
  itemDetail: {
    // alignItems: 'center',
  },
  profileImage: {marginLeft: 20, alignSelf: 'center'},
  blueText: {
    color: colors.blue,
  },
  error: {
    padding: 10,
    backgroundColor: '#fcebeb',
    borderColor: '#ff5757',
    borderWidth: 0.5,
    borderRadius: 10,
    marginHorizontal: 10,
  },
})

export default CommerceAccount
